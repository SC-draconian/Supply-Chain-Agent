# Supply Chain Agent

## Summary
The Supply Chain Agent is an AI-powered platform designed to analyze, predict, and mitigate supply chain disruptions. It ingests real-time data from various sources—including weather, news, port logistics, and supplier databases—normalizes this information, and uses predictive modeling to calculate disruption risks. If a high risk of disruption is detected, the agent proactively evaluates and recommends alternative suppliers to maintain a resilient supply chain.

## Architecture
The project follows a standard client-server architecture separated into a frontend dashboard and a backend API:

- **Frontend**: A fast, modern web interface built with **React** and **Vite**. It handles user interactions, visualizes the supply chain state, and displays the risk scores and alternative supplier recommendations.
- **Backend**: A robust REST API built with **FastAPI** in Python. The backend is modularized into several core components:
  - **Ingestion Layer**: Fetches current data via various clients (`WeatherClient`, `NewsClient`, `LogisticsClient`, `SupplierClient`).
  - **Processing Layer**: Normalizes the raw heterogeneous data into a consistent internal state.
  - **Scoring Engine**: Evaluates the normalized state to predict supply chain disruptions (`Predictor`).
  - **Recommendation Engine**: Ranks and suggests alternative suppliers if the disruption score exceeds a specific threshold (`SupplierRanker`).
  - **Security**: Implements OAuth2 token-based authentication with role-based access control (e.g., requiring Admin privileges to trigger an analysis).

## Steps to Run

### 1. Running the Backend

The backend is built with Python and FastAPI.

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment (recommended):
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   # source .venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the development server:
   ```bash
   python -m src.main
   ```
   *(Alternatively, navigate to backend and run `uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload` )*

The backend API will be available at `http://localhost:8000`. You can interact with the Swagger API documentation at `http://localhost:8000/docs`.

### 2. Running the Frontend

The frontend is a React application built using Vite.

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend application will be accessible at the local URL provided in the terminal (typically `http://localhost:5173`).
