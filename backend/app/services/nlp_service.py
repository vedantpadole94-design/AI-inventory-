class NLPService:
    def nl_to_sql(self, query: str) -> str:
        # Placeholder for Langchain SQLDatabaseChain integration
        return f"SELECT * FROM suppliers WHERE name LIKE '%{query}%'"
        
    def analyze_sentiment(self, text: str) -> dict:
        # Simple heuristic based sentiment for mock
        positive_words = ['great', 'excellent', 'good', 'on time', 'fast']
        negative_words = ['delay', 'bad', 'poor', 'issue', 'problem']
        
        text_lower = text.lower()
        pos_count = sum(1 for w in positive_words if w in text_lower)
        neg_count = sum(1 for w in negative_words if w in text_lower)
        
        if pos_count > neg_count:
            return {"sentiment": "positive", "score": 0.8}
        elif neg_count > pos_count:
            return {"sentiment": "negative", "score": -0.8}
        return {"sentiment": "neutral", "score": 0.0}

nlp_service = NLPService()
