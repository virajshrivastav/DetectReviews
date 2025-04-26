import requests
import json
import argparse
import time

def chat_with_model(api_key, prompt, model_id="thudm/glm-4-9b:free"):
    """
    Chat with a free model on OpenRouter
    
    Args:
        api_key: Your OpenRouter API key
        prompt: The text prompt to send to the model
        model_id: The ID of the model to use
    
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
        "model": model_id,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    print(f"Sending request to {model_id}...")
    start_time = time.time()
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        end_time = time.time()
        elapsed_time = end_time - start_time
        
        if response.status_code == 200:
            result = response.json()
            # Extract the model's response
            if "choices" in result and len(result["choices"]) > 0:
                message = result["choices"][0]["message"]["content"]
                model_used = result.get("model", "Unknown model")
                print(f"\n✅ Response from {model_used} (took {elapsed_time:.2f} seconds):")
                print("-" * 70)
                print(message)
                print("-" * 70)
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

def list_free_models():
    """Display a list of recommended free models"""
    print("\nRecommended Free Models:")
    print("-" * 70)
    print("1. thudm/glm-4-9b:free - A 9B parameter model, good general performance")
    print("2. microsoft/mai-ds-r1:free - Microsoft's free AI model with 163K context length")
    print("3. huggingfaceh4/zephyr-7b-beta:free - A 7B parameter model from Hugging Face")
    print("4. thudm/glm-z1-32b:free - A larger 32B parameter model for more complex tasks")
    print("5. moonshotai/kimi-vl-a3b-thinking:free - A vision-language model that can process images")
    print("-" * 70)

def main():
    parser = argparse.ArgumentParser(description="Chat with a free AI model using OpenRouter")
    parser.add_argument("--api-key", required=True, help="Your OpenRouter API key")
    parser.add_argument("--model", default="thudm/glm-4-9b:free", 
                        help="Model ID to use (default: thudm/glm-4-9b:free)")
    parser.add_argument("--list-models", action="store_true", help="List recommended free models")
    parser.add_argument("--prompt", help="The prompt to send to the model")
    
    args = parser.parse_args()
    
    if args.list_models:
        list_free_models()
        return
    
    if not args.prompt:
        # Interactive mode
        list_free_models()
        print("\nEnter 'q' to quit at any time.")
        print(f"Using model: {args.model}")
        
        while True:
            prompt = input("\nYou: ")
            if prompt.lower() == 'q':
                break
                
            chat_with_model(args.api_key, prompt, args.model)
    else:
        # Single prompt mode
        chat_with_model(args.api_key, args.prompt, args.model)

if __name__ == "__main__":
    main()
