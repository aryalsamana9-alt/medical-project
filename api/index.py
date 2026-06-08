import os
import sys

# Ensure the Api directory is on the Python path so imports work
# regardless of where the server is started from (local dev or Railway)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.forms import router as forms_router

app = FastAPI(
    title="Health App API",
    description="Backend API for the Health App MVP — authentication and form submissions.",
    version="1.0.0",
)

# Include routers with /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(forms_router, prefix="/api")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Health App API is running on Vercel"}


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}