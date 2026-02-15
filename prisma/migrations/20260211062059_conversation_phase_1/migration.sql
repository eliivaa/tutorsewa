/*
  Warnings:

  - You are about to drop the column `bookingId` on the `Conversation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,tutorId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_bookingId_fkey";

-- DropIndex
DROP INDEX "Conversation_bookingId_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "bookingId",
ADD COLUMN     "studentId" TEXT,
ADD COLUMN     "tutorId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_studentId_tutorId_key" ON "Conversation"("studentId", "tutorId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
