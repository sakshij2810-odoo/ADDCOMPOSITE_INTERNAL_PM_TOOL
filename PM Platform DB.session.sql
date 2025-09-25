SELECT * FROM users;

SELECT * FROM analytics_data;

SELECT * FROM company_information;

SELECT * FROM conversation_messages;

SELECT * FROM conversations;

SELECT * FROM environment_configuration;

SELECT * FROM task_module_wise;

SELECT * FROM user_roles;

SELECT * FROM module_security;

SELECT * FROM security_settings;

SELECT * FROM latest_role_group;





UPDATE users 
SET role_uuid = 'c574752d-4930-4304-bd52-f2b46f74fb88'
WHERE role_value = 'PROJECT_MANAGER';


UPDATE user_roles 
SET 
    role_group = 'EMPLOYEE'

WHERE role_value = 'EMPLOYEE';


UPDATE latest_role_group 
SET 
   
     role_group_uuid = '1d1f090f-35e6-4976-b1c5-e9e946c6aeb0'
WHERE role_group = 'EMPLOYEE';

UPDATE latest_role_group 
SET role_uuid = 'c574752d-4930-4304-bd52-f2b46f74fb88'
WHERE role_value = 'PROJECT_MANAGER';