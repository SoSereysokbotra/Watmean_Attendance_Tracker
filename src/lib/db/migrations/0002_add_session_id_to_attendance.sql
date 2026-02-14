  -- Add session_id column to attendance_records table
ALTER TABLE "attendance_records" ADD COLUMN "session_id" uuid;

-- Add foreign key constraint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_session_id_sessions_id_fk" 
  FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE set null ON UPDATE no action;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS "idx_attendance_session_id" ON "attendance_records" ("session_id");
