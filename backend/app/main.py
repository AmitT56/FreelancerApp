from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, Base, get_db
import datetime


Base.metadata.create_all(bind=engine)


app = FastAPI(title="Freelancer App API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/clients/", response_model=schemas.ClientOut)
def create_client(client_in: schemas.ClientCreate, db: Session = Depends(get_db)):
    # 1) create client record
    db_client = crud.create_client(db, client_in)

    # 2) schedule event
    # if no requested_start provided, schedule at now + 1h
    if client_in.requested_start:
        requested_start = client_in.requested_start
    else:
        requested_start = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

    duration = client_in.requested_duration_minutes or 60

    start, end = crud.find_available_slot(db, requested_start, duration)
    if start and end:
        title = f"Booking: {db_client.name}"
        event = crud.create_event(db, db_client.id, title, start, end)
    else:
        # if no slot found, raise an informative error (could queue or notify admin)
        raise HTTPException(status_code=400, detail="No available slots in search window")

    return db_client


@app.get("/events/", response_model=list[schemas.EventOut])
def list_events(start: datetime.datetime = None, end: datetime.datetime = None, db: Session = Depends(get_db)):
    # default to +/- 30 days
    now = datetime.datetime.utcnow()
    if not start:
        start = now - datetime.timedelta(days=30)
    if not end:
        end = now + datetime.timedelta(days=30)
    events = crud.get_events_between(db, start, end)
    return events


@app.get("/clients/", response_model=list[schemas.ClientOut])
def list_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).order_by(models.Client.created_at.desc()).all()