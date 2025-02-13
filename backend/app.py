
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
import tensorflow as tf
import pandas as pd
from tensorflow.keras.preprocessing import image
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load model and data
MODEL_PATH = "pest_model.h5"
CSV_PATH = "Pesticides_lowercase.csv"
model = tf.keras.models.load_model(MODEL_PATH)
pesticide_df = pd.read_csv(CSV_PATH)

# Define pest labels
class_labels = [
    "adristyrannus", "aleurocanthus spiniferus", "alfalfa plant bug", 
    # ... keep existing code (pest labels array)
]

# Create pest to pesticide mapping
pest_to_pesticide = dict(zip(pesticide_df["Pest Name"], pesticide_df["Most Commonly Used Pesticides"]))

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict_pest_and_pesticide(img_path):
    img_array = preprocess_image(img_path)
    
    # Get pest prediction
    pest_pred = model.predict(img_array)
    predicted_pest_index = np.argmax(pest_pred)
    confidence = float(pest_pred[0][predicted_pest_index])
    
    predicted_pest = class_labels[predicted_pest_index] if predicted_pest_index < len(class_labels) else "Unknown Pest"
    recommended_pesticide = pest_to_pesticide.get(predicted_pest, "No recommendation available")
    
    return {
        "pestName": predicted_pest,
        "confidence": confidence,
        "severity": "high" if confidence > 0.8 else "medium" if confidence > 0.5 else "low",
        "recommendations": {
            "pesticides": [{"name": p.strip(), "description": "Recommended pesticide for the detected pest."} 
                          for p in recommended_pesticide.split(',')][:3],
            "fertilizers": []
        }
    }

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            result = predict_pest_and_pesticide(filepath)
            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # Clean up uploaded file
            if os.path.exists(filepath):
                os.remove(filepath)
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
