from fastapi import APIRouter
from pydantic import BaseModel
from ..services.llm_service import copilot

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    context: dict = {}

@router.post("/chat")
def chat_with_copilot(req: ChatMessage):
    # Depending on context, we call different copilot methods
    if "compare" in req.message.lower():
        resp = copilot.analyze_supplier_comparison(req.context)
    else:
        resp = copilot.explain_analytics(req.message, str(req.context))
    return {"reply": resp}
