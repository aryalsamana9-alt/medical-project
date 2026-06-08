import bcrypt
from fastapi import APIRouter, HTTPException, status
from middleware import get_supabase_client, create_jwt_token
from models import RegisterRequest, LoginRequest, TokenResponse, UserResponse

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
async def register(data: RegisterRequest):
    """Register a new user account and return a JWT token."""
    supabase = get_supabase_client()

    # Check if email already exists
    existing = supabase.table("users").select("id").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    # Hash the password
    password_hash = bcrypt.hashpw(
        data.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    # Insert user into Supabase
    result = supabase.table("users").insert({
        "full_name": data.full_name,
        "email": data.email,
        "date_of_birth": data.date_of_birth,
        "password_hash": password_hash,
    }).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create account. Please try again."
        )

    user = result.data[0]
    token = create_jwt_token(user["id"])

    return TokenResponse(
        token=token,
        user=UserResponse(
            id=user["id"],
            full_name=user["full_name"],
            email=user["email"],
            date_of_birth=user["date_of_birth"],
        )
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    """Login with email and password, returns a JWT token."""
    supabase = get_supabase_client()

    # Find user by email
    result = supabase.table("users").select("*").eq("email", data.email).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    user = result.data[0]

    # Verify password
    is_valid = bcrypt.checkpw(
        data.password.encode("utf-8"),
        user["password_hash"].encode("utf-8")
    )
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_jwt_token(user["id"])

    return TokenResponse(
        token=token,
        user=UserResponse(
            id=user["id"],
            full_name=user["full_name"],
            email=user["email"],
            date_of_birth=user["date_of_birth"],
        )
    )