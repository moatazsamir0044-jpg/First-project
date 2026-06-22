-- Rename stripePaymentId to paymobOrderId on the Booking table
ALTER TABLE "Booking" RENAME COLUMN "stripePaymentId" TO "paymobOrderId";
