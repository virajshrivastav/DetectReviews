import os
import sys
import argparse
from review_analyzer import process_excel_file, get_fake_reviews_list, get_review_stats

def test_review_analyzer(file_path, api_key, model_id="microsoft/mai-ds-r1:free"):
    """
    Test the review analyzer with a sample file
    
    Args:
        file_path: Path to the Excel file
        api_key: OpenRouter API key
        model_id: ID of the model to use
    """
    print(f"Testing review analyzer with file: {file_path}")
    print(f"Using model: {model_id}")
    
    # Process the file
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
        
        return True
    else:
        print("Analysis failed")
        return False

def main():
    parser = argparse.ArgumentParser(description="Test the review analyzer")
    parser.add_argument("--file", required=True, help="Path to the Excel file")
    parser.add_argument("--api-key", required=True, help="OpenRouter API key")
    parser.add_argument("--model", default="microsoft/mai-ds-r1:free", help="Model ID to use")
    
    args = parser.parse_args()
    
    test_review_analyzer(args.file, args.api_key, args.model)

if __name__ == "__main__":
    main()
