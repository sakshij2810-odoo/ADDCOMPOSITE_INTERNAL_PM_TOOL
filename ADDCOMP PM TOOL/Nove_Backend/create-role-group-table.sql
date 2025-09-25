-- Create latest_role_group table
CREATE TABLE IF NOT EXISTS latest_role_group (
    role_group_id SERIAL PRIMARY KEY,
    role_group_unique_id INTEGER NOT NULL,
    role_group_uuid UUID NOT NULL UNIQUE,
    role_group VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_by_uuid UUID,
    create_ts TIMESTAMP WITH TIME ZONE,
    insert_ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert role group records
INSERT INTO latest_role_group (
    role_group_id,
    role_group_unique_id,
    role_group_uuid,
    role_group,
    status,
    created_by_uuid,
    create_ts,
    insert_ts
) VALUES 
(8, 6, '512a245c-08d6-4bbf-af79-a8bf94b6067b', 'ADMIN', 'ACTIVE', '2d479924-9581-4f5d-abda-e73b7e9d8d83', '2025-06-25T06:15:23.000Z', '2025-06-25T06:15:23.000Z'),
(7, 5, '9d1f090f-35e6-4976-b1c5-e0e946c6aeb0', 'EMPLOYEE', 'ACTIVE', '2d479924-9581-4f5d-abda-e73b7e9d8d83', '2025-04-16T07:23:14.000Z', '2025-04-19T19:49:52.000Z'),
(5, 4, 'c574752d-4930-4304-bd52-f2b46f74fb88', 'PROJECT_MANAGER', 'ACTIVE', '2d479924-9581-4f5d-abda-e73b7e9d8d83', '2025-04-16T04:52:22.000Z', '2025-04-16T04:52:22.000Z'),
(3, 3, '35ba47e0-99c5-459a-a1ca-13ac55097631', 'ALL', 'ACTIVE', '2d479924-9581-4f5d-abda-e73b7e9d8d83', '2025-01-27T10:04:30.000Z', '2025-01-27T15:34:36.000Z')
ON CONFLICT (role_group_uuid) DO UPDATE SET
    role_group_id = EXCLUDED.role_group_id,
    role_group_unique_id = EXCLUDED.role_group_unique_id,
    role_group = EXCLUDED.role_group,
    status = EXCLUDED.status,
    created_by_uuid = EXCLUDED.created_by_uuid,
    create_ts = EXCLUDED.create_ts,
    insert_ts = EXCLUDED.insert_ts;

-- Verify the inserts
SELECT 
    role_group_id,
    role_group_unique_id,
    role_group_uuid,
    role_group,
    status,
    created_by_uuid,
    create_ts,
    insert_ts
FROM latest_role_group
ORDER BY role_group_unique_id;
