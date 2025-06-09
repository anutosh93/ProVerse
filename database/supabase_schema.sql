-- ProVerse Database Schema for Supabase
-- Run this in Supabase SQL Editor to create all required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'premium', 'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{
        "theme": "system",
        "language": "en",
        "timezone": "UTC",
        "notifications": {
            "email": true,
            "push": true,
            "inApp": true,
            "marketing": false
        },
        "aiAssistantEnabled": true,
        "autoSaveEnabled": true
    }'::jsonb,
    subscription JSONB DEFAULT '{
        "plan": "free",
        "status": "active",
        "currentPeriodStart": null,
        "currentPeriodEnd": null,
        "cancelAtPeriodEnd": false
    }'::jsonb
);

-- Teams table
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'team', 'public')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{
        "aiProvider": "openai",
        "autoBackup": true,
        "collaborationEnabled": true,
        "versionControlEnabled": true
    }'::jsonb
);

-- Project modules table
CREATE TABLE project_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('brainstorming', 'wireframing', 'figma_integration', 'code_generation', 'qa_testing', 'analytics', 'bug_tracking')),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brainstorming sessions table
CREATE TABLE brainstorming_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    participants UUID[] DEFAULT '{}',
    competitor_analysis JSONB,
    usps TEXT[] DEFAULT '{}',
    moat TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table
CREATE TABLE ideas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES brainstorming_sessions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    votes INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wireframes table
CREATE TABLE wireframes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'manual' CHECK (type IN ('upload', 'ai_generated', 'manual')),
    source TEXT CHECK (source IN ('pen_paper', 'miro', 'figma', 'sketch', 'other')),
    file_url TEXT,
    canvas_data JSONB,
    prototype JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wireframe screens table
CREATE TABLE wireframe_screens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    wireframe_id UUID REFERENCES wireframes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    canvas_data JSONB,
    notes TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wireframe components table
CREATE TABLE wireframe_components (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    screen_id UUID REFERENCES wireframe_screens(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('button', 'input', 'text', 'image', 'card', 'navigation', 'modal', 'dropdown', 'checkbox', 'radio', 'slider', 'table', 'chart')),
    x NUMERIC NOT NULL,
    y NUMERIC NOT NULL,
    width NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    properties JSONB DEFAULT '{}'::jsonb
);

-- Figma files table
CREATE TABLE figma_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    figma_id TEXT NOT NULL,
    name TEXT NOT NULL,
    key TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    last_modified TIMESTAMP WITH TIME ZONE,
    version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRDs (Product Requirements Documents) table
CREATE TABLE prds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    figma_file_id UUID REFERENCES figma_files(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    overview TEXT NOT NULL,
    objectives TEXT[] DEFAULT '{}',
    functional_requirements JSONB DEFAULT '[]'::jsonb,
    non_functional_requirements JSONB DEFAULT '[]'::jsonb,
    technical_specifications JSONB DEFAULT '[]'::jsonb,
    design_specs JSONB DEFAULT '[]'::jsonb,
    timeline JSONB DEFAULT '[]'::jsonb,
    success_metrics TEXT[] DEFAULT '{}',
    assumptions TEXT[] DEFAULT '{}',
    risks JSONB DEFAULT '[]'::jsonb,
    export_format TEXT DEFAULT 'markdown' CHECK (export_format IN ('confluence', 'notion', 'markdown', 'pdf')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stories table
CREATE TABLE user_stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    prd_id UUID REFERENCES prds(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    acceptance_criteria TEXT[] DEFAULT '{}',
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    story_points INTEGER,
    status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'review', 'done')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated code table
CREATE TABLE generated_code (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    prd_id UUID REFERENCES prds(id) ON DELETE CASCADE,
    framework TEXT NOT NULL CHECK (framework IN ('react', 'nextjs', 'vue', 'angular', 'svelte', 'react_native', 'flutter', 'express', 'fastapi', 'django', 'rails')),
    language TEXT NOT NULL CHECK (language IN ('typescript', 'javascript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby')),
    architecture TEXT NOT NULL CHECK (architecture IN ('spa', 'ssr', 'ssg', 'microservices', 'monolith', 'serverless', 'jamstack')),
    files JSONB DEFAULT '[]'::jsonb,
    dependencies JSONB DEFAULT '[]'::jsonb,
    deployment_config JSONB,
    status TEXT DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'error')),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test suites table
CREATE TABLE test_suites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('unit', 'integration', 'e2e', 'visual', 'performance', 'accessibility')),
    coverage JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test cases table
