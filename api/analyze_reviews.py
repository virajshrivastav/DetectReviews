import os
import json
import tempfile
from http.server import BaseHTTPRequestHandler, HTTPServer
import sys
import io
import re
from urllib.parse import urlparse

# Add the parent directory to the path so we can import the review_analyzer module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from review_analyzer import process_excel_file, get_fake_reviews_list, get_review_stats

# Get the API key from environment variable
API_KEY = os.environ.get('OPENROUTER_API_KEY', '')

# Get allowed origins from environment variable or use default
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')

class ReviewAnalyzerHandler(BaseHTTPRequestHandler):
    def _set_headers(self, content_type='application/json'):
        self.send_response(200)
        self.send_header('Content-type', content_type)

        # Handle CORS
        origin = self.headers.get('Origin', '')
        if '*' in ALLOWED_ORIGINS:
            self.send_header('Access-Control-Allow-Origin', '*')
        elif origin in ALLOWED_ORIGINS:
            self.send_header('Access-Control-Allow-Origin', origin)
        elif any(origin.endswith(domain.strip()) for domain in ALLOWED_ORIGINS if domain.startswith('.')):
            self.send_header('Access-Control-Allow-Origin', origin)

        self.send_header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Origin, Accept, X-Requested-With')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Max-Age', '86400')  # 24 hours
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_HEAD(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'API server is running')
        elif self.path == '/api/analyze':
            # For preflight checks or health checks
            self._set_headers()
            self.wfile.write(json.dumps({'status': 'ready'}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def parse_multipart_form(self):
        """Parse multipart form data without using the cgi module"""
        content_type = self.headers.get('Content-Type', '')

        # Check if it's multipart/form-data
        if not content_type.startswith('multipart/form-data'):
            return None

        # Get the boundary
        boundary_match = re.search(r'boundary=(.+)', content_type)
        if not boundary_match:
            return None

        boundary = boundary_match.group(1)
        if boundary.startswith('"') and boundary.endswith('"'):
            boundary = boundary[1:-1]

        # Read the content length
        content_length = int(self.headers.get('Content-Length', 0))

        # Read the body
        body = self.rfile.read(content_length)

        # Split by boundary
        parts = body.split(f'--{boundary}'.encode())

        # Process each part
        form_data = {}
        for part in parts:
            if not part.strip():
                continue

            # Skip the last boundary marker
            if part.strip() == b'--':
                continue

            # Split headers and content
            try:
                headers_raw, content = part.split(b'\r\n\r\n', 1)
                headers_text = headers_raw.decode('utf-8')

                # Get the name
                name_match = re.search(r'name="([^"]+)"', headers_text)
                if not name_match:
                    continue

                name = name_match.group(1)

                # Check if it's a file
                filename_match = re.search(r'filename="([^"]+)"', headers_text)
                if filename_match:
                    filename = filename_match.group(1)
                    # Remove the trailing boundary marker if present
                    if content.endswith(b'\r\n'):
                        content = content[:-2]

                    form_data[name] = {
                        'filename': filename,
                        'content': content
                    }
                else:
                    # It's a regular field
                    # Remove the trailing boundary marker if present
                    if content.endswith(b'\r\n'):
                        content = content[:-2]

                    form_data[name] = content.decode('utf-8')
            except Exception as e:
                print(f"Error parsing part: {e}")
                continue

        return form_data

    def do_POST(self):
        print(f"Received POST request to {self.path}")
        print(f"Headers: {dict(self.headers)}")

        if self.path == '/api/analyze':
            try:
                # Parse the form data
                form_data = self.parse_multipart_form()
                print(f"Form data keys: {form_data.keys() if form_data else 'None'}")

                if not form_data:
                    self._set_headers()
                    self.wfile.write(json.dumps({'error': 'Invalid form data'}).encode())
                    return

                # Check if the file was uploaded
                if 'file' not in form_data:
                    self._set_headers()
                    self.wfile.write(json.dumps({'error': 'No file uploaded'}).encode())
                    return

                file_data = form_data['file']

                # Check if the file was uploaded
                if not file_data.get('filename'):
                    self._set_headers()
                    self.wfile.write(json.dumps({'error': 'No file selected'}).encode())
                    return

                # Create a temporary file to store the uploaded file
                with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as temp_file:
                    temp_file_path = temp_file.name
                    # Write the file data to the temporary file
                    temp_file.write(file_data['content'])

                try:
                    # Process the file
                    model_id = form_data.get('model', 'microsoft/mai-ds-r1:free')
                    if isinstance(model_id, dict) and 'content' in model_id:
                        model_id = model_id['content'].decode('utf-8')

                    result = process_excel_file(temp_file_path, API_KEY, model_id)

                    # Delete the temporary file
                    os.unlink(temp_file_path)

                    if result:
                        # Extract the fake reviews and statistics
                        fake_reviews = get_fake_reviews_list(result)
                        stats = get_review_stats(result)

                        # Return the results
                        self._set_headers()
                        self.wfile.write(json.dumps({
                            'stats': stats,
                            'fakeReviews': fake_reviews
                        }).encode())
                    else:
                        self._set_headers()
                        self.wfile.write(json.dumps({'error': 'Failed to analyze reviews'}).encode())
                except Exception as e:
                    # Delete the temporary file if it exists
                    if os.path.exists(temp_file_path):
                        os.unlink(temp_file_path)

                    self._set_headers()
                    self.wfile.write(json.dumps({'error': str(e)}).encode())
            except Exception as e:
                self._set_headers()
                self.wfile.write(json.dumps({'error': f'Server error: {str(e)}'}).encode())
        else:
            self.send_response(404)
            self.end_headers()

def run_server(port=8000):
    if not API_KEY:
        print("Error: OPENROUTER_API_KEY environment variable not set")
        print("Please set the OPENROUTER_API_KEY environment variable and try again")
        print("Example: set OPENROUTER_API_KEY=your_api_key")
        sys.exit(1)

    # For Render deployment, we need to listen on 0.0.0.0
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, ReviewAnalyzerHandler)
    print(f"Starting server on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run_server()
