from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings


# Priority: explicit SQLALCHEMY_DATABASE_URI from settings
# Fallback: build a PostgreSQL URI from parts
# Final fallback (dev): local SQLite file
database_uri = settings.SQLALCHEMY_DATABASE_URI
if not database_uri:
    database_uri = "sqlite:///./procurement.db"


if database_uri.startswith("sqlite"):
    engine = create_engine(
        database_uri,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_engine(database_uri)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
