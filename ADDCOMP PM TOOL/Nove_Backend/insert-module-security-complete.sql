-- Complete Module Security Insert Script
-- This script inserts all 32 module security records for ADMIN role

-- First, let's check if the ADMIN role exists
SELECT role_uuid, role_name, role_value FROM user_roles WHERE role_value = 'ADMIN';

-- If no ADMIN role exists, create one
INSERT INTO user_roles (role_uuid, role_name, role_value, description, created_by, created_at)
VALUES (
    '512a245c-08d6-4bbf-af79-a8bf94b6067b',
    'ADMIN',
    'ADMIN',
    'Administrator role with full access',
    'system',
    NOW()
) ON CONFLICT (role_uuid) DO NOTHING;


-- Insert all module security records
INSERT INTO module_security (
    role_module_id,
    role_module_unique_id,
    role_module_uuid,
    module_uuid,
    role_uuid,
    show_module,
    view_access,
    edit_access,
    send_sms,
    send_mail,
    send_whatsapp,
    send_call,
    filter_values,
    status,
    created_by_uuid,
    created_by_name,
    insert_ts,
    module_name,
    submodule_name,
    table_name,
    module_key
) VALUES 


-- 33. Role Group
(1015, 17, '22e78254-b3b3-4ca6-b8ee-e92440221c87', 'fbbbbd17-b965-471d-b3f4-ef3ed05a0b7f', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Security', 'Role Group', 'latest_role_group', 'SECURITY|ROLE GROUP|LATEST_ROLE_GROUP');





-- 18. Email
(1016, 18, 'f4f5f6f7-f8f9-abcd-opqr-567890123456', 'f5f6f7f8-f9f9-bcde-pqrs-678901234567', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Email', 'Email', 'email', 'EMAIL|EMAIL|EMAIL'),

-- 19. SMS
(1017, 19, 'f6f7f8f9-f0f1-cdef-qrst-789012345678', 'f7f8f9f0-f1f1-defg-rstu-890123456789', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'SMS', 'SMS', 'sms', 'SMS|SMS|SMS'),

-- 20. WhatsApp
(1018, 20, 'f8f9f0f1-f2f3-efgh-stuv-901234567890', 'f9f0f1f2-f3f3-fghi-tuvw-012345678901', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'WhatsApp', 'WhatsApp', 'whatsapp', 'WHATSAPP|WHATSAPP|WHATSAPP'),

-- 21. Calls
(1019, 21, 'f0f1f2f3-f4f5-ghij-uvwx-123456789012', 'f1f2f3f4-f5f5-hijk-vwxy-234567890123', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Calls', 'Calls', 'calls', 'CALLS|CALLS|CALLS'),

-- 22. Integrations
(1020, 22, 'f2f3f4f5-f6f7-ijkl-wxyz-345678901234', 'f3f4f5f6-f7f7-jklm-xyza-456789012345', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Integrations', 'Integrations', 'integrations', 'INTEGRATIONS|INTEGRATIONS|INTEGRATIONS'),

-- 23. API Management
(1021, 23, 'f4f5f6f7-f8f9-klmn-yzab-567890123456', 'f5f6f7f8-f9f9-lmno-zabc-678901234567', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'API Management', 'API Management', 'api_management', 'API|API_MANAGEMENT|API_MANAGEMENT'),



-- 25. Audit Logs
(1023, 25, 'f8f9f0f1-f2f3-opqr-cdef-901234567890', 'f9f0f1f2-f3f3-pqrs-defg-012345678901', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Audit Logs', 'Audit Logs', 'audit_logs', 'AUDIT|AUDIT_LOGS|AUDIT_LOGS'),

-- 26. Backup
(1024, 26, 'f0f1f2f3-f4f5-qrst-efgh-123456789012', 'f1f2f3f4-f5f5-rstu-fghi-234567890123', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Backup', 'Backup', 'backup', 'BACKUP|BACKUP|BACKUP'),

-- 27. Maintenance
(1025, 27, 'f2f3f4f5-f6f7-stuv-ghij-345678901234', 'f3f4f5f6-f7f7-tuvw-hijk-456789012345', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Maintenance', 'Maintenance', 'maintenance', 'MAINTENANCE|MAINTENANCE|MAINTENANCE'),

-- 28. System Health
(1026, 28, 'f4f5f6f7-f8f9-uvwx-ijkl-567890123456', 'f5f6f7f8-f9f9-vwxy-jklm-678901234567', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'System Health', 'System Health', 'system_health', 'SYSTEM|SYSTEM_HEALTH|SYSTEM_HEALTH'),

-- 29. Performance
(1027, 29, 'f6f7f8f9-f0f1-wxyz-klmn-789012345678', 'f7f8f9f0-f1f1-xyza-lmno-890123456789', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Performance', 'Performance', 'performance', 'PERFORMANCE|PERFORMANCE|PERFORMANCE'),

-- 30. Monitoring
(1028, 30, 'f8f9f0f1-f2f3-yzab-mnop-901234567890', 'f9f0f1f2-f3f3-zabc-nopq-012345678901', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Monitoring', 'Monitoring', 'monitoring', 'MONITORING|MONITORING|MONITORING'),

-- 31. Logs
(1029, 31, 'f0f1f2f3-f4f5-abcd-opqr-123456789012', 'f1f2f3f4-f5f5-bcde-pqrs-234567890123', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Logs', 'Logs', 'logs', 'LOGS|LOGS|LOGS'),

-- 32. Help & Support
(1030, 32, 'f2f3f4f5-f6f7-cdef-qrst-345678901234', 'f3f4f5f6-f7f7-defg-rstu-456789012345', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Help & Support', 'Help & Support', 'help_support', 'HELP|HELP_SUPPORT|HELP_SUPPORT');



-- //added

-- 17. Chat
(1015, 17, 'f2f3f4f5-f6f7-89ab-abcd-345678901234', 'f3f4f5f6-f7f7-9abc-efab-456789012345', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Chat', 'Chat', 'chat', 'CHAT|CHAT|CHAT');

-- 11. Settings
(1009, 11, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b1c2d3e4-f5f6-7890-bcde-f23456789012', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Settings', 'Settings', 'settings', 'SETTINGS|SETTINGS|SETTINGS'),

-- 12. Notifications
(1010, 12, 'c2d3e4f5-e6a7-8901-cdef-345678901234', 'd3e4f5f6-a7a7-9012-defe-456789012345', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Notifications', 'Notifications', 'notifications', 'NOTIFICATIONS|NOTIFICATIONS|NOTIFICATIONS'),

-- 13. Calendar
(1011, 13, 'e4f5f6f7-f8f9-0123-efea-567890123456', 'f5f6f7f8-f9f9-1234-faaa-678901234567', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Calendar', 'Calendar', 'calendar', 'CALENDAR|CALENDAR|CALENDAR');

-- 14. Files
(1012, 14, 'f6f7f8f9-f0f1-2345-ac8a-789012345678', 'f7f8f9f0-f1f1-3456-9a7b-890123456789', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Files', 'Files', 'files', 'FILES|FILES|FILES'),

-- 15. Documents
(1013, 15, 'f8f9f0f1-f2f3-4567-1a2c-901234567890', 'f9f0f1f2-f3f3-5678-25a1-012345678901', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Documents', 'Documents', 'documents', 'DOCUMENTS|DOCUMENTS|DOCUMENTS'),

-- 16. Communication
(1014, 16, 'f0f1f2f3-f4f5-6789-8a81-123456789012', 'f1f2f3f4-f5f5-789a-aa22-234567890123', '512a245c-08d6-4bbf-af79-a8bf94b6067b', 1, 1, 1, 0, 0, 0, 0, '{"or": {"user_uuid": ["*"]}}', 'ACTIVE', null, 'Ramesh', NOW(), 'Communication', 'Communication', 'communication', 'COMMUNICATION|COMMUNICATION|COMMUNICATION');


-- Verify the inserts
SELECT 
    role_module_unique_id,
    module_name,
    submodule_name,
    module_key,
    show_module,
    view_access,
    edit_access,
    status
FROM module_security 
WHERE role_uuid = '512a245c-08d6-4bbf-af79-a8bf94b6067b'
ORDER BY role_module_unique_id;
