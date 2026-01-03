ALTER TABLE "Booking"
ADD COLUMN "availabilityId" TEXT;

UPDATE "Booking"
SET "availabilityId" = (
  SELECT id FROM "TutorAvailability" LIMIT 1
);

ALTER TABLE "Booking"
ALTER COLUMN "availabilityId" SET NOT NULL;

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_availabilityId_fkey"
FOREIGN KEY ("availabilityId") REFERENCES "TutorAvailability"(id)
ON DELETE CASCADE;
