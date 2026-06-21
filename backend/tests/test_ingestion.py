from src.ingestion.weather_client import WeatherClient
from src.ingestion.news_client import NewsClient
from src.ingestion.logistics_client import LogisticsClient

def test_weather_client():
    client = WeatherClient()
    result = client.fetch_current_weather("Seattle")
    assert result["location"] == "Seattle"
    assert result["severity"] in ["NORMAL", "SEVERE", "WARNING"]

def test_logistics_client():
    client = LogisticsClient()
    result = client.fetch_port_status("PORT-001")
    assert result["port_id"] == "PORT-001"
    assert 10 <= result["congestion_level"] <= 95
    assert result["avg_delay_days"] >= 0.0
