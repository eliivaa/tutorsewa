/*
  SAFE MIGRATION FOR EXISTING DATA
*/

-- 1. Create enum
CREATE TYPE "AvailabilityType" AS ENUM ('ONE_TO_ONE', 'GROUP');

-- 2. Drop old unique constraint
DROP INDEX "TutorAvailability_tutorId_dayOfWeek_startTime_endTime_key";

-- 3. Add columns as NULLABLE first
ALTER TABLE "TutorAvailability"
ADD COLUMN "sessionType" "AvailabilityType",
ADD COLUMN "maxStudents" INTEGER;

-- 4. Populate existing rows with a safe default
UPDATE "TutorAvailability"
SET "sessionType" = 'ONE_TO_ONE'
WHERE "sessionType" IS NULL;

-- 5. Make sessionType required AFTER data exists
ALTER TABLE "TutorAvailability"
ALTER COLUMN "sessionType" SET NOT NULL;

-- 6. Create new unique constraint (includes sessionType)
CREATE UNIQUE INDEX
"TutorAvailability_tutorId_dayOfWeek_startTime_endTime_sessionType_key"
ON "TutorAvailability"("tutorId", "dayOfWeek", "startTime", "endTime", "sessionType");
