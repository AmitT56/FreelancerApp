from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash
from datetime import datetime, timedelta


def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(
        name=client.name,
        email=client.email,
        phone=client.phone,
        notes=client.notes,
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


def create_event(db: Session, client_id: int, title: str, start: datetime, end: datetime):
    ev = models.Event(
        client_id=client_id,
        title=title,
        start=start,
        end=end,
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev


def get_events_between(db: Session, start: datetime, end: datetime):
    return db.query(models.Event).filter(models.Event.start < end, models.Event.end > start).all()


# find nearest available slot (simple greedy)


def find_available_slot(db: Session, requested_start: datetime, duration_minutes: int, search_window_days: int = 14):
    # Attempt requested start first, otherwise search forward for availability up to search_window_days
    slot_start = requested_start
    slot_end = slot_start + timedelta(minutes=duration_minutes)

    window_end = requested_start + timedelta(days=search_window_days)
    step = timedelta(minutes=15)  # granularity

    while slot_start < window_end:
        overlaps = get_events_between(db, slot_start, slot_end)
        if not overlaps:
            return slot_start, slot_end
        slot_start += step
        slot_end = slot_start + timedelta(minutes=duration_minutes)
    return None, None


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()