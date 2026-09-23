from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from .core.config import settings
from .core.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Advanced Generative AI Procurement Intelligence & Supplier Analytics Platform API"
)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATASET_FILES = [
    "countries.csv",
    "commodities.csv",
    "suppliers.csv",
    "customers.csv",
    "market_prices.csv",
    "purchase_orders.csv",
    "inventory_levels.csv",
    "inventory_movements.csv",
    "supplier_performance.csv",
    "risk_assessments.csv",
    "demand_history.csv",
    "economic_indicators.csv",
    "exchange_rates.csv",
    "contracts.csv",
    "audit_logs.csv",
    "financials.csv",
    "alerts.csv",
]
app.mount("/data", StaticFiles(directory=str(DATA_DIR)), name="data")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .routers import auth, suppliers, purchase_orders, analytics, copilot

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(suppliers.router, prefix="/api/suppliers", tags=["suppliers"])
app.include_router(purchase_orders.router, prefix="/api/purchase-orders", tags=["purchase-orders"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(copilot.router, prefix="/api/copilot", tags=["copilot"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Procurement Intelligence Platform API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/data-manifest")
def data_manifest():
    """Expose the static dataset contract for clients and observability."""
    return {"datasets": DATASET_FILES, "base_url": "/data"}
