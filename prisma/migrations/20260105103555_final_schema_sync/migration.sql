/*
  Warnings:

  - Added the required column `subject` to the `TutorAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TutorAvailability_tutorId_date_startTime_endTime_sessionTyp_key";

-- AlterTable
ALTER TABLE "TutorAvailability" ADD COLUMN     "level" TEXT,
ADD COLUMN     "subject" TEXT NOT NULL;
