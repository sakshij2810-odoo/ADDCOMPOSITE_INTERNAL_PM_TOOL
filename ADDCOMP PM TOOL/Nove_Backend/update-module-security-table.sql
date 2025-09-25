-- Add missing fields to module_security table
-- Add map_column_user_uuid field
ALTER TABLE module_security ADD COLUMN IF NOT EXISTS map_column_user_uuid TEXT[];

-- Add column_relation_options field
ALTER TABLE module_security ADD COLUMN IF NOT EXISTS column_relation_options JSONB;

-- Update existing records to have default values
UPDATE module_security SET 
    map_column_user_uuid = ARRAY['created_by_uuid', 'modified_by_uuid'],
    column_relation_options = '[
        {
            "api": "/user/get-user",
            "field": "email",
            "value": "user_uuid",
            "column_key": "user_uuid",
            "column_label": "User"
        },
        {
            "api": "/user/get-branch",
            "field": "branch_name",
            "value": "branch_uuid",
            "column_key": "branch_uuid",
            "column_label": "Branch"
        }
    ]'::jsonb
WHERE map_column_user_uuid IS NULL;

-- Verify the updated table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'module_security' 
ORDER BY ordinal_position;
