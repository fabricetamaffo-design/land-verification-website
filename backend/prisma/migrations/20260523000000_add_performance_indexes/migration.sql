-- Performance indexes for common query patterns

CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");

CREATE INDEX IF NOT EXISTS "land_parcels_quarter_idx" ON "land_parcels"("quarter");
CREATE INDEX IF NOT EXISTS "land_parcels_status_idx" ON "land_parcels"("status");
CREATE INDEX IF NOT EXISTS "land_parcels_is_active_idx" ON "land_parcels"("is_active");

CREATE INDEX IF NOT EXISTS "ownership_records_land_id_idx" ON "ownership_records"("land_id");

CREATE INDEX IF NOT EXISTS "land_documents_land_id_idx" ON "land_documents"("land_id");

CREATE INDEX IF NOT EXISTS "audit_logs_land_id_idx" ON "audit_logs"("land_id");
CREATE INDEX IF NOT EXISTS "audit_logs_user_id_idx" ON "audit_logs"("user_id");
