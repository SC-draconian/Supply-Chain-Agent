import random
from typing import Dict, Any

class NewsClient:
    def fetch_latest_news(self, keyword: str) -> Dict[str, Any]:
        """Mock news API integration"""
        risks = ["LOW", "MEDIUM", "HIGH"]
        
        is_bad_news = random.random() > 0.85
        
        return {
            "headline": f"Global port strikes affect {keyword} shipments." if is_bad_news else f"Market steady for {keyword}.",
            "risk_level": "HIGH" if is_bad_news else "LOW",
            "source": "Global Trade News"
        }
