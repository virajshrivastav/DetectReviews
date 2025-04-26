import requests
import json
import sys

def call_openrouter_model(api_key, prompt, model_id="thudm/glm-4-9b:free"):
    """
    Call a free model on OpenRouter
    
    Args:
        api_key: Your OpenRouter API key
        prompt: The text prompt to send to the model
        model_id: The ID of the model to use (default is a free, fast model)
    
    Returns:
        The model's response
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # OpenRouter API endpoint
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    # Request payload
    payload = {
        "model": model_id,  # Using a free model
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            result = response.json()
            # Extract the model's response
            if "choices" in result and len(result["choices"]) > 0:
                message = result["choices"][0]["message"]["content"]
                model_used = result.get("model", "Unknown model")
                print(f"✅ Successfully used model: {model_used}")
                print("\nResponse:")
                print("-" * 50)
                print(message)
                print("-" * 50)
                return message
            else:
                print(f"❌ Unexpected response format: {result}")
                return None
        else:
            print(f"❌ Request failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error occurred: {str(e)}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python test_free_model.py <api_key> <prompt> [model_id]")
        sys.exit(1)
    
    api_key = sys.argv[1]
    prompt = sys.argv[2]
    model_id = sys.argv[3] if len(sys.argv) > 3 else "thudm/glm-4-9b:free"  # Default to a free, fast model
    
    call_openrouter_model(api_key, prompt, model_id)
