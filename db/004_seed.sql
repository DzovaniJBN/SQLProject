-- ================================
-- 004_seed.sql
-- Seed data for testing, RLS, and performance
-- ================================

BEGIN;

-- ---------- TENANTS ----------
INSERT INTO tenants (id, name, created_at)
VALUES
    ('11111111-1111-4111-8111-111111111111', 'TenantAlpha', NOW()),
    ('22222222-2222-4222-8222-222222222222', 'TenantBeta', NOW());

-- ---------- USERS ----------
INSERT INTO users (id, tenant_id, email, role, created_at)
VALUES
    ('aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'alice@alpha.com', 'admin', NOW()),
    ('aaaaaaaa-1111-4111-8111-aaaaaaaaaaab', '11111111-1111-4111-8111-111111111111', 'bob@alpha.com', 'member', NOW()),
    ('bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222', 'carol@beta.com', 'admin', NOW()),
    ('bbbbbbbb-2222-4222-8222-bbbbbbbbbbbc', '22222222-2222-4222-8222-222222222222', 'dave@beta.com', 'member', NOW());

-- ---------- PROJECTS ----------
INSERT INTO projects (id, tenant_id, name, created_at)
VALUES
    ('11111111-1111-4111-8111-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Alpha Project 1', NOW()),
    ('11111111-1111-4111-8111-aaaaaaaaaaab', '11111111-1111-4111-8111-111111111111', 'Alpha Project 2', NOW()),
    ('22222222-2222-4222-8222-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222', 'Beta Project 1', NOW());

-- ---------- ITEMS ----------
INSERT INTO items (id, project_id, title, status, created_at)
VALUES
    ('aaaaaaaa-1111-4111-8111-111111111111', '11111111-1111-4111-8111-aaaaaaaaaaaa', 'Task A1', 'todo', NOW()),
    ('aaaaaaaa-1111-4111-8111-111111111112', '11111111-1111-4111-8111-aaaaaaaaaaaa', 'Task A2', 'in_progress', NOW()),
    ('aaaaaaaa-1111-4111-8111-111111111113', '11111111-1111-4111-8111-aaaaaaaaaaaa', 'Task A3', 'done', NOW()),
    ('aaaaaaaa-1111-4111-8111-111111111114', '11111111-1111-4111-8111-aaaaaaaaaaaa', 'Task A4', 'archived', NOW()),
    ('aaaaaaaa-1111-4111-8111-111111111115', '11111111-1111-4111-8111-aaaaaaaaaaaa', 'Task A5', 'todo', NOW()),

    ('aaaaaaaa-1111-4111-8111-111111111121', '11111111-1111-4111-8111-aaaaaaaaaaab', 'Task B1', 'todo', NOW()),
    ('aaaaaaaa-1111-4111-8111-111111111122', '11111111-1111-4111-8111-aaaaaaaaaaab', 'Task B2', 'done', NOW()),

    ('bbbbbbbb-2222-4222-8222-222222222221', '22222222-2222-4222-8222-bbbbbbbbbbbb', 'Task C1', 'todo', NOW()),
    ('bbbbbbbb-2222-4222-8222-222222222222', '22222222-2222-4222-8222-bbbbbbbbbbbb', 'Task C2', 'in_progress', NOW());

COMMIT;
