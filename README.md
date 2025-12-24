# Freelancer App

A full-stack application for managing freelancer leads and bookings with a React frontend and FastAPI backend. Clients can submit leads through a public landing page, and freelancers can log in to view all leads in a protected dashboard.

## Project Structure

```
freelancer-app/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # Database configuration
│   │   ├── crud.py          # Database operations
│   │   └── scheduler.py     # Scheduling logic
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile          # Backend Docker configuration
├── frontend/
│   ├── src/
│   │   ├── main.tsx         # React entry point
│   │   ├── App.tsx          # Main app component
│   │   ├── api.ts           # API client configuration
│   │   ├── components/
│   │   │   ├── LandingForm.tsx    # Public landing page form for clients
│   │   │   ├── Login.tsx          # Admin login component
│   │   │   ├── Dashboard.tsx      # Freelancer dashboard (protected)
│   │   │   ├── ClientList.tsx     # List of all leads
│   │   │   └── CalendarView.tsx   # Calendar display
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx    # Authentication context
│   │   └── styles.css       # Global styles
│   ├── package.json         # Node.js dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   ├── vite.config.ts       # Vite configuration
│   └── Dockerfile          # Frontend Docker configuration
├── docker-compose.yml       # Docker Compose configuration
└── README.md               # This file
```

## Prerequisites

- **Docker and Docker Compose** (recommended for development)
- Or **Node.js 20+** and **Python 3.11+** for local development without Docker

## Running with Docker (Recommended)

### Quick Start

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

This will:
- Build and start the **backend** on `http://localhost:8000`
- Build and start the **frontend** on `http://localhost:5173`
- Enable **hot reload** for both services (code changes automatically update)
- Automatically create the database and default admin user on first startup

**First Time Setup:**
1. Wait for both containers to start (check with `docker-compose ps`)
2. Verify backend is running: `docker-compose logs backend` should show "Application startup complete"
3. The admin user is automatically created - you can log in immediately with username `123` and password `123`

### Hot Reload / Development Mode

Both services are configured with hot reload enabled:

- **Backend**: Uses `uvicorn --reload` to watch for Python file changes
- **Frontend**: Uses Vite's built-in HMR (Hot Module Replacement) for instant updates

**Any changes you make to the code will automatically reflect in the running containers!**

### Managing Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (cleans database)
docker-compose down -v

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend

# Rebuild and restart (after dependency changes)
docker-compose up --build --force-recreate
```

### View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Accessing Services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative API Docs**: http://localhost:8000/redoc

## Local Development (Without Docker)

### Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server with hot reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

**Note**: Make sure to update `frontend/src/api.ts` to use `http://localhost:8000` when running locally.

## Features

- ✅ **Public Landing Page**: Clients can submit leads without login
- ✅ **Admin Authentication**: Single admin account (username: `123`, password: `123`)
- ✅ **Freelancer Dashboard**: Protected dashboard showing all leads from the landing page
- ✅ **Lead Management**: View all client submissions with contact details and notes
- ✅ **Calendar View**: Visual calendar display using FullCalendar
- ✅ **Automatic Slot Finding**: Finds available time slots for bookings
- ✅ **Hot Reload**: Instant updates during development
- ✅ **RESTful API**: FastAPI with automatic OpenAPI documentation
- ✅ **SQLite Database**: Lightweight database for development
- ✅ **JWT Authentication**: Secure token-based authentication for admin access

## Application Structure

### Two Main Views:

1. **Public Landing Page** (Default view at `http://localhost:5173`)
   - Landing form for clients to submit leads
   - No login required
   - Clients can enter: name, email, phone, preferred date/time, and notes
   - Public calendar view showing scheduled events
   - Link to admin login for freelancers

2. **Freelancer Dashboard** (After login at `http://localhost:5173`)
   - **Admin Login**: Username `123`, Password `123`
   - Protected dashboard showing all leads from the landing page
   - Complete list of all client submissions with:
     - Client name, email, phone
     - Submission notes
     - Timestamp of submission
   - Calendar view of all bookings
   - Logout functionality

## API Endpoints

### Clients

- `POST /clients/` - Create a new client lead and automatically schedule an event (Public)
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "notes": "Optional notes",
    "requested_start": "2024-01-15T10:00:00Z",
    "requested_duration_minutes": 60
  }
  ```

- `GET /clients/` - List all client leads (Protected - requires authentication)
  - Returns all leads ordered by creation date (newest first)
  - Only accessible to authenticated admin users

### Events

- `GET /events/public` - List events within a date range (Public)
  - Query parameters:
    - `start` (optional): Start date (ISO format)
    - `end` (optional): End date (ISO format)
    - Defaults to ±30 days from now
  - No authentication required

- `GET /events/` - List events within a date range (Protected)
  - Same parameters as public endpoint
  - Requires authentication

### Authentication

- `POST /token` - Login endpoint (returns JWT token)
  - Form data: `username` and `password`
  - Returns: `{"access_token": "...", "token_type": "bearer"}`
  - Default admin credentials: username `123`, password `123`

- `GET /me` - Get current user info (Protected)
  - Returns authenticated user details

## Development Workflow

### Making Code Changes

1. **Edit code** in your favorite editor
2. **Save the file** - Docker will automatically detect changes
3. **See updates** immediately:
   - Backend: Check terminal/logs for reload confirmation
   - Frontend: Browser will automatically refresh

### Adding Dependencies

**Backend:**
```bash
# Add to requirements.txt, then rebuild
docker-compose up --build backend
```

**Frontend:**
```bash
# Add to package.json, then rebuild
docker-compose up --build frontend
```

### Database

The SQLite database (`freelancer.db`) is created automatically in the backend container when it starts. The database file is persisted in `./backend/freelancer.db` on your host machine.

**Automatic Initialization:**
- Database tables are created automatically on backend startup
- The default admin user (username: `123`, password: `123`) is automatically created if it doesn't exist
- This happens via a startup event handler in `backend/app/main.py`

**Default Admin Credentials:**
- Username: `123`
- Password: `123`

**To reset the database:**

```bash
# Stop services and remove volumes
docker-compose down -v

