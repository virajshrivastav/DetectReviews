import os
import sys
import subprocess
import time
import signal
import platform

def check_api_key():
    """Check if the OpenRouter API key is set"""
    api_key = os.environ.get('OPENROUTER_API_KEY')
    if not api_key:
        print("Error: OPENROUTER_API_KEY environment variable not set")
        print("Please set the OPENROUTER_API_KEY environment variable and try again")
        print("Example: set OPENROUTER_API_KEY=your_api_key")
        return False
    return True

def start_processes():
    """Start both the API server and the frontend"""
    print("Starting FakeDetector application...")
    
    # Check if the API key is set
    if not check_api_key():
        return
    
    # Determine the correct command based on the OS
    is_windows = platform.system() == "Windows"
    npm_cmd = "npm.cmd" if is_windows else "npm"
    
    try:
        # Start the API server
        print("\n[1/2] Starting API server...")
        api_process = subprocess.Popen(
            [sys.executable, "run_api_server.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Wait for the API server to start
        time.sleep(2)
        
        # Check if the API server is running
        if api_process.poll() is not None:
            print("Error: Failed to start API server")
            return
        
        print("API server started successfully on port 8000")
        
        # Start the frontend
        print("\n[2/2] Starting frontend...")
        frontend_process = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Wait for the frontend to start
        time.sleep(5)
        
        # Check if the frontend is running
        if frontend_process.poll() is not None:
            print("Error: Failed to start frontend")
            api_process.terminate()
            return
        
        print("Frontend started successfully")
        print("\nFakeDetector is now running!")
        print("Open your browser and navigate to http://localhost:3000")
        
        # Print instructions
        print("\nPress Ctrl+C to stop the application")
        
        # Monitor the processes
        while True:
            # Check if either process has terminated
            if api_process.poll() is not None:
                print("API server has stopped. Shutting down...")
                frontend_process.terminate()
                break
            
            if frontend_process.poll() is not None:
                print("Frontend has stopped. Shutting down...")
                api_process.terminate()
                break
            
            # Read and print output from the API server
            api_output = api_process.stdout.readline()
            if api_output:
                print(f"[API] {api_output.strip()}")
            
            # Read and print output from the frontend
            frontend_output = frontend_process.stdout.readline()
            if frontend_output:
                print(f"[Frontend] {frontend_output.strip()}")
            
            time.sleep(0.1)
    
    except KeyboardInterrupt:
        print("\nShutting down FakeDetector...")
        
        # Terminate the processes
        if 'api_process' in locals():
            api_process.terminate()
        
        if 'frontend_process' in locals():
            frontend_process.terminate()
        
        print("Application stopped")

if __name__ == "__main__":
    start_processes()
