from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..core.database import Base

class UserRole(str, enum.Enum):
    admin = "admin"
    procurement_manager = "procurement_manager"
    analyst = "analyst"
    viewer = "viewer"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.viewer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    country = Column(String)
    industry = Column(String)
    contact_email = Column(String)
    certifications = Column(JSON)  # List of certifications
    financial_rating = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    performance = relationship("SupplierPerformance", back_populates="supplier", uselist=False)
    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")
    risk_assessment = relationship("RiskAssessment", back_populates="supplier", uselist=False)

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String, unique=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    total_amount = Column(Float)
    currency = Column(String, default="USD")
    status = Column(String) # pending, approved, in-transit, delivered, cancelled
    order_date = Column(DateTime(timezone=True))
    expected_delivery_date = Column(DateTime(timezone=True))
    actual_delivery_date = Column(DateTime(timezone=True), nullable=True)
    items = Column(JSON) # Detailed line items
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    supplier = relationship("Supplier", back_populates="purchase_orders")

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    item_code = Column(String, unique=True, index=True)
    name = Column(String)
    category = Column(String)
    current_stock = Column(Integer)
    reorder_level = Column(Integer)
    unit_cost = Column(Float)
    warehouse_location = Column(String)
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())

class SupplierPerformance(Base):
    __tablename__ = "supplier_performance"
    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), unique=True)
    quality_score = Column(Float) # 0-100
    delivery_score = Column(Float) # 0-100
    cost_score = Column(Float) # 0-100
    overall_score = Column(Float)
    last_evaluated = Column(DateTime(timezone=True), server_default=func.now())

    supplier = relationship("Supplier", back_populates="performance")

class MarketPrices(Base):
    __tablename__ = "market_prices"
    id = Column(Integer, primary_key=True, index=True)
    commodity_name = Column(String, index=True)
    price = Column(Float)
    currency = Column(String, default="USD")
    unit = Column(String)
    date_recorded = Column(DateTime(timezone=True))

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), unique=True)
    financial_risk_score = Column(Float) # 0-100
    geopolitical_risk_score = Column(Float) # 0-100
    compliance_risk_score = Column(Float) # 0-100
    overall_risk_score = Column(Float) # 0-100
    risk_tier = Column(String) # Low, Medium, High
    last_updated = Column(DateTime(timezone=True), server_default=func.now())

    supplier = relationship("Supplier", back_populates="risk_assessment")

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(String, index=True)
    message_role = Column(String) # user or assistant
    content = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    content = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
