import random
from typing import Dict, Any

class WeatherClient:
    def fetch_current_weather(self, location: str) -> Dict[str, Any]:
        """Mock weather API integration"""
        # In a real scenario, this would use self.api_key and requests.get()
        severities = ["NORMAL", "WARNING", "SEVERE"]
        
        # Simulate an occasional storm
        is_storm = random.random() > 0.8
        
        return {
            "location": location,
            "severity": "SEVERE" if is_storm else "NORMAL",
            "description": "Heavy thunderstorms and possible flooding." if is_storm else "Clear skies."
        }
