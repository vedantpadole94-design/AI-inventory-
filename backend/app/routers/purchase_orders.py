from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.domain import PurchaseOrder

router = APIRouter()

@router.get("/")
def get_purchase_orders(db: Session = Depends(get_db)):
    return db.query(PurchaseOrder).all()

@router.post("/")
def create_purchase_order(po_data: dict, db: Session = Depends(get_db)):
    return {"message": "PO created"}
