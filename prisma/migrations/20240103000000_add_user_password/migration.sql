-- Add credential-based authentication support to User.
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