# Or manually delete the database file
rm backend/freelancer.db  # Linux/Mac
del backend\freelancer.db   # Windows

# Restart (new database will be created with default admin user)
docker-compose up
```

**Manual Database Initialization (if needed):**

If the automatic initialization fails, you can manually initialize:

```bash
# Run initialization inside the container
docker-compose exec backend python -c "from app.database import engine, Base; from app.init_db import init_default_user; Base.metadata.create_all(bind=engine); init_default_user()"
```

## Troubleshooting

### Port Already in Use

If ports 8000 or 5173 are already in use:

```yaml
# Edit docker-compose.yml and change port mappings
ports:
  - "8001:8000"  # Backend on 8001
  - "5174:5173"  # Frontend on 5174
```

### Changes Not Reflecting

1. Check that volumes are properly mounted in `docker-compose.yml`
2. Verify file permissions
3. Check container logs: `docker-compose logs -f`

### Frontend Can't Connect to Backend

- In Docker: Frontend uses `http://backend:8000` (service name)
- Locally: Update `frontend/src/api.ts` to use `http://localhost:8000`

### Container Won't Start

```bash
# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Login Fails with "Incorrect username or password"

If you get a login error even with the correct credentials (`123`/`123`):

1. **Check if the backend is running:**
   ```bash
   docker-compose ps
   docker-compose logs backend --tail=50
   ```

2. **Verify the user exists:**
   ```bash
   docker-compose exec backend python -c "from app.database import SessionLocal; from app import models; db = SessionLocal(); user = db.query(models.User).filter(models.User.username == '123').first(); print('User exists:', user is not None); db.close()"
   ```

3. **If user doesn't exist, manually initialize:**
   ```bash
   docker-compose exec backend python -c "from app.database import engine, Base; from app.init_db import init_default_user; Base.metadata.create_all(bind=engine); init_default_user()"
   ```

4. **Rebuild backend if dependencies are missing:**
   ```bash
   docker-compose build backend
   docker-compose up -d backend
   ```

### Backend Crashes on Startup

If the backend crashes with import errors or missing modules:

1. **Rebuild the backend container:**
   ```bash
   docker-compose build backend
   docker-compose up -d backend
   ```

2. **Check for dependency issues:**
   ```bash
   docker-compose logs backend
   ```

3. **Common issues:**
   - Missing `python-jose`: Rebuild the container
   - Bcrypt compatibility: Already fixed in `requirements.txt` (bcrypt==4.0.1)
   - Database errors: Check logs and ensure database file permissions are correct

## Technical Details

### Database Initialization

The application uses a startup event handler to automatically:
1. Create all database tables using SQLAlchemy
2. Initialize the default admin user if it doesn't exist
3. Verify and update the admin user password if needed

This happens automatically when the FastAPI application starts via the `@app.on_event("startup")` decorator in `backend/app/main.py`.

### Authentication

- Uses JWT (JSON Web Tokens) for authentication
- Tokens expire after 30 days (configurable in `backend/app/auth.py`)
- Passwords are hashed using bcrypt via passlib
- The `is_active` flag is checked during authentication

### Dependencies

**Backend:**
- FastAPI for the REST API
- SQLAlchemy for database ORM
- python-jose for JWT handling
- passlib with bcrypt for password hashing
- Note: bcrypt is pinned to version 4.0.1 for compatibility with passlib 1.7.4

## Security Notes

- The default admin credentials (`123`/`123`) are for development only
- Change the admin password before deploying to production
- Update the `SECRET_KEY` in `backend/app/auth.py` for production
- Consider implementing password reset functionality
- Use environment variables for sensitive configuration
- The database file (`freelancer.db`) contains sensitive data - ensure proper file permissions

## Production Deployment

For production, you'll want to:

1. Use production-ready Dockerfiles (multi-stage builds)
2. Set up proper environment variables for secrets
3. Use a production database (PostgreSQL, MySQL, etc.)
4. Configure CORS properly for your domain
5. Change default admin credentials
6. Update JWT secret key
7. Set up reverse proxy (nginx)
8. Enable HTTPS
9. Implement rate limiting
10. Add proper logging and monitoring

## License

MIT
