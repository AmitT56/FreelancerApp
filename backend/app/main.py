from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, Base, get_db
from .auth import authenticate_user, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from .init_db import init_default_user
from datetime import datetime, timedelta


app = FastAPI(title="Freelancer App API")


@app.on_event("startup")
async def startup_event():
    """Initialize database and default user on startup"""
    try:
        print("Initializing database...")
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created")
        init_default_user()
    except Exception as e:
        print(f"Error during startup: {e}")
        import traceback
        traceback.print_exc()

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
        requested_start = datetime.utcnow() + timedelta(hours=1)

    duration = client_in.requested_duration_minutes or 60

    start, end = crud.find_available_slot(db, requested_start, duration)
    if start and end:
        title = f"Booking: {db_client.name}"
        event = crud.create_event(db, db_client.id, title, start, end)
    else:
        # if no slot found, raise an informative error (could queue or notify admin)
        raise HTTPException(status_code=400, detail="No available slots in search window")

    return db_client


# Public endpoint - clients can see events (for calendar display)
@app.get("/events/public", response_model=list[schemas.EventOut])
def list_events_public(start: datetime = None, end: datetime = None, db: Session = Depends(get_db)):
    """Public endpoint - anyone can see events for calendar display"""
    now = datetime.utcnow()
    if not start:
        start = now - timedelta(days=30)
    if not end:
        end = now + timedelta(days=30)
    events = crud.get_events_between(db, start, end)
    return events


@app.get("/clients/", response_model=list[schemas.ClientOut])
def list_clients(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Protected endpoint - only authenticated freelancers can see all clients"""
    return db.query(models.Client).order_by(models.Client.created_at.desc()).all()


@app.get("/events/", response_model=list[schemas.EventOut])
def list_events_protected(start: datetime = None, end: datetime = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Protected endpoint - only authenticated freelancers can see all events"""
    now = datetime.utcnow()
    if not start:
        start = now - timedelta(days=30)
    if not end:
        end = now + timedelta(days=30)
    events = crud.get_events_between(db, start, end)
    return events


# Authentication endpoints
@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new freelancer user"""
    # Check if username already exists
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_user(db=db, user=user)


@app.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login endpoint - returns JWT token"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """Get current logged-in user info"""
    return current_user