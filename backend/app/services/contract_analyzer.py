class ContractAnalyzer:
    def analyze_pdf(self, file_content: bytes) -> dict:
        """
        Mock implementation of PDF contract analysis.
        In a real app, this would use OCR (Tesseract/PyMuPDF) and NLP/LLM for term extraction.
        """
        return {
            "summary": "Standard supply agreement with 30-day net payment terms.",
            "risks_identified": [
                "No penalty clause for late deliveries exceeding 14 days.",
                "Force majeure clause is overly broad."
            ],
            "key_terms": {
                "payment_terms": "Net 30",
                "termination_notice": "60 days",
                "jurisdiction": "Delaware, USA"
            }
        }

contract_analyzer = ContractAnalyzer()
