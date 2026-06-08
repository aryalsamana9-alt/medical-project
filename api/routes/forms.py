from fastapi import APIRouter, Depends, HTTPException, status
from middleware import get_supabase_client, get_current_user
from models import FormSubmitRequest, FormSubmissionResponse

router = APIRouter()


@router.get("/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    """Return the current user's profile information."""
    return {
        "id": user["id"],
        "full_name": user["full_name"],
        "email": user["email"],
        "date_of_birth": user["date_of_birth"],
    }


@router.post("/submit-form", response_model=FormSubmissionResponse)
async def submit_form(data: FormSubmitRequest, user: dict = Depends(get_current_user)):
    """Submit a contact form. Saves to Supabase form_submissions table."""
    supabase = get_supabase_client()

    result = supabase.table("form_submissions").insert({
        "user_id": user["id"],
        "name": data.name,
        "email": data.email,
        "message": data.message,
    }).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit form. Please try again."
        )

    submission = result.data[0]

    return FormSubmissionResponse(
        id=submission["id"],
        name=submission["name"],
        email=submission["email"],
        message=submission["message"],
        submitted_at=submission["submitted_at"],
    )


@router.get("/submissions")
async def get_submissions(user: dict = Depends(get_current_user)):
    """Get all form submissions for the current user."""
    supabase = get_supabase_client()

    result = supabase.table("form_submissions") \
        .select("*") \
        .eq("user_id", user["id"]) \
        .order("submitted_at", desc=True) \
        .execute()

    return {"submissions": [
        {
            "id": row["id"],
            "name": row["name"],
            "email": row["email"],
            "message": row["message"],
            "submitted_at": row["submitted_at"],
        }
        for row in result.data
    ]}