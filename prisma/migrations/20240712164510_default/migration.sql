/*
  Warnings:

  - Made the column `session_token` on table `sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "session_token" SET NOT NULL;
