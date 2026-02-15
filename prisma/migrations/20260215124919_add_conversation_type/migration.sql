/*
  Warnings:

  - You are about to drop the `ThriftConversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ThriftMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('TUTOR_SESSION', 'THRIFT');

-- DropForeignKey
ALTER TABLE "ThriftConversation" DROP CONSTRAINT "ThriftConversation_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ThriftMessage" DROP CONSTRAINT "ThriftMessage_conversationId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "thriftItemId" TEXT,
ADD COLUMN     "type" "ConversationType" NOT NULL DEFAULT 'TUTOR_SESSION';

-- DropTable
DROP TABLE "ThriftConversation";

-- DropTable
DROP TABLE "ThriftMessage";
