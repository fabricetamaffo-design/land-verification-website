-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "LandStatus" AS ENUM ('VALID', 'SUSPICIOUS', 'DUPLICATE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_parcels" (
    "id" TEXT NOT NULL,
    "title_number" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "area_sqm" DOUBLE PRECISION NOT NULL,
    "gps_lat" DOUBLE PRECISION NOT NULL,
    "gps_lng" DOUBLE PRECISION NOT NULL,
    "status" "LandStatus" NOT NULL DEFAULT 'VALID',
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "title_approved_year" INTEGER,
    "land_use_type" TEXT NOT NULL DEFAULT 'RESIDENTIAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uploaded_by_id" TEXT NOT NULL,

    CONSTRAINT "land_parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ownership_records" (
    "id" TEXT NOT NULL,
    "land_id" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "ownership_type" TEXT NOT NULL DEFAULT 'PURCHASE',
    "from_year" INTEGER NOT NULL,
    "to_year" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ownership_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_documents" (
    "id" TEXT NOT NULL,
    "land_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "land_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "land_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "land_parcels_title_number_key" ON "land_parcels"("title_number");

-- AddForeignKey
ALTER TABLE "land_parcels" ADD CONSTRAINT "land_parcels_uploaded_by_id_fkey"
    FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownership_records" ADD CONSTRAINT "ownership_records_land_id_fkey"
    FOREIGN KEY ("land_id") REFERENCES "land_parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_documents" ADD CONSTRAINT "land_documents_land_id_fkey"
    FOREIGN KEY ("land_id") REFERENCES "land_parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_land_id_fkey"
    FOREIGN KEY ("land_id") REFERENCES "land_parcels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
