import pandas as pd
import os
import sys

def read_excel_file(file_path):
    """Read an Excel file and display its contents"""
    try:
        # Read the Excel file
        df = pd.read_excel(file_path)
        
        # Print basic information
        print(f"\nFile: {os.path.basename(file_path)}")
        print(f"Shape: {df.shape}")
        print("\nColumns:")
        for col in df.columns:
            print(f"- {col}")
        
        # Print first few rows
        print("\nFirst 3 rows:")
        print(df.head(3).to_string())
        
        return df
    except Exception as e:
        print(f"Error reading file {file_path}: {str(e)}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        read_excel_file(file_path)
    else:
        print("Please provide a file path as an argument.")
