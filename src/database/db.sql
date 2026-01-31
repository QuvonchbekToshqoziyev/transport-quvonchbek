CREATE TYPE permissionmodel AS ENUM (
    'branches',
    'transports',
    'staffs',
    'admins');
CREATE TYPE permissions AS ENUM (
    'create',
    'read',
    'update',
    'delete');
CREATE TYPE roles AS ENUM (
    'staff',
    'admin',
    'branchmanager',
    'superadmin');
CREATE TYPE genders as ENUM (
    'male',
    'female');
CREATE TABLE branches(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    address TEXT NOT NULL
);
CREATE TABLE transports(
    id SERIAL PRIMARY KEY,
    branch INTEGER REFERENCES branches(id) ON DELETE CASCADE,
    model VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    img TEXT,
    price NUMERIC(10, 2) NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staffs(
    id SERIAL PRIMARY KEY,
    branch INTEGER REFERENCES branches(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender genders NOT NULL,
    role roles NOT NULL DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE admins(
    id SERIAL PRIMARY KEY,
    staff INTEGER REFERENCES staffs(id) ON DELETE CASCADE,
    permission_model permissionmodel NOT NULL,
    permission permissions[] NOT NULL
);