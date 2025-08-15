-- Add deployment automation tables
CREATE TABLE IF NOT EXISTS saas_deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id UUID REFERENCES saas_installations(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('starting', 'cloning', 'installing', 'building', 'configuring', 'completed', 'failed')),
    deployment_path TEXT,
    deployment_url TEXT,
    environment_vars JSONB,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_deployments_installation ON saas_deployments(installation_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON saas_deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_started_at ON saas_deployments(started_at);

-- Add deployment tracking fields to installations
ALTER TABLE saas_installations 
ADD COLUMN IF NOT EXISTS deployment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS deployment_url TEXT,
ADD COLUMN IF NOT EXISTS deployment_path TEXT,
ADD COLUMN IF NOT EXISTS port_number INTEGER,
ADD COLUMN IF NOT EXISTS subdomain VARCHAR(100);

-- Add deployment automation configuration table
CREATE TABLE IF NOT EXISTS saas_deployment_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    git_repo_url TEXT NOT NULL,
    default_env_vars JSONB,
    deployment_script TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default deployment template
INSERT INTO saas_deployment_templates (name, description, git_repo_url, default_env_vars) 
VALUES (
    'JobSite Main App',
    'Default template for JobSite application deployments',
    'https://github.com/yourusername/jobsite-main.git',
    '{
        "NODE_ENV": "production",
        "NEXTAUTH_SECRET": "TEMPLATE_VALUE",
        "JWT_SECRET": "TEMPLATE_VALUE",
        "SMTP_HOST": "TEMPLATE_VALUE",
        "SMTP_PORT": "587",
        "SMTP_USER": "TEMPLATE_VALUE",
        "SMTP_PASS": "TEMPLATE_VALUE"
    }'::jsonb
) ON CONFLICT DO NOTHING;

-- Add port management for automatic port assignment
CREATE TABLE IF NOT EXISTS saas_port_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    port_number INTEGER UNIQUE NOT NULL,
    installation_id UUID REFERENCES saas_installations(id) ON DELETE SET NULL,
    is_available BOOLEAN DEFAULT true,
    assigned_at TIMESTAMPTZ,
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-populate available ports (3001-3100)
INSERT INTO saas_port_assignments (port_number, is_available)
SELECT generate_series(3001, 3100), true
ON CONFLICT (port_number) DO NOTHING;