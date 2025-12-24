"""
Initialize database with default freelancer user
Run this on startup to ensure default user exists
"""
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import models
from .auth import get_password_hash, verify_password


def init_default_user():
    """Create default user if it doesn't exist"""
    db: Session = SessionLocal()
    try:
        # Check if default user exists
        default_user = db.query(models.User).filter(models.User.username == "123").first()
        if not default_user:
            # Create default user
            hashed_password = get_password_hash("123")
            new_user = models.User(
                username="123",
                email="freelancer@example.com",
                hashed_password=hashed_password,
                is_active=True
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            print("✓ Default user created: username=123, password=123")
        else:
            # Ensure user is active and password is correct
            if not default_user.is_active:
                default_user.is_active = True
                db.commit()
                print("✓ Default user activated")
            # Verify password is correct (re-hash if needed)
            if not verify_password("123", default_user.hashed_password):
                # Update password if it doesn't match
                default_user.hashed_password = get_password_hash("123")
                db.commit()
                print("✓ Default user password updated")
            else:
                print("✓ Default user already exists and is active")
    except Exception as e:
        print(f"Error initializing default user: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()




