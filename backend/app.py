from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

app = Flask(__name__)
CORS(app, resources={r"/diagnose": {"origins": "*"}})  # Allow Vercel requests

load_dotenv()
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")

@app.route("/")
def index():
    return "Sympta backend is running!"

@app.route("/diagnose", methods=["POST"])
def diagnose():
    data = request.json
    prompt = data.get("prompt", "")  # Changed from symptoms
    if not prompt:
        return jsonify({"error": "Prompt required"}), 400
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 300,
            },
        )
        response.raise_for_status()
        result = response.json()
        message = result["choices"][0]["message"]["content"]
        return jsonify({"diagnosis": message})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))