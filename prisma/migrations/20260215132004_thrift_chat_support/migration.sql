-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_tutorId_fkey";

-- DropIndex
DROP INDEX "Conversation_studentId_tutorId_key";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "thriftUserId" TEXT,
ALTER COLUMN "tutorId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Conversation_studentId_idx" ON "Conversation"("studentId");

-- CreateIndex
CREATE INDEX "Conversation_tutorId_idx" ON "Conversation"("tutorId");

-- CreateIndex
CREATE INDEX "Conversation_thriftUserId_idx" ON "Conversation"("thriftUserId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Tutor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_thriftUserId_fkey" FOREIGN KEY ("thriftUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
