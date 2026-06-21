from src.processing.schemas import SupplyChainState

def calculate_base_risk(state: SupplyChainState) -> float:
    """
    Deterministic rule-based risk calculation.
    Returns a score from 0.0 to 1.0.
    """
    score = 0.0
    
    # Weather factors
    for w in state.weather:
        if w.severity == "SEVERE":
            score += 0.4
        elif w.severity == "WARNING":
            score += 0.15
            
    # News factors
    for n in state.news:
        if n.risk_level == "HIGH":
            score += 0.3
        elif n.risk_level == "MEDIUM":
            score += 0.1
            
    # Logistics factors
    for log in state.logistics:
        if log.congestion_level > 80:
            score += 0.3
        elif log.congestion_level > 50:
            score += 0.15
            
    # Cap score at 1.0
    return min(score, 1.0)
