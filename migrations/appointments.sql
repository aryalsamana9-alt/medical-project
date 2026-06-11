-- ============================================================================
-- APPOINTMENTS TABLE MIGRATION
-- Run this SQL in the Supabase SQL Editor to create the appointments table
-- and configure Row Level Security (RLS) policies.
-- ============================================================================

-- 1. Create the appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);

-- 3. Create updated_at auto-trigger
CREATE OR REPLACE FUNCTION public.update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_appointments_updated_at ON public.appointments;
CREATE TRIGGER trigger_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_appointments_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- 4. Enable RLS on the appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 5. Users can view only their own appointments
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
CREATE POLICY "Users can view own appointments"
    ON public.appointments
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 6. Users can create appointments for themselves
DROP POLICY IF EXISTS "Users can create own appointments" ON public.appointments;
CREATE POLICY "Users can create own appointments"
    ON public.appointments
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 7. Users can update only their own appointments
DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
CREATE POLICY "Users can update own appointments"
    ON public.appointments
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8. Users can delete only their own appointments (optional)
DROP POLICY IF EXISTS "Users can delete own appointments" ON public.appointments;
CREATE POLICY "Users can delete own appointments"
    ON public.appointments
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================================================
-- VERIFICATION QUERIES (run after migration to confirm setup)
-- ============================================================================

-- Check table exists
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'appointments';

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments';

-- Check policies
-- SELECT policyname, permissive, cmd FROM pg_policies WHERE tablename = 'appointments';

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename = 'appointments';