import numpy as np

class RecommendationEngine:
    def recommend_suppliers(self, suppliers_data: list, weights: dict) -> list:
        """
        Simple TOPSIS or weighted sum based recommendation
        weights: dict with keys like 'cost', 'quality', 'delivery', 'sustainability'
        """
        if not suppliers_data: return []
        
        for s in suppliers_data:
            score = (
                s.get('quality', 0) * weights.get('quality', 0.25) +
                s.get('delivery', 0) * weights.get('delivery', 0.25) +
                s.get('sustainability', 0) * weights.get('sustainability', 0.25) -
                s.get('cost', 0) * weights.get('cost', 0.25) # cost is negative factor
            )
            s['recommendation_score'] = round(score, 2)
            
        return sorted(suppliers_data, key=lambda x: x['recommendation_score'], reverse=True)

recommendation_engine = RecommendationEngine()
