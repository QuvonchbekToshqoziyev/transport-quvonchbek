-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS staffs CASCADE;
DROP TABLE IF EXISTS transports CASCADE;
DROP TABLE IF EXISTS branches CASCADE;

-- Drop types if they exist
DROP TYPE IF EXISTS permissionmodel CASCADE;
DROP TYPE IF EXISTS permissions CASCADE;
DROP TYPE IF EXISTS roles CASCADE;
DROP TYPE IF EXISTS genders CASCADE;

-- Recreate from db.sql
\i src/database/db.sql
