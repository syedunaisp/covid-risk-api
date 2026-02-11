from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# Create app
app = FastAPI()

# Load model
model = joblib.load("covid_risk_model.pkl")
print("Loaded model type:", type(model))


# ============================
# Input Schema (Pydantic)
# ============================
class CovidInput(BaseModel):
    cases_per_100k: float
    median_age: float
    aged_65_above: float


# ============================
# Home Route
# ============================
@app.get("/")
def home():
    return {"message": "COVID Risk Prediction API"}


# ============================
# Prediction Route
# ============================
@app.post("/predict")
def predict(data: CovidInput):

    features = np.array([[
        data.cases_per_100k,
        data.median_age,
        data.aged_65_above
    ]])

    prediction = model.predict(features)[0]

    # Risk mapping
    if prediction == 0:
        risk = "Low"
    elif prediction == 1:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "prediction": int(prediction),
        "risk": risk
    }
