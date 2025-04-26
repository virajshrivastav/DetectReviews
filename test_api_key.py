import requests
import sys

def test_openrouter_api_key(api_key):
    """Test if the OpenRouter API key is valid by making a simple request."""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Simple request to the OpenRouter API
    url = "https://openrouter.ai/api/v1/models"
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("✅ API key is valid! Response:")
            print(response.json())
            return True
        else:
            print(f"❌ API key validation failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error occurred while testing API key: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
    else:
        api_key = input("Enter your OpenRouter API key: ")
    
    test_openrouter_api_key(api_key)
