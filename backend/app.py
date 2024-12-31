from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, initialize_app, auth, firestore, storage
from google.cloud import aiplatform
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Firebase
cred = credentials.Certificate(os.getenv('FIREBASE_SERVICE_ACCOUNT'))
firebase_app = initialize_app(cred, {'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET')})
db = firestore.client()
bucket = storage.bucket()

# Initialize Vertex AI
aiplatform.init(project=os.getenv('GOOGLE_CLOUD_PROJECT'))

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.form
    user_id = data.get('userId')
    message = data.get('message')
    file = request.files.get('file')

    file_url = None
    if file:
        file_extension = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        blob = bucket.blob(file_name)
        blob.upload_from_string(file.read(), content_type=file.content_type)
        blob.make_public()
        file_url = blob.public_url

    # Generate response using Vertex AI (MedLM)
    response = generate_text(message, file_url)

    # Store chat history in Firebase
    chat_ref = db.collection('chats').document(user_id)
    chat_ref.set({
        'messages': firestore.ArrayUnion([{
            'user': message,
            'bot': response,
            'file_url': file_url
        }])
    }, merge=True)

    return jsonify({'response': response, 'file_url': file_url})

@app.route('/api/history', methods=['GET'])
def get_history():
    user_id = request.args.get('userId')
    chat_ref = db.collection('chats').document(user_id)
    chat_doc = chat_ref.get()
    if chat_doc.exists:
        return jsonify(chat_doc.to_dict())
    return jsonify({'messages': []})

@app.route('/api/auth', methods=['POST'])
def authenticate():
    id_token = request.json['idToken']
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        return jsonify({'userId': uid})
    except:
        return jsonify({'error': 'Invalid token'}), 401

def generate_text(prompt, file_url=None):
    if file_url:
        prompt = f"Image URL: {file_url}\n\nUser message: {prompt}"
    model = aiplatform.TextGenerationModel.from_pretrained("medlm")
    response = model.predict(prompt, max_output_tokens=256)
    return response.text

if __name__ == '__main__':
    app.run(debug=True)
