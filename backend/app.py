
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models.yield_predictor import YieldPredictor
from models.fertilizer_recommender import FertilizerRecommender
from utils.file_handler import allowed_file, save_file, cleanup_file

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

# Initialize models (removed pest_classifier)
yield_predictor = YieldPredictor()
fertilizer_recommender = FertilizerRecommender()

# Removed the /api/analyze endpoint for pest detection as it's now handled by backend2

@app.route('/api/predict-yield', methods=['POST'])
def predict_yield():
    try:
        data = request.json
        print(data)
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        prediction = yield_predictor.predict(data)
        return jsonify({
            'prediction': prediction,
            'unit': 'kg per hectare'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommend-fertilizer', methods=['POST'])
def recommend_fertilizer():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        recommendations = fertilizer_recommender.get_recommendations(data)
        return jsonify({
            'recommendations': recommendations
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
