/*
  Warnings:

  - Added the required column `dayOfWeek` to the `TutorAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TutorAvailability" ADD COLUMN     "dayOfWeek" "DayOfWeek" NOT NULL;
