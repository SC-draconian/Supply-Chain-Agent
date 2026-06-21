import json
from src.processing.schemas import SupplyChainState, PredictionExplanation
from src.scoring.rules import calculate_base_risk
from src.core.config import settings
from src.core.security import log_audit_event
from google import genai
from pydantic import BaseModel

class Predictor:
    def __init__(self):
        # We use Gemini as our LLM for nuanced risk evaluation.
        # Fallback to rules if API key is not configured or mock.
        self.use_llm = settings.GEMINI_API_KEY != "placeholder_key"
        if self.use_llm:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    def predict_disruption(self, state: SupplyChainState) -> PredictionExplanation:
        base_score = calculate_base_risk(state)
        
        # If score is very low, we don't need expensive LLM evaluation
        if base_score < 0.2:
            return PredictionExplanation(
                score=base_score,
                risk_factors=["Low baseline risk across all signals."],
                summary="Supply chain looks healthy. No immediate disruptions predicted."
            )
            
        if self.use_llm:
            try:
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=self._build_prompt(state, base_score),
                    config=genai.types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=PredictionExplanation,
                    ),
                )
                
                log_audit_event("LLM_PREDICTION", "SYSTEM", f"Prediction successful")
                return PredictionExplanation.model_validate_json(response.text)
                
            except Exception as e:
                log_audit_event("LLM_ERROR", "SYSTEM", f"Fallback to rule engine. Error: {str(e)}")
                
        
        # Fallback if no LLM or LLM fails
        risk_factors = []
        if any(w.severity == "SEVERE" for w in state.weather):
            risk_factors.append("Severe weather detected.")
        if any(n.risk_level == "HIGH" for n in state.news):
            risk_factors.append("High risk news alert.")
        if any(l.congestion_level > 80 for l in state.logistics):
            risk_factors.append("Severe port congestion.")
            
        return PredictionExplanation(
            score=base_score,
            risk_factors=risk_factors,
            summary="Elevated risk detected via rule-based analysis. Manual review recommended."
        )

    def _build_prompt(self, state: SupplyChainState, base_score: float) -> str:
        prompt = f"""
        You are a Supply Chain Risk Analyst Agent.
        Analyze the following signals and determine the disruption risk score (0.0 to 1.0).
        Base heuristic score is {base_score}. 
        Provide a concise summary and list of risk factors.
        
        Weather: {[w.model_dump() for w in state.weather]}
        News: {[n.model_dump() for n in state.news]}
        Logistics: {[l.model_dump() for l in state.logistics]}
        """
        return prompt
