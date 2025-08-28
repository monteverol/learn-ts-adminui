/*
  Warnings:

  - The `jobCategory` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."JobCategoryType" AS ENUM ('MAINTENANCE', 'OPERATIONS', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."JobCategoryStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- DropIndex
DROP INDEX "public"."User_jobCategory_idx";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "jobCategory",
ADD COLUMN     "jobCategory" "public"."JobCategoryType";

-- DropEnum
DROP TYPE "public"."JobCategory";

-- CreateTable
CREATE TABLE "public"."JobCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."JobCategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "jobsCount" INTEGER NOT NULL DEFAULT 0,
    "avgPrice" DOUBLE PRECISION,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "JobCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobCategoryTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobCategoryId" TEXT NOT NULL,

    CONSTRAINT "JobCategoryTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobCategory_name_key" ON "public"."JobCategory"("name");

-- CreateIndex
CREATE INDEX "JobCategory_status_idx" ON "public"."JobCategory"("status");

-- CreateIndex
CREATE INDEX "JobCategory_deletedAt_idx" ON "public"."JobCategory"("deletedAt");

-- CreateIndex
CREATE INDEX "JobCategoryTag_jobCategoryId_idx" ON "public"."JobCategoryTag"("jobCategoryId");

-- AddForeignKey
ALTER TABLE "public"."JobCategoryTag" ADD CONSTRAINT "JobCategoryTag_jobCategoryId_fkey" FOREIGN KEY ("jobCategoryId") REFERENCES "public"."JobCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