CREATE TABLE test_cases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_suite_id UUID REFERENCES test_suites(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    steps JSONB DEFAULT '[]'::jsonb,
    expected_result TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    tags TEXT[] DEFAULT '{}',
    automation_status TEXT DEFAULT 'manual' CHECK (automation_status IN ('manual', 'automated', 'in_progress')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test runs table
CREATE TABLE test_runs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_suite_id UUID REFERENCES test_suites(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    results JSONB DEFAULT '[]'::jsonb,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER,
    coverage JSONB
);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    properties JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'web' CHECK (source IN ('web', 'mobile', 'api'))
);

-- User journeys table
CREATE TABLE user_journeys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    steps JSONB DEFAULT '[]'::jsonb,
    conversion_rate NUMERIC DEFAULT 0,
    drop_off_points JSONB DEFAULT '[]'::jsonb,
    insights TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bugs table
CREATE TABLE bugs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'duplicate')),
    type TEXT DEFAULT 'bug' CHECK (type IN ('bug', 'feature', 'improvement', 'task')),
    reproducible BOOLEAN DEFAULT true,
    steps TEXT[] DEFAULT '{}',
    expected_behavior TEXT,
    actual_behavior TEXT,
    environment JSONB,
    assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    labels TEXT[] DEFAULT '{}',
    jira_key TEXT,
    ai_suggestion JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File uploads table
CREATE TABLE file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size BIGINT NOT NULL,
    url TEXT NOT NULL,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Comments table (for various entities)
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- 'idea', 'bug', 'wireframe', etc.
    entity_id UUID NOT NULL,
    mentions UUID[] DEFAULT '{}',
    reactions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting sessions table
CREATE TABLE meeting_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    participants JSONB DEFAULT '[]'::jsonb,
    recording_url TEXT,
    transcript_url TEXT,
    summary JSONB,
    action_items JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    module_type TEXT CHECK (module_type IN ('brainstorming', 'wireframing', 'figma_integration', 'code_generation', 'qa_testing', 'analytics', 'bug_tracking')),
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Vector documents table (for semantic search)
CREATE TABLE vector_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI embedding dimension
    metadata JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations table
CREATE TABLE integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('figma', 'jira', 'confluence', 'notion', 'github', 'gitlab', 'slack', 'discord', 'google_workspace', 'microsoft_365')),
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_project_modules_project_id ON project_modules(project_id);
CREATE INDEX idx_brainstorming_sessions_project_id ON brainstorming_sessions(project_id);
CREATE INDEX idx_ideas_session_id ON ideas(session_id);
CREATE INDEX idx_wireframes_project_id ON wireframes(project_id);
CREATE INDEX idx_bugs_project_id ON bugs(project_id);
CREATE INDEX idx_bugs_assignee_id ON bugs(assignee_id);
CREATE INDEX idx_analytics_events_project_id ON analytics_events(project_id);
CREATE INDEX idx_comments_entity_type_entity_id ON comments(entity_type, entity_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE brainstorming_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE wireframes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wireframe_screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE wireframe_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE figma_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE prds ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_code ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_suites ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can view their own profile and profiles of team members
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Users can access projects they own or are team members of
CREATE POLICY "Users can view own projects" ON projects FOR SELECT 
    USING (auth.uid() = owner_id OR team_id IN (
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create projects" ON projects FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update" ON projects FOR UPDATE 
    USING (auth.uid() = owner_id);

CREATE POLICY "Project owners can delete" ON projects FOR DELETE 
    USING (auth.uid() = owner_id);

-- Project modules: Access based on project access
CREATE POLICY "Users can view project modules" ON project_modules FOR SELECT 
    USING (project_id IN (
        SELECT id FROM projects WHERE auth.uid() = owner_id OR team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    ));

-- Bugs: Users can view bugs in projects they have access to
CREATE POLICY "Users can view bugs" ON bugs FOR SELECT 
    USING (project_id IN (
        SELECT id FROM projects WHERE auth.uid() = owner_id OR team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        )
    ));

-- Comments: Users can view comments on entities they have access to
CREATE POLICY "Users can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT 
    WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE 
    USING (auth.uid() = author_id);

-- Chat sessions: Users can only access their own chat sessions
CREATE POLICY "Users can view own chat sessions" ON chat_sessions FOR SELECT 
    USING (auth.uid() = user_id);
CREATE POLICY "Users can create chat sessions" ON chat_sessions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Chat messages: Users can access messages in their chat sessions
CREATE POLICY "Users can view chat messages" ON chat_messages FOR SELECT 
    USING (session_id IN (
        SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    ));

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_project_modules_updated_at BEFORE UPDATE ON project_modules
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_wireframes_updated_at BEFORE UPDATE ON wireframes
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_prds_updated_at BEFORE UPDATE ON prds
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_bugs_updated_at BEFORE UPDATE ON bugs
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Add more triggers as needed for other tables with updated_at columns 