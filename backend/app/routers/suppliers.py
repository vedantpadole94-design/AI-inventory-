from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.domain import Supplier

router = APIRouter()

@router.get("/")
def read_suppliers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    suppliers = db.query(Supplier).offset(skip).limit(limit).all()
    return suppliers

@router.get("/{supplier_id}")
def read_supplier(supplier_id: int, db: Session = Depends(get_db)):
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()

@router.post("/")
def create_supplier(supplier_data: dict, db: Session = Depends(get_db)):
    # Mock creation
    return {"message": "Supplier created", "data": supplier_data}
