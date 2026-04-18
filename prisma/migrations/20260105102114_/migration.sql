/*
  Warnings:

  - You are about to drop the column `level` on the `TutorAvailability` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `TutorAvailability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TutorAvailability" DROP COLUMN "level",
DROP COLUMN "subject";
