import random
from typing import Dict, Any

class LogisticsClient:
    def fetch_port_status(self, port_id: str) -> Dict[str, Any]:
        """Mock logistics and port congestion API"""
        congestion = random.randint(10, 95)
        delay = (congestion / 100.0) * 14.0 # max 14 days delay
        
        return {
            "port_id": port_id,
            "congestion_level": congestion,
            "avg_delay_days": round(delay, 1)
        }
