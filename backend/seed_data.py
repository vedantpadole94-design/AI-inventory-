import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.domain import User, Supplier, PurchaseOrder, SupplierPerformance, RiskAssessment, MarketPrices

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed():
    db: Session = SessionLocal()
    
    # Check if already seeded
    if db.query(Supplier).first():
        print("Database already seeded.")
        return
        
    print("Seeding Suppliers...")
    suppliers = []
    countries = ["USA", "Germany", "China", "India", "Japan"]
    industries = ["Electronics", "Raw Materials", "Software", "Logistics", "Manufacturing"]
    
    for i in range(50):
        supplier = Supplier(
            name=f"Supplier_{i+1} Corp",
            country=random.choice(countries),
            industry=random.choice(industries),
            contact_email=f"contact@supplier{i+1}.com",
            certifications=["ISO 9001", "ISO 14001"] if random.random() > 0.5 else ["ISO 9001"],
            financial_rating=random.choice(["AAA", "AA", "A", "BBB", "BB"])
        )
        db.add(supplier)
        suppliers.append(supplier)
        
    db.commit()
    
    print("Seeding Performance & Risk Data...")
    for supplier in suppliers:
        # Performance
        perf = SupplierPerformance(
            supplier_id=supplier.id,
            quality_score=random.uniform(60, 100),
            delivery_score=random.uniform(50, 100),
            cost_score=random.uniform(70, 100),
            overall_score=0.0
        )
        perf.overall_score = (perf.quality_score + perf.delivery_score + perf.cost_score) / 3
        db.add(perf)
        
        # Risk
        risk = RiskAssessment(
            supplier_id=supplier.id,
            financial_risk_score=random.uniform(0, 100),
            geopolitical_risk_score=random.uniform(0, 100),
            compliance_risk_score=random.uniform(0, 100),
            overall_risk_score=0.0
        )
        risk.overall_risk_score = (risk.financial_risk_score + risk.geopolitical_risk_score + risk.compliance_risk_score) / 3
        risk.risk_tier = "High" if risk.overall_risk_score > 70 else "Medium" if risk.overall_risk_score > 40 else "Low"
        db.add(risk)
        
    db.commit()
    
    print("Seeding Purchase Orders...")
    for i in range(200):
        order_date = datetime.now() - timedelta(days=random.randint(1, 365))
        po = PurchaseOrder(
            po_number=f"PO-{1000+i}",
            supplier_id=random.choice(suppliers).id,
            total_amount=random.uniform(5000, 500000),
            status=random.choice(["completed", "in-transit", "delayed", "cancelled"]),
            order_date=order_date,
            expected_delivery_date=order_date + timedelta(days=random.randint(10, 60)),
            items=[{"item": "Widget A", "qty": 100}]
        )
        db.add(po)
        
    db.commit()
    
    print("Seeding Market Prices...")
    for month in range(60): # 5 years
        date = datetime.now() - timedelta(days=month*30)
        price = MarketPrices(
            commodity_name="Steel",
            price=800 + random.uniform(-100, 200) + (month * 2), # Upward trend
            unit="Ton",
            date_recorded=date
        )
        db.add(price)
        
    db.commit()
    print("Seeding Complete!")

if __name__ == "__main__":
    seed()
