from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.route("/")
def index():
    return "Sympta backend is running!"

@app.route("/diagnose", methods=["POST"])
def diagnose():
    data = request.json
    symptoms = data.get("symptoms", "")

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "mistralai/mistral-7b-instruct:free",
            "messages": [{"role": "user", "content": symptoms}],
            "max_tokens": 300,
        },
    )

    result = response.json()
    message = result["choices"][0]["message"]["content"]
    return jsonify({"diagnosis": message})

if __name__ == "__main__":
    app.run(debug=True)