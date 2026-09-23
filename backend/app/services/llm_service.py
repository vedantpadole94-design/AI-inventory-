from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from ..core.config import settings

class ProcurementCopilot:
    def __init__(self):
        # We initialize with a mock if API key is empty to avoid crashing during development
        self.api_key = settings.OPENAI_API_KEY
        if self.api_key:
            self.llm = ChatOpenAI(temperature=0.7, openai_api_key=self.api_key, model="gpt-4-turbo-preview")
        else:
            self.llm = None

    def _mock_response(self, prompt: str) -> str:
        return f"[MOCK AI RESPONSE] I would have processed this prompt: {prompt[:50]}..."

    def analyze_supplier_comparison(self, suppliers_data: dict) -> str:
        if not self.llm: return self._mock_response("analyze_supplier")
        
        prompt = PromptTemplate(
            input_variables=["data"],
            template="You are a Senior Procurement Analyst. Analyze the following supplier comparison data and provide a concise, actionable recommendation. Data: {data}"
        )
        return self._invoke(prompt, data=str(suppliers_data))

    def generate_negotiation_email(self, supplier_name: str, issues: list, data: dict) -> str:
        if not self.llm: return self._mock_response("generate_email")
        
        prompt = PromptTemplate(
            input_variables=["supplier_name", "issues", "data"],
            template="""You are a Procurement Manager. Write a professional negotiation email to {supplier_name}. 
            Address these issues: {issues}. 
            Use this data for leverage: {data}. 
            Tone should be firm but collaborative."""
        )
        return self._invoke(
            prompt,
            supplier_name=supplier_name,
            issues=str(issues),
            data=str(data),
        )

    def explain_analytics(self, query: str, dataset_summary: str) -> str:
        if not self.llm: return self._mock_response("explain_analytics")
        
        prompt = PromptTemplate(
            input_variables=["query", "dataset"],
            template="User asked: '{query}'. Based on this data summary: {dataset}, explain the insights simply."
        )
        return self._invoke(prompt, query=query, dataset=dataset_summary)

    def _invoke(self, prompt: PromptTemplate, **values: str) -> str:
        response = (prompt | self.llm).invoke(values)
        return response.content

copilot = ProcurementCopilot()
