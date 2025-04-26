import pandas as pd
import os
import json
import requests
import time

def read_excel_file(file_path):
    """
    Read an Excel file containing reviews
    
    Args:
        file_path: Path to the Excel file
        
    Returns:
        DataFrame containing the reviews
    """
    try:
        df = pd.read_excel(file_path)
        return df
    except Exception as e:
        print(f"Error reading file {file_path}: {str(e)}")
        return None

def analyze_reviews_with_ai(reviews, api_key, model_id="microsoft/mai-ds-r1:free"):
    """
    Analyze reviews using AI to detect fake reviews
    
    Args:
        reviews: List of reviews to analyze
        api_key: OpenRouter API key
        model_id: ID of the model to use
        
    Returns:
        Dictionary with analysis results
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # OpenRouter API endpoint
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    # Create a prompt for the AI
    prompt = """
    You are an expert at detecting fake product reviews. Analyze the following reviews and determine which ones are likely fake.
    
    Characteristics of fake reviews often include:
    1. Overly enthusiastic language without specific details
    2. Generic praise that could apply to any product
    3. Excessive use of exclamation marks
    4. Lack of specific user experience
    5. Unrealistic claims about product benefits
    6. Very short reviews with extreme ratings (1 or 5 stars)
    
    For each review, classify it as "REAL" or "FAKE" and provide a brief explanation.
    
    Format your response as a JSON object with the following structure:
    {
        "reviews": [
            {
                "review_text": "The original review text",
                "classification": "REAL or FAKE",
                "explanation": "Brief explanation for the classification"
            },
            ...
        ],
        "summary": {
            "total_reviews": total number,
            "real_reviews": number of real reviews,
            "fake_reviews": number of fake reviews
        }
    }
    
    Here are the reviews to analyze:
    
    """
    
    # Add the reviews to the prompt
    for i, review in enumerate(reviews):
        reviewer = review.get('reviewer_name', 'Anonymous')
        rating = review.get('star_rating', 'N/A')
        text = review.get('review_text', '')
        prompt += f"\nReview #{i+1} - Reviewer: {reviewer}, Rating: {rating} stars\n{text}\n"
    
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
                print(f"\nResponse received from {model_used} (took {elapsed_time:.2f} seconds)")
                
                # Parse the JSON response
                try:
                    # Find JSON content in the response (it might be wrapped in markdown code blocks)
                    json_start = message.find('{')
                    json_end = message.rfind('}') + 1
                    if json_start >= 0 and json_end > json_start:
                        json_content = message[json_start:json_end]
                        analysis_result = json.loads(json_content)
                        return analysis_result
                    else:
                        print("Could not find JSON content in the response")
                        return None
                except json.JSONDecodeError as e:
                    print(f"Error parsing JSON response: {str(e)}")
                    print("Raw response:", message)
                    return None
            else:
                print(f"Unexpected response format: {result}")
                return None
        else:
            print(f"Request failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return None

def process_excel_file(file_path, api_key, model_id="microsoft/mai-ds-r1:free"):
    """
    Process an Excel file containing reviews
    
    Args:
        file_path: Path to the Excel file
        api_key: OpenRouter API key
        model_id: ID of the model to use
        
    Returns:
        Dictionary with analysis results
    """
    # Read the Excel file
    df = read_excel_file(file_path)
    if df is None:
        return None
    
    # Convert DataFrame to list of dictionaries
    reviews = []
    for _, row in df.iterrows():
        review = {
            'reviewer_name': row.get('Reviewer Name', 'Anonymous'),
            'star_rating': row.get('Star Rating', 'N/A'),
            'review_text': row.get('Review Text', '')
        }
        reviews.append(review)
    
    # Analyze the reviews
    analysis_result = analyze_reviews_with_ai(reviews, api_key, model_id)
    
    return analysis_result

def get_fake_reviews_list(analysis_result):
    """
    Extract the list of fake reviews from the analysis result
    
    Args:
        analysis_result: Dictionary with analysis results
        
    Returns:
        List of fake review texts
    """
    if not analysis_result or 'reviews' not in analysis_result:
        return []
    
    fake_reviews = []
    for review in analysis_result['reviews']:
        if review.get('classification', '').upper() == 'FAKE':
            fake_reviews.append(review.get('review_text', ''))
    
    return fake_reviews

def get_review_stats(analysis_result):
    """
    Extract review statistics from the analysis result
    
    Args:
        analysis_result: Dictionary with analysis results
        
    Returns:
        Dictionary with review statistics
    """
    if not analysis_result:
        return {'real': 0, 'fake': 0}
    
    if 'summary' in analysis_result:
        return {
            'real': analysis_result['summary'].get('real_reviews', 0),
            'fake': analysis_result['summary'].get('fake_reviews', 0)
        }
    
    # If summary is not provided, calculate it manually
    real_count = 0
    fake_count = 0
    
    if 'reviews' in analysis_result:
        for review in analysis_result['reviews']:
            if review.get('classification', '').upper() == 'REAL':
                real_count += 1
            elif review.get('classification', '').upper() == 'FAKE':
                fake_count += 1
    
    return {'real': real_count, 'fake': fake_count}

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python review_analyzer.py <excel_file_path> <api_key> [model_id]")
        sys.exit(1)
    
    file_path = sys.argv[1]
    api_key = sys.argv[2]
    model_id = sys.argv[3] if len(sys.argv) > 3 else "microsoft/mai-ds-r1:free"
    
    result = process_excel_file(file_path, api_key, model_id)
    
    if result:
        # Print statistics
        stats = get_review_stats(result)
        print(f"\nAnalysis complete:")
        print(f"Total reviews: {stats['real'] + stats['fake']}")
        print(f"Real reviews: {stats['real']}")
        print(f"Fake reviews: {stats['fake']}")
        
        # Print fake reviews
        fake_reviews = get_fake_reviews_list(result)
        if fake_reviews:
            print("\nIdentified fake reviews:")
            for i, review in enumerate(fake_reviews):
                print(f"{i+1}. {review[:100]}..." if len(review) > 100 else f"{i+1}. {review}")
