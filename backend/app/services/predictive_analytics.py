import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from prophet import Prophet

class DeliveryDelayPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.is_trained = False

    def train_mock(self):
        # Mock training data for initialization
        X = np.random.rand(100, 5) # 5 features
        y = np.random.randint(0, 2, 100) # 0 or 1
        self.model.fit(X, y)
        self.is_trained = True

    def predict_delay(self, historical_times, volume, season_code, capacity, risk_score):
        if not self.is_trained:
            self.train_mock()
        
        # Features array must match training
        features = np.array([[historical_times, volume, season_code, capacity, risk_score]])
        prob = self.model.predict_proba(features)[0][1] # Probability of class 1 (delay)
        return {
            "delay_probability": round(prob * 100, 2),
            "expected_delay_days": round(prob * 7, 1) # simple heuristic
        }

class PriceForecastingEngine:
    def forecast(self, dates, prices, periods=30):
        if len(dates) < 10:
            return {"error": "Not enough data points"}
            
        df = pd.DataFrame({'ds': dates, 'y': prices})
        m = Prophet(daily_seasonality=False, yearly_seasonality=True)
        m.fit(df)
        
        future = m.make_future_dataframe(periods=periods)
        forecast = m.predict(future)
        
        # Return only the future predictions
        future_forecast = forecast.tail(periods)
        return {
            "dates": future_forecast['ds'].dt.strftime('%Y-%m-%d').tolist(),
            "predicted_prices": future_forecast['yhat'].tolist(),
            "lower_bound": future_forecast['yhat_lower'].tolist(),
            "upper_bound": future_forecast['yhat_upper'].tolist()
        }

class SupplierRiskScorer:
    def segment_suppliers(self, supplier_metrics):
        """
        supplier_metrics: list of dicts with financial, delivery, quality, geopolitical scores
        """
        if not supplier_metrics: return []
        
        df = pd.DataFrame(supplier_metrics)
        features = df[['financial', 'delivery', 'quality', 'geopolitical']]
        
        kmeans = KMeans(n_clusters=3, random_state=42)
        df['risk_cluster'] = kmeans.fit_predict(features)
        
        # Map clusters to High/Medium/Low based on centroids
        # Lower scores = higher risk
        centroids = kmeans.cluster_centers_
        cluster_means = centroids.mean(axis=1)
        sorted_indices = np.argsort(cluster_means)
        
        risk_map = {
            sorted_indices[0]: "High Risk",
            sorted_indices[1]: "Medium Risk",
            sorted_indices[2]: "Low Risk"
        }
        
        df['risk_tier'] = df['risk_cluster'].map(risk_map)
        return df.to_dict('records')

delay_predictor = DeliveryDelayPredictor()
price_forecaster = PriceForecastingEngine()
risk_scorer = SupplierRiskScorer()
