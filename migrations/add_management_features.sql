-- Migration for SaaS Management Features
-- Add billing, health monitoring, and backup management fields

-- 1. Add new columns to saas_installations table
ALTER TABLE saas_installations 
ADD COLUMN billing_cycle VARCHAR(50) DEFAULT 'monthly',
ADD COLUMN billing_amount DECIMAL(10,2),
ADD COLUMN next_billing_date TIMESTAMPTZ,
ADD COLUMN billing_status VARCHAR(50) DEFAULT 'active',
ADD COLUMN last_health_check TIMESTAMPTZ,
ADD COLUMN health_status VARCHAR(50) DEFAULT 'unknown',
ADD COLUMN health_details JSON,
ADD COLUMN backup_enabled BOOLEAN DEFAULT true,
ADD COLUMN last_backup_at TIMESTAMPTZ,
ADD COLUMN backup_status VARCHAR(50) DEFAULT 'pending';

-- 2. Update existing billing_plan column to have default
ALTER TABLE saas_installations 
ALTER COLUMN billing_plan SET DEFAULT 'Pro';

-- 3. Create saas_health_checks table
CREATE TABLE saas_health_checks (
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
CREATE INDEX idx_health_checks_installation ON saas_health_checks(installation_id);
CREATE INDEX idx_health_checks_checked_at ON saas_health_checks(checked_at);
CREATE INDEX idx_health_checks_status ON saas_health_checks(status);

-- 5. Create saas_backup_logs table
CREATE TABLE saas_backup_logs (
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
CREATE INDEX idx_backup_logs_installation ON saas_backup_logs(installation_id);
CREATE INDEX idx_backup_logs_started_at ON saas_backup_logs(started_at);
CREATE INDEX idx_backup_logs_status ON saas_backup_logs(status);

-- 7. Support Ticket System Tables (if you want to implement this)
CREATE TABLE saas_support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id UUID NOT NULL,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(20) DEFAULT 'open', -- open, in_progress, waiting, resolved, closed
    category VARCHAR(50), -- technical, billing, feature_request, bug_report
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    assigned_to VARCHAR(255), -- your email or identifier
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    CONSTRAINT fk_support_tickets_installation 
        FOREIGN KEY (installation_id) 
        REFERENCES saas_installations(id) 
        ON DELETE CASCADE
);

-- 8. Support Ticket Messages/Responses
CREATE TABLE saas_support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL,
    sender_type VARCHAR(20) NOT NULL, -- customer, admin
    sender_name VARCHAR(255),
    sender_email VARCHAR(255),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- internal notes vs customer-visible
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_support_messages_ticket 
        FOREIGN KEY (ticket_id) 
        REFERENCES saas_support_tickets(id) 
        ON DELETE CASCADE
);

-- 9. Indexes for support ticket tables
CREATE INDEX idx_support_tickets_installation ON saas_support_tickets(installation_id);
CREATE INDEX idx_support_tickets_status ON saas_support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON saas_support_tickets(priority);
CREATE INDEX idx_support_tickets_created_at ON saas_support_tickets(created_at);
CREATE INDEX idx_support_tickets_number ON saas_support_tickets(ticket_number);

CREATE INDEX idx_support_messages_ticket ON saas_support_messages(ticket_id);
CREATE INDEX idx_support_messages_created_at ON saas_support_messages(created_at);

-- 10. Create a function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    ticket_num TEXT;
    counter INTEGER;
BEGIN
    -- Get today's date in YYYYMMDD format
    ticket_num := 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-';
    
    -- Get count of tickets created today + 1
    SELECT COUNT(*) + 1 INTO counter
    FROM saas_support_tickets 
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Pad with zeros to make it 4 digits
    ticket_num := ticket_num || LPAD(counter::TEXT, 4, '0');
    
    RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- 11. Create trigger to auto-generate ticket numbers
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ticket_number
    BEFORE INSERT ON saas_support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_ticket_number();

-- 12. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_support_tickets_updated_at
    BEFORE UPDATE ON saas_support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 13. Sample data updates (optional)
-- Update existing installations to have proper billing plans
-- UPDATE saas_installations SET billing_plan = 'Pro' WHERE billing_plan IS NULL;
-- UPDATE saas_installations SET billing_status = 'active' WHERE billing_status IS NULL;
-- UPDATE saas_installations SET health_status = 'unknown' WHERE health_status IS NULL;
-- UPDATE saas_installations SET backup_status = 'pending' WHERE backup_status IS NULL;