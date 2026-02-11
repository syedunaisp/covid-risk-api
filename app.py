from fastapi import FastAPI, HTTPException
import joblib
import numpy as np
import os

app = FastAPI()

MODEL_PATH = "covid_risk_model.pkl"


# Check if model file exists
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

# Load model
model = joblib.load(MODEL_PATH)

print("Loaded model type:", type(model))


@app.get("/")
def home():
    return {"message": "COVID Risk API is running"}


@app.post("/predict")
def predict(data: dict):

    try:
        cases = float(data["cases_per_100k"])
        age = float(data["median_age"])
        aged65 = float(data["aged_65_above"])

        X = np.array([[cases, age, aged65]])

        pred = model.predict(X)[0]

        risk_map = {0: "Low", 1: "Medium", 2: "High"}

        return {
            "prediction": int(pred),
            "risk": risk_map[int(pred)]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
