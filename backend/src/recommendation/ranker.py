from typing import List
from src.processing.schemas import SupplierPerformance, Recommendation

class SupplierRanker:
    def rank_alternatives(self, suppliers: List[SupplierPerformance], risk_score: float) -> List[Recommendation]:
        """
        Rank alternative suppliers based on reliability, fill rate, and location.
        If risk score is high, we heavily penalize poor on-time delivery.
        """
        recs = []
        for s in suppliers:
            # Score formula: higher is better
            reliability_weight = 1.0 if risk_score < 0.5 else 2.5
            cost_weight = 1.0 if risk_score < 0.5 else 0.2
            
            # Penalize low on-time delivery more during high risk
            score = (s.fill_rate * 10) + (s.on_time_delivery_rate * 10 * reliability_weight) - (s.cost_index * cost_weight) - (s.quality_issue_rate * 5)
            
            # Normalize confidence slightly
            confidence = max(0.0, min(1.0, score / 35.0))
            
            reason = f"Excellent fill rate ({s.fill_rate*100}%) and strong on-time delivery ({s.on_time_delivery_rate*100}%)."
            if risk_score >= 0.5 and s.on_time_delivery_rate > 0.9:
                reason = "Highly reliable during disruptions. Recommended despite potential cost index."
                
            recs.append(Recommendation(
                supplier_id=s.supplier_id,
                name=s.name,
                reason=reason,
                confidence_score=confidence
            ))
            
        # Sort by highest confidence
        recs.sort(key=lambda x: x.confidence_score, reverse=True)
        return recs
