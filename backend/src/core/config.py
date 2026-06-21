from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Supply Chain Disruption Agent"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7" # Example key, should be env var
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    
    # LLM config
    GEMINI_API_KEY: str = "placeholder_key"
    
    # Mock Services
    WEATHER_API_URL: str = "https://mock.weather.api/v1"
    NEWS_API_URL: str = "https://mock.news.api/v1"
    LOGISTICS_API_URL: str = "https://mock.logistics.api/v1"
    SUPPLIER_API_URL: str = "https://mock.supplier.api/v1"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
