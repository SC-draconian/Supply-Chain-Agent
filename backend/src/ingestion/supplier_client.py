from typing import List, Dict, Any

class SupplierClient:
    def fetch_suppliers(self, category: str) -> List[Dict[str, Any]]:
        """Mock supplier database/API integration"""
        return [
            {
                "supplier_id": "SUP-001",
                "name": "Acme Corp",
                "fill_rate": 0.95,
                "on_time_delivery_rate": 0.88,
                "quality_issue_rate": 0.02,
                "location": "Shenzhen, CN",
                "cost_index": 1.0
            },
            {
                "supplier_id": "SUP-002",
                "name": "Global Components",
                "fill_rate": 0.99,
                "on_time_delivery_rate": 0.98,
                "quality_issue_rate": 0.01,
                "location": "Monterrey, MX",
                "cost_index": 1.15
            },
            {
                "supplier_id": "SUP-003",
                "name": "Fast Electronics",
                "fill_rate": 0.85,
                "on_time_delivery_rate": 0.70,
                "quality_issue_rate": 0.05,
                "location": "Taipei, TW",
                "cost_index": 0.85
            }
        ]
