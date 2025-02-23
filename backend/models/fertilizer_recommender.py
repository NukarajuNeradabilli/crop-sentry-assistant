
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from google.generativeai.types.safety_types import HarmBlockThreshold, HarmCategory

class FertilizerRecommender:
    def __init__(self):
        # Initialize safety settings
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        }
        
        # Initialize the Gemini AI model
        self.chat_model = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            google_api_key="AIzaSyBRmkSyw-LAU-kHaDG7tki_n2oC0VQh61M",
            temperature=0.3,
            safety_settings=self.safety_settings
        )

    def get_recommendations(self, data):
        # Create the composite prompt
        composite_prompt = f"""
        You are an expert agronomist. Based on the given inputs, recommend the **top 5 fertilizers**:

        **Input Data:**
        - **Pest Identified:** {data['pest_identified']}
        - **Environmental Factors:** 
          - Temperature: {data['temperature']}°C
          - Humidity: {data['humidity']}%
          - Moisture: {data['moisture']}%
          - Soil Type: {data['soil_type']}
        - **Soil Nutrient Levels:** 
          - Nitrogen: {data['nitrogen']}
          - Phosphorus: {data['phosphorus']}
          - Potassium: {data['potassium']}

        **Task:**
        - Provide a list of the **top 5 fertilizers** suitable for this scenario.
        - Include **one short reason** for why each fertilizer is recommended.
        - Format response as:
          1️⃣ **Fertilizer Name** – Short Reason.
          2️⃣ **Fertilizer Name** – Short Reason.
          3️⃣ **Fertilizer Name** – Short Reason.
          4️⃣ **Fertilizer Name** – Short Reason.
          5️⃣ **Fertilizer Name** – Short Reason.

        Please generate only the 5 bullet points in this format.
        """

        # Call the Gemini AI model
        response = self.chat_model.invoke(composite_prompt)

        # Extract response safely
        if hasattr(response, "content"):
            recommendation = response.content
        elif isinstance(response, dict) and "content" in response:
            recommendation = response["content"]
        else:
            recommendation = str(response)

        # Process recommendations
        fertilizers = recommendation.strip().split("\n")
        recommendations = []
        
        for fert in fertilizers:
            if "**" in fert:  # Check if it's a properly formatted recommendation
                name_part = fert.split("–")[0].strip()
                reason_part = fert.split("–")[1].strip() if len(fert.split("–")) > 1 else ""
                name = name_part.replace("**", "").split(" ", 1)[1]  # Remove emoji and asterisks
                
                recommendations.append({
                    "name": name,
                    "description": reason_part,
                    "dosage": "Apply as per manufacturer's instructions"  # Default dosage message
                })

        return recommendations

