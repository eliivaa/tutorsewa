/*
  Warnings:

  - Made the column `studentId` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tutorId` on table `Conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_tutorId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "studentId" SET NOT NULL,
ALTER COLUMN "tutorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
