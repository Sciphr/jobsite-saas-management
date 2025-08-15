-- Update customer creation workflow
-- Make domain optional and add admin_name field

-- Make domain nullable (allow customers to be created without domain initially)
ALTER TABLE saas_installations ALTER COLUMN domain DROP NOT NULL;

-- Add admin_name field for better customer information
ALTER TABLE saas_installations ADD COLUMN admin_name VARCHAR(255);

-- Update existing records to have a deployment_status if they don't already
UPDATE saas_installations 
SET deployment_status = 'pending' 
WHERE deployment_status IS NULL;