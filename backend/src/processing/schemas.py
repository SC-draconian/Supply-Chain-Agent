from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class WeatherSignal(BaseModel):
    location: str
    severity: str = Field(..., description="E.g., NORMAL, WARNING, SEVERE")
    description: str

class NewsSignal(BaseModel):
    headline: str
    risk_level: str = Field(..., description="LOW, MEDIUM, HIGH")
    source: str

class LogisticsSignal(BaseModel):
    port_id: str
    congestion_level: int = Field(..., ge=0, le=100, description="0 to 100 congestion percentage")
    avg_delay_days: float

class SupplierPerformance(BaseModel):
    supplier_id: str
    name: str
    fill_rate: float = Field(..., ge=0.0, le=1.0)
    on_time_delivery_rate: float = Field(..., ge=0.0, le=1.0)
    quality_issue_rate: float = Field(..., ge=0.0, le=1.0)
    location: str
    cost_index: float

class SupplyChainState(BaseModel):
    weather: List[WeatherSignal]
    news: List[NewsSignal]
    logistics: List[LogisticsSignal]
    suppliers: List[SupplierPerformance]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PredictionExplanation(BaseModel):
    score: float = Field(..., ge=0.0, le=1.0)
    risk_factors: List[str]
    summary: str

class Recommendation(BaseModel):
    supplier_id: str
    name: str
    reason: str
    confidence_score: float
