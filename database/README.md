# ProVerse Database Setup

This directory contains the database schema and setup instructions for the ProVerse platform.

## 🗄️ Database Schema Overview

ProVerse uses **Supabase** (PostgreSQL) as the primary database with the following key components:

### Core Tables
- **profiles** - Extended user information (linked to Supabase auth.users)
- **teams** - Team/organization management
- **team_members** - Team membership relationships
- **projects** - Main project entities
- **project_modules** - Individual module instances within projects

### Module-Specific Tables
- **brainstorming_sessions** & **ideas** - Brainstorming module data
- **wireframes**, **wireframe_screens**, **wireframe_components** - Wireframing module
- **figma_files** - Figma integration data
- **prds** & **user_stories** - Product Requirements Documents
- **generated_code** - AI-generated code artifacts
- **test_suites**, **test_cases**, **test_runs** - QA testing module
- **analytics_events** & **user_journeys** - Analytics module
- **bugs** - Bug tracking module

### Supporting Tables
- **file_uploads** - File management
- **comments** - Comments system for all entities
- **meeting_sessions** - Google Meet integration
- **chat_sessions** & **chat_messages** - AI assistant conversations
- **vector_documents** - Semantic search data
- **integrations** - Third-party service configurations

## 🚀 Setup Instructions

### Step 1: Run the Schema

1. **Open Supabase Dashboard**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your ProVerse project

2. **Open SQL Editor**
   - Navigate to **SQL Editor** in the left sidebar
   - Click **"+ New query"**

3. **Execute Schema**
   - Copy the entire contents of `supabase_schema.sql`
   - Paste into the SQL editor
   - Click **"Run"** to execute

### Step 2: Verify Installation

After running the schema, verify the tables were created:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

You should see all the ProVerse tables listed.

### Step 3: Enable Additional Features

#### A. Enable Vector Extension (for semantic search)
```sql
-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;
```

#### B. Configure Storage (for file uploads)
1. Go to **Storage** in Supabase dashboard
2. Create a new bucket called `proverse-files`
3. Set appropriate access policies

#### C. Set up Realtime (for live collaboration)
```sql
-- Enable realtime for collaborative features
BEGIN;
  -- Remove existing publication if it exists
  DROP PUBLICATION IF EXISTS supabase_realtime;
  
  -- Create new publication for realtime tables
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    projects,
    project_modules,
    wireframes,
    wireframe_screens,
    comments,
    chat_messages,
    bugs;
COMMIT;
```

## 🔒 Security & Permissions

### Row Level Security (RLS)
The schema includes comprehensive RLS policies:

- **User Isolation**: Users can only access their own data
- **Team Access**: Team members can access shared project data
- **Project-Based**: Access is scoped to projects users own or are members of
- **Role-Based**: Different permissions for owners, admins, and members

### Key Security Features
- ✅ All sensitive tables have RLS enabled
- ✅ Automatic profile creation on user signup
- ✅ Secure file upload handling
- ✅ Protected API endpoints through RLS
- ✅ Audit trails with created_at/updated_at timestamps

## 📊 Database Relationships

```
auth.users (Supabase)
    ↓
profiles (1:1)
    ↓
teams ← team_members → profiles
    ↓
projects
    ↓
project_modules
    ↓
[Module-specific tables]
```

## 🔄 Data Flow

1. **User Signs Up** → Profile automatically created
2. **User Creates Project** → Project with default modules
3. **User Invites Team** → Team members get project access
4. **Module Usage** → Data stored in module-specific tables
5. **AI Interactions** → Chat sessions and vector documents
6. **File Uploads** → Secure storage with metadata

## 🛠️ Maintenance

### Regular Tasks
- **Backup**: Supabase handles automatic backups
- **Analytics**: Monitor table sizes and query performance
- **Cleanup**: Archive old projects and files
- **Updates**: Apply schema migrations as needed

### Performance Optimization
- Indexes are included for common query patterns
- Consider adding more indexes based on usage patterns
- Monitor slow queries in Supabase dashboard

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   ```sql
   -- Check RLS status
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

2. **Missing Permissions**
   ```sql
   -- Grant necessary permissions
   GRANT USAGE ON SCHEMA public TO authenticated;
   GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
   ```

3. **Profile Creation Issues**
   ```sql
   -- Check if trigger exists
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'on_auth_user_created';
   ```

### Migration from Other Databases
If migrating from another database:
1. Export data in CSV format
2. Use Supabase CSV import feature
3. Update foreign key references
4. Test RLS policies

## 📈 Scaling Considerations

- **Connection Pooling**: Enabled by default in Supabase
- **Read Replicas**: Available in Supabase Pro plans
- **Indexes**: Monitor and add as query patterns emerge
- **Partitioning**: Consider for high-volume tables like analytics_events

## 🔗 Integration Points

The database integrates with:
- **Supabase Auth** - Authentication and user management
- **Supabase Storage** - File uploads and management
- **Supabase Realtime** - Live collaboration features
- **Vector Search** - AI-powered semantic search
- **Third-party APIs** - Figma, JIRA, Google services

---

**Need Help?** Check the [Supabase Documentation](https://supabase.com/docs) or create an issue in the ProVerse repository. 