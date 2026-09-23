# Generative AI Procurement Intelligence & Supplier Analytics Platform

Welcome to the ultimate Procurement Intelligence Platform! This project brings together modern web development, 3D visualization, generative AI, and predictive machine learning.

## Features
- **3D Global Supply Chain Map**: Interactive visualization of supplier risks.
- **Warehouse Digital Twin**: Heatmaps and live inventory tracking.
- **Generative AI Copilot**: Talk to your procurement data, generate negotiation emails, and summarize contracts.
- **Predictive Analytics**: Forecast commodity prices using Prophet and predict delivery delays using XGBoost/Random Forest.
- **Supplier Risk Scoring**: K-Means clustering for multi-factor risk assessment.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, TailwindCSS, React Three Fiber, Framer Motion
- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL, Redis, Scikit-Learn, Prophet, LangChain
- **Deployment**: Docker, Docker Compose

## Prerequisites

Choose one of these setup options:

- **Docker (recommended):** Docker Desktop with Compose.
- **Local VS Code:** Python 3.10+, Node.js 18+, PostgreSQL 15+, and Redis 7+.

## Quick Start (Docker)

1. Make sure Docker and Docker Compose are installed.
2. Optionally set `OPENAI_API_KEY` in your environment. The application uses mock responses when it is not set.
3. Run the complete stack:
   ```bash
   docker-compose up -d --build
   ```

4. The API will be available at `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`
5. The Frontend will be available at `http://localhost:3000`

## Quick Start (VS Code)

1. Open the `procurement-platform` folder (not its parent) in VS Code.
2. Install the recommended extensions when prompted.
3. Create a Python virtual environment and install the backend dependencies:

   ```bash
   python3 -m venv backend/.venv
   backend/.venv/bin/python -m pip install -r backend/requirements.txt
   ```

4. Install the frontend dependencies:

   ```bash
   cd frontend && npm install
   ```

5. Start PostgreSQL and Redis locally, then press `F5` and select **Full stack (local services)**.

   To start the backend manually instead of using the VS Code launch profile:

   ```bash
   cd backend
   source .venv/bin/activate
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

   The local configuration uses PostgreSQL at `localhost:5432` and Redis at
   `localhost:6379`. The Docker Compose configuration supplies its own service
   hostnames (`db` and `redis`) automatically.

The configured VS Code tasks are also available from **Terminal > Run Task**. The
backend runs on `http://localhost:8000` and the frontend on `http://localhost:3000`.

## Seeding the Database

Once the containers are running, you can seed the database with realistic sample data (50+ suppliers, 200+ purchase orders, market prices, and risk metrics):

```bash
docker-compose exec backend python seed_data.py
```

## Generating the Expanded Dataset

The repository includes a deterministic synthetic data generator for local ML
development and dashboard demos. It writes the same relational CSV snapshot to
`backend/data/` and `frontend/public/data/`:

```bash
python3 backend/generate_massive_dataset.py
```

The generated snapshot covers January 2015 through December 2024 and contains 15
countries, 15 commodities, 205 suppliers, 320 customers, 50,000 purchase orders,
27,000 market-price records, 27,000 demand records, 24,600 supplier-performance
records, 24,600 risk records, 500,000 inventory movements, 5,000 contracts,
100,000 audit logs, 63,000 financial records, and 10,000 alerts. It includes
controlled late/cancelled orders, returns, payment exceptions, price and demand
anomalies, stockout risk, supplier trends, and sparse non-key missing values.
The output is reproducible with seed `20260912`, uses country/commodity/supplier/
customer codes as CSV foreign keys, and is available through the backend
`/data/<file>.csv` mount and `/data-manifest` endpoint.

## Running Tests
To run the backend test suite:
```bash
docker-compose exec backend pytest tests/
```

## License
MIT
