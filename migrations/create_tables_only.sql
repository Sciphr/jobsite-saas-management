-- Alternative migration - just the CREATE TABLE statements starting from where it failed
-- Run these one by one if you're having permission issues

-- 3. Create saas_health_checks table
CREATE TABLE public.saas_health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id UUID NOT NULL,
    check_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    response_time INTEGER,
    error_message TEXT,
    details JSON,
    checked_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_health_checks_installation 
        FOREIGN KEY (installation_id) 
        REFERENCES saas_installations(id) 
        ON DELETE CASCADE
);

-- 4. Create indexes for saas_health_checks
CREATE INDEX idx_health_checks_installation ON public.saas_health_checks(installation_id);
CREATE INDEX idx_health_checks_checked_at ON public.saas_health_checks(checked_at);
CREATE INDEX idx_health_checks_status ON public.saas_health_checks(status);

-- 5. Create saas_backup_logs table
CREATE TABLE public.saas_backup_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id UUID NOT NULL,
    backup_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    file_size BIGINT,
    file_path TEXT,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT fk_backup_logs_installation 
        FOREIGN KEY (installation_id) 
        REFERENCES saas_installations(id) 
        ON DELETE CASCADE
);

-- 6. Create indexes for saas_backup_logs
CREATE INDEX idx_backup_logs_installation ON public.saas_backup_logs(installation_id);
CREATE INDEX idx_backup_logs_started_at ON public.saas_backup_logs(started_at);
CREATE INDEX idx_backup_logs_status ON public.saas_backup_logs(status);