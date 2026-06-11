"""Appointment booking API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from middleware import get_supabase_client, get_current_user
from models import AppointmentCreateRequest, AppointmentResponse
from typing import List

router = APIRouter()


@router.post("/appointments", response_model=AppointmentResponse)
async def create_appointment(data: AppointmentCreateRequest, user: dict = Depends(get_current_user)):
    """Create a new appointment."""
    supabase = get_supabase_client()

    result = supabase.table("appointments").insert({
        "user_id": user["id"],
        "doctor_id": data.doctor_id,
        "doctor_name": data.doctor_name,
        "patient_name": data.patient_name,
        "patient_email": data.patient_email,
        "patient_phone": data.patient_phone,
        "appointment_date": data.appointment_date,
        "appointment_time": data.appointment_time,
        "reason": data.reason,
        "notes": data.notes,
        "status": "Pending",
    }).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create appointment. Please try again.",
        )

    apt = result.data[0]
    return AppointmentResponse(
        id=apt["id"],
        user_id=apt["user_id"],
        doctor_id=apt["doctor_id"],
        doctor_name=apt["doctor_name"],
        patient_name=apt["patient_name"],
        patient_email=apt["patient_email"],
        patient_phone=apt["patient_phone"],
        appointment_date=apt["appointment_date"],
        appointment_time=apt["appointment_time"],
        reason=apt["reason"],
        notes=apt.get("notes", ""),
        status=apt["status"],
        created_at=apt["created_at"],
        updated_at=apt.get("updated_at", ""),
    )


@router.get("/appointments", response_model=List[AppointmentResponse])
async def get_appointments(user: dict = Depends(get_current_user)):
    """Get all appointments for the authenticated user."""
    supabase = get_supabase_client()

    result = supabase.table("appointments") \
        .select("*") \
        .eq("user_id", user["id"]) \
        .order("appointment_date", desc=True) \
        .execute()

    return [
        AppointmentResponse(
            id=row["id"],
            user_id=row["user_id"],
            doctor_id=row["doctor_id"],
            doctor_name=row["doctor_name"],
            patient_name=row["patient_name"],
            patient_email=row["patient_email"],
            patient_phone=row["patient_phone"],
            appointment_date=row["appointment_date"],
            appointment_time=row["appointment_time"],
            reason=row["reason"],
            notes=row.get("notes", ""),
            status=row["status"],
            created_at=row["created_at"],
            updated_at=row.get("updated_at", ""),
        )
        for row in result.data
    ]


@router.get("/appointments/upcoming", response_model=List[AppointmentResponse])
async def get_upcoming_appointments(user: dict = Depends(get_current_user)):
    """Get upcoming appointments (Pending or Confirmed)."""
    supabase = get_supabase_client()

    result = supabase.table("appointments") \
        .select("*") \
        .eq("user_id", user["id"]) \
        .in_("status", ["Pending", "Confirmed"]) \
        .order("appointment_date", asc=True) \
        .execute()

    return [
        AppointmentResponse(
            id=row["id"],
            user_id=row["user_id"],
            doctor_id=row["doctor_id"],
            doctor_name=row["doctor_name"],
            patient_name=row["patient_name"],
            patient_email=row["patient_email"],
            patient_phone=row["patient_phone"],
            appointment_date=row["appointment_date"],
            appointment_time=row["appointment_time"],
            reason=row["reason"],
            notes=row.get("notes", ""),
            status=row["status"],
            created_at=row["created_at"],
            updated_at=row.get("updated_at", ""),
        )
        for row in result.data
    ]


@router.get("/appointments/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment_by_id(appointment_id: str, user: dict = Depends(get_current_user)):
    """Get a single appointment by ID."""
    supabase = get_supabase_client()

    result = supabase.table("appointments") \
        .select("*") \
        .eq("id", appointment_id) \
        .eq("user_id", user["id"]) \
        .execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    row = result.data[0]
    return AppointmentResponse(
        id=row["id"],
        user_id=row["user_id"],
        doctor_id=row["doctor_id"],
        doctor_name=row["doctor_name"],
        patient_name=row["patient_name"],
        patient_email=row["patient_email"],
        patient_phone=row["patient_phone"],
        appointment_date=row["appointment_date"],
        appointment_time=row["appointment_time"],
        reason=row["reason"],
        notes=row.get("notes", ""),
        status=row["status"],
        created_at=row["created_at"],
        updated_at=row.get("updated_at", ""),
    )


@router.patch("/appointments/{appointment_id}/cancel", response_model=AppointmentResponse)
async def cancel_appointment(appointment_id: str, user: dict = Depends(get_current_user)):
    """Cancel an appointment."""
    supabase = get_supabase_client()

    # Verify ownership
    check = supabase.table("appointments") \
        .select("id,status") \
        .eq("id", appointment_id) \
        .eq("user_id", user["id"]) \
        .execute()

    if not check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    if check.data[0]["status"] in ("Cancelled", "Completed"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This appointment cannot be cancelled.",
        )

    result = supabase.table("appointments") \
        .update({"status": "Cancelled"}) \
        .eq("id", appointment_id) \
        .eq("user_id", user["id"]) \
        .execute()

    row = result.data[0]
    return AppointmentResponse(
        id=row["id"],
        user_id=row["user_id"],
        doctor_id=row["doctor_id"],
        doctor_name=row["doctor_name"],
        patient_name=row["patient_name"],
        patient_email=row["patient_email"],
        patient_phone=row["patient_phone"],
        appointment_date=row["appointment_date"],
        appointment_time=row["appointment_time"],
        reason=row["reason"],
        notes=row.get("notes", ""),
        status=row["status"],
        created_at=row["created_at"],
        updated_at=row.get("updated_at", ""),
    )