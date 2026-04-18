/*
  Warnings:

  - Changed the type of `payMode` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `paidAmount` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "payMode",
ADD COLUMN     "payMode" "PayMode" NOT NULL,
ALTER COLUMN "paidAmount" SET NOT NULL;
