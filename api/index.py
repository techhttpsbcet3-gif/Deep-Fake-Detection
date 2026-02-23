import os
# Suppress TensorFlow and oneDNN info messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
import numpy as np
from PIL import Image
import io
import uvicorn  # <--- CRITICAL: This was missing

app = FastAPI()

# Enable React to talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'deepfake_detection_model_v2.keras')
# 1. Load your model (Ensure this filename matches what you downloaded)
try:
    # MODEL = tf.keras.models.load_model('deepfake_detection_model_v2.keras')
    
    MODEL = tf.keras.models.load_model(model_path)
    print("✅ Model loaded successfully!", flush=True)
except Exception as e:
    print(f"❌ Could not load model: {e}", flush=True)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read and resize image
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB').resize((256, 256)) #
        
        # Preprocessing matching your Colab exactly
        img_array = np.array(img, dtype='float32') #
        img_pp = preprocess_input(img_array) #
        img_batch = np.expand_dims(img_pp, axis=0) #

        # Get raw prediction
        prediction_score = float(MODEL.predict(img_batch)[0][0]) #
        
        # Based on your training: 1 is Real, 0 is Fake
        is_real = prediction_score >= 0.5 #
        label = "REAL" if is_real else "FAKE" #
        confidence = prediction_score if is_real else (1 - prediction_score)

        print(f"\n--- Request: {file.filename} ---", flush=True)
        print(f"Raw Math Output: {prediction_score:.6f}", flush=True)
        print(f"Final Result: {label}", flush=True)

        return {
            "label": label,
            "confidence": float(confidence),
            "status": "success"
        }
    except Exception as e:
        print(f"Server Error: {e}", flush=True)
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)