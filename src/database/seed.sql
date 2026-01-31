-- Seed data for transport_sale database
-- Run this after creating the schema from db.sql

-- Insert branches
INSERT INTO branches (name, address) VALUES 
('Main Branch', '123 Main Street, Tashkent'),
('North Branch', '456 North Avenue, Samarkand'),
('South Branch', '789 South Road, Bukhara');

-- Insert transports
INSERT INTO transports (branch, model, color, price) VALUES 
(1, 'Lacetti', 'white', 15000.00),
(1, 'Nexia', 'black', 12000.00),
(1, 'Malibu', 'silver', 28000.00),
(1, 'Cobalt', 'blue', 14000.00),
(2, 'Spark', 'red', 8000.00),
(2, 'Damas', 'white', 7500.00),
(2, 'Lacetti', 'grey', 15500.00),
(3, 'Malibu', 'black', 29000.00),
(3, 'Tracker', 'white', 32000.00),
(3, 'Equinox', 'blue', 35000.00);

-- Insert staff members (password is 'password123' hashed with bcrypt)
-- Note: These are pre-hashed passwords for testing
INSERT INTO staffs (branch, username, email, password, birth_date, gender, role) VALUES 
(1, 'admin1', 'admin1@transport.com', '$2b$10$Z5VKwiCS/sLHAres6FQq/.2Qj0gjtV5.JSAUFpsOMW1SbUmq/dsYS', '1990-01-15', 'male', 'staff'),
(1, 'manager1', 'manager1@transport.com', '$2b$10$Z5VKwiCS/sLHAres6FQq/.2Qj0gjtV5.JSAUFpsOMW1SbUmq/dsYS', '1985-05-20', 'male', 'branchmanager'),
(2, 'staff2', 'staff2@transport.com', '$2b$10$Z5VKwiCS/sLHAres6FQq/.2Qj0gjtV5.JSAUFpsOMW1SbUmq/dsYS', '1992-08-10', 'female', 'staff'),
(2, 'manager2', 'manager2@transport.com', '$2b$10$Z5VKwiCS/sLHAres6FQq/.2Qj0gjtV5.JSAUFpsOMW1SbUmq/dsYS', '1988-03-25', 'female', 'branchmanager'),
(3, 'staff3', 'staff3@transport.com', '$2b$10$Z5VKwiCS/sLHAres6FQq/.2Qj0gjtV5.JSAUFpsOMW1SbUmq/dsYS', '1995-11-30', 'male', 'staff');

-- Insert admins with permissions
INSERT INTO admins (staff, permission_model, permission) VALUES 
(1, 'transports', '{create,read,update,delete}'),
(1, 'staffs', '{read}'),
(2, 'transports', '{create,read,update,delete}'),
(2, 'staffs', '{create,read,update,delete}'),
(2, 'branches', '{read,update}'),
(3, 'transports', '{read}'),
(4, 'transports', '{create,read,update,delete}'),
(4, 'staffs', '{create,read,update,delete}'),
(4, 'branches', '{read,update}');

-- Summary:
-- Branch 1: Main Branch - has admin1 (staff with transport perms), manager1 (branchmanager)
-- Branch 2: North Branch - has staff2 (staff with transport read), manager2 (branchmanager)
-- Branch 3: South Branch - has staff3 (regular staff, no admin permissions)
