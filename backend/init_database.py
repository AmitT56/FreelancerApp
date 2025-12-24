"""
Script to initialize the database and create the default admin user
Run this script to set up the database if it doesn't exist
"""
from app.database import engine, Base, SessionLocal
from app import models
from app.init_db import init_default_user

def init_database():
    """Create all tables and initialize default user"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")
    
    print("Initializing default admin user...")
    init_default_user()
    print("✓ Database initialization complete!")

if __name__ == "__main__":
    init_database()

