from fastapi import APIRouter
from ..services.predictive_analytics import delay_predictor, price_forecaster, risk_scorer

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_metrics():
    return {
        "total_spend": 2400000,
        "active_suppliers": 142,
        "high_risk_alerts": 2,
        "on_time_delivery": 94.2
    }

@router.get("/forecasts/prices")
def get_price_forecasts():
    # Mock data
    import datetime
    dates = [datetime.date.today() - datetime.timedelta(days=x) for x in range(30)]
    prices = [100 + x + (x % 5) for x in range(30)]
    return price_forecaster.forecast(dates, prices, periods=10)
