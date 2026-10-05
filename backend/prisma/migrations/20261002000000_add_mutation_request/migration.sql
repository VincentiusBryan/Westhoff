-- Add OWNER to UserRole enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'OWNER';

-- CreateEnum
CREATE TYPE "MutationRequestStatus" AS ENUM ('REQUESTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "MutationRequest" (
    "id" SERIAL NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "status" "MutationRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "fromLocationId" INTEGER NOT NULL,
    "toLocationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MutationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MutationRequestItem" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "MutationRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MutationRequest_requestNumber_key"
ON "MutationRequest"("requestNumber");

-- AddForeignKey
ALTER TABLE "MutationRequest"
ADD CONSTRAINT "MutationRequest_fromLocationId_fkey"
FOREIGN KEY ("fromLocationId")
REFERENCES "Location"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationRequest"
ADD CONSTRAINT "MutationRequest_toLocationId_fkey"
FOREIGN KEY ("toLocationId")
REFERENCES "Location"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationRequest"
ADD CONSTRAINT "MutationRequest_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationRequestItem"
ADD CONSTRAINT "MutationRequestItem_requestId_fkey"
FOREIGN KEY ("requestId")
REFERENCES "MutationRequest"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationRequestItem"
ADD CONSTRAINT "MutationRequestItem_productId_fkey"
FOREIGN KEY ("productId")
REFERENCES "Product"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;