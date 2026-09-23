from sklearn.ensemble import IsolationForest
import numpy as np

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.05, random_state=42)
        
    def detect_anomalies(self, data_points: list):
        if len(data_points) < 10:
            return []
            
        X = np.array(data_points).reshape(-1, 1)
        predictions = self.model.fit_predict(X)
        
        anomalies = []
        for idx, pred in enumerate(predictions):
            if pred == -1: # -1 is anomaly
                anomalies.append({
                    "index": idx,
                    "value": data_points[idx],
                    "status": "anomaly"
                })
        return anomalies

anomaly_detector = AnomalyDetector()
