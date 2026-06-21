from src.processing.schemas import SupplyChainState
from src.core.security import sanitize_input

def normalize_state(raw_data: dict) -> SupplyChainState:
    """
    Validates and normalizes raw dictionary data into structured SupplyChainState.
    Applies sanitization to free-text fields.
    """
    # Sanitize text fields in weather
    for w in raw_data.get("weather", []):
        w["description"] = sanitize_input(w.get("description", ""))
        w["location"] = sanitize_input(w.get("location", ""))
        
    for n in raw_data.get("news", []):
        n["headline"] = sanitize_input(n.get("headline", ""))
    
    # Pydantic will handle type coercion and validation
    state = SupplyChainState(**raw_data)
    return state
