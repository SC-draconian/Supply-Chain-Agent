from src.scoring.rules import calculate_base_risk
from src.processing.schemas import SupplyChainState

def test_calculate_base_risk_high():
    raw = {
        "weather": [{"location": "Test", "severity": "SEVERE", "description": "Storm"}],
        "news": [],
        "logistics": [{"port_id": "A", "congestion_level": 90, "avg_delay_days": 10.0}],
        "suppliers": [],
        "timestamp": "2024-01-01T00:00:00Z"
    }
    state = SupplyChainState(**raw)
    score = calculate_base_risk(state)
    assert score >= 0.7 # 0.4 from weather + 0.3 from logistics

def test_calculate_base_risk_low():
    raw = {
        "weather": [{"location": "Test", "severity": "NORMAL", "description": "Clear"}],
        "news": [],
        "logistics": [{"port_id": "A", "congestion_level": 20, "avg_delay_days": 1.0}],
        "suppliers": [],
        "timestamp": "2024-01-01T00:00:00Z"
    }
    state = SupplyChainState(**raw)
    score = calculate_base_risk(state)
    assert score == 0.0
