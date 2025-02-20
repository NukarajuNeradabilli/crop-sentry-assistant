
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models.pest_classifier import PestClassifier
from models.pesticide_recommender import PesticideRecommender
from utils.file_handler import allowed_file, save_file, cleanup_file

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

# Initialize models
pest_classifier = PestClassifier(Config.MODEL_PATH)
pesticide_recommender = PesticideRecommender(Config.CSV_PATH)

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename, app.config['ALLOWED_EXTENSIONS']):
        try:
            # Save file
            filepath = save_file(file, app.config['UPLOAD_FOLDER'])
            
            # Process image
            pest_name, confidence = pest_classifier.predict(filepath)
            recommendations = pesticide_recommender.get_recommendations(pest_name)
            
            # Prepare response
            result = {
                "pestName": pest_name,
                "confidence": confidence,
                "severity": "high" if confidence > 0.8 else "medium" if confidence > 0.5 else "low",
                "recommendations": {
                    "pesticides": recommendations,
                    "fertilizers": []
                }
            }
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
        finally:
            # Clean up uploaded file
            cleanup_file(filepath)
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
