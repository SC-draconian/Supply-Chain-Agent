from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import Dict, Any

from src.api.auth import require_admin
from src.processing.schemas import SupplyChainState, PredictionExplanation, Recommendation
from src.processing.normalization import normalize_state
from src.ingestion.weather_client import WeatherClient
from src.ingestion.news_client import NewsClient
from src.ingestion.logistics_client import LogisticsClient
from src.ingestion.supplier_client import SupplierClient
from src.scoring.predictor import Predictor
from src.recommendation.ranker import SupplierRanker
from src.core.security import log_audit_event

router = APIRouter()

weather_client = WeatherClient()
news_client = NewsClient()
logistics_client = LogisticsClient()
supplier_client = SupplierClient()
predictor = Predictor()
ranker = SupplierRanker()

@router.get("/health")
def health_check():
    return {"status": "healthy"}

@router.post("/trigger-analysis")
def trigger_analysis(location: str, keyword: str, port_id: str, current_user: dict = Depends(require_admin)):
    """
    Triggers an end-to-end evaluation using simulated ingestion.
    Requires admin privileges.
    """
    log_audit_event("TRIGGER_ANALYSIS", current_user["user_id"], f"Started analysis for {location}, {keyword}, {port_id}")
    
    # 1. Ingestion
    weather_data = weather_client.fetch_current_weather(location)
    news_data = news_client.fetch_latest_news(keyword)
    logistics_data = logistics_client.fetch_port_status(port_id)
    supplier_data = supplier_client.fetch_suppliers("ELECTRONICS")
    
    raw_state = {
        "weather": [weather_data],
        "news": [news_data],
        "logistics": [logistics_data],
        "suppliers": supplier_data
    }
    
    # 2. Normalization
    try:
        state = normalize_state(raw_state)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Data normalization failed: {str(e)}")
        
    # 3. Disruption Scoring
    prediction = predictor.predict_disruption(state)
    
    # 4. Supplier Recommendation
    recommendations = []
    if prediction.score > 0.4:
        recommendations = ranker.rank_alternatives(state.suppliers, prediction.score)
        
    return {
        "state": state.model_dump(),
        "prediction": prediction.model_dump(),
        "recommendations": [r.model_dump() for r in recommendations]
    }
