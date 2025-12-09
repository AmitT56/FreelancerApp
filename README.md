# Freelancer App

A full-stack application for managing freelancer bookings with a React frontend and FastAPI backend.

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
│   │   │   ├── LandingForm.tsx    # Client booking form
│   │   │   └── CalendarView.tsx   # Calendar display
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

- ✅ **Client Booking Form**: Submit client details with preferred date/time
- ✅ **Calendar View**: Visual calendar display using FullCalendar
- ✅ **Automatic Slot Finding**: Finds available time slots for bookings
- ✅ **Hot Reload**: Instant updates during development
- ✅ **RESTful API**: FastAPI with automatic OpenAPI documentation
- ✅ **SQLite Database**: Lightweight database for development

## API Endpoints

### Clients

- `POST /clients/` - Create a new client and automatically schedule an event
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

- `GET /clients/` - List all clients (ordered by creation date)

### Events

- `GET /events/` - List events within a date range
  - Query parameters:
    - `start` (optional): Start date (ISO format)
    - `end` (optional): End date (ISO format)
    - Defaults to ±30 days from now

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

The SQLite database (`freelancer.db`) is created automatically in the backend container. To reset:

```bash
# Stop services and remove volumes
docker-compose down -v

# Restart (new database will be created)
docker-compose up
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

## Production Deployment

For production, you'll want to:

1. Use production-ready Dockerfiles (multi-stage builds)
2. Set up proper environment variables
3. Use a production database (PostgreSQL, MySQL, etc.)
4. Configure CORS properly
5. Add authentication/authorization
6. Set up reverse proxy (nginx)
7. Enable HTTPS

## License

MIT
