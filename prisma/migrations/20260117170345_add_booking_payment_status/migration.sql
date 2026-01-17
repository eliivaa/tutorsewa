-- CreateEnum
CREATE TYPE "BookingPaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'FULLY_PAID');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentStatus" "BookingPaymentStatus" NOT NULL DEFAULT 'UNPAID';
