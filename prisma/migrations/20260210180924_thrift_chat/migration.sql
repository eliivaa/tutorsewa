-- CreateTable
CREATE TABLE "ThriftConversation" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThriftConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThriftMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThriftMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ThriftConversation" ADD CONSTRAINT "ThriftConversation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ThriftItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThriftMessage" ADD CONSTRAINT "ThriftMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ThriftConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
