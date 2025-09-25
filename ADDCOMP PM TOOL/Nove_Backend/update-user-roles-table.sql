-- Add missing fields to user_roles table
-- Add role_id as SERIAL PRIMARY KEY (will be added as a new column)
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS role_id SERIAL;

-- Add role_group field
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS role_group VARCHAR(50);

-- Add status field
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE';

-- Add modified_by_uuid field
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS modified_by_uuid UUID;

-- Add modified_by_name field
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS modified_by_name VARCHAR(255);

-- Update existing records to have default values
UPDATE user_roles SET status = 'ACTIVE' WHERE status IS NULL;
UPDATE user_roles SET role_group = 'ADMIN' WHERE role_group IS NULL;

-- Verify the updated table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_roles' 
ORDER BY ordinal_position;
