import openai
import os
from dotenv import load_dotenv
from pathlib import Path
import json

env_path = Path('./config.env')
load_dotenv(dotenv_path=env_path)


# Load your API key from an environment variable or directly into the script
# It's better to use environment variables for production
API_KEY = os.getenv('OPENAI_API_KEY')
print(API_KEY==None)

openai.api_key = API_KEY

client = openai.OpenAI()
def generate_description(tags):
    """Generate a descriptive paragraph based on the tags provided."""
    prompt = "Generate a short description similar to this example'From the provided descriptors, it sounds like you're describing a red oscine bird perched on a tree branch outdoors. While the specific species cannot be determined with absolute certainty from these descriptors alone, oscines are typically songbirds known for their melodious calls. The mention of the color red suggests that the bird may have red plumage, which could potentially indicate species like robins, cardinals, or other red-colored passerines.' about the following tags: " +str(tags)
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # or use the latest available model
            messages=[{"role": "system", "content":"You are a helpful assistant."},
                      {"role": "user", "content": prompt}],
            max_tokens=100
        )
        #return response['choices'][0]['message'].strip()
        return response
    except Exception as e:
        print("Error with OpenAI API:", e)
        return "Failed to generate description."

# Example usage
if __name__ == "__main__":
    tags = []
    with open('tags.json', 'r') as openfile:
        json_object = json.load(openfile)
        tags = json_object
    #tags = ["American Robin"]
    description = generate_description(tags)
    print("Generated Description:", description)