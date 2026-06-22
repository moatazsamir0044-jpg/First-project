-- Add role to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'user';

-- Add userId to Booking (optional link to authenticated user)
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
  NOT VALID;

-- Performance indexes
CREATE INDEX IF NOT EXISTS "Listing_area_idx" ON "Listing"("area");
CREATE INDEX IF NOT EXISTS "Listing_isActive_idx" ON "Listing"("isActive");
CREATE INDEX IF NOT EXISTS "Listing_pricePerNight_idx" ON "Listing"("pricePerNight");
CREATE INDEX IF NOT EXISTS "Listing_rating_idx" ON "Listing"("rating");

CREATE INDEX IF NOT EXISTS "Booking_listingId_idx" ON "Booking"("listingId");
CREATE INDEX IF NOT EXISTS "Booking_guestEmail_idx" ON "Booking"("guestEmail");
CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status");
CREATE INDEX IF NOT EXISTS "Booking_checkIn_checkOut_idx" ON "Booking"("checkIn", "checkOut");

CREATE INDEX IF NOT EXISTS "Review_listingId_idx" ON "Review"("listingId");
CREATE INDEX IF NOT EXISTS "Review_rating_idx" ON "Review"("rating");

CREATE INDEX IF NOT EXISTS "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt");
