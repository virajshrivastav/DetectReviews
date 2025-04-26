import os
import sys
from api.analyze_reviews import run_server

if __name__ == "__main__":
    # Get the port from environment variable (for cloud deployment) or command line arguments or use default
    port = int(os.environ.get('PORT', sys.argv[1] if len(sys.argv) > 1 else 8000))

    # Check if the API key is set
    if not os.environ.get('OPENROUTER_API_KEY'):
        print("Error: OPENROUTER_API_KEY environment variable not set")
        print("Please set the OPENROUTER_API_KEY environment variable and try again")
        print("Example: set OPENROUTER_API_KEY=your_api_key")
        sys.exit(1)

    # Run the server
    run_server(port)
