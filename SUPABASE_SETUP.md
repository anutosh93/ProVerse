# Supabase Authentication Setup

## Issue Resolution: Google Sign-In Loading

The Google sign-in button keeps loading because Supabase authentication is not properly configured. Follow these steps to set it up:

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or sign in to your account
3. Click "New Project"
4. Fill in your project details:
   - Name: `ProVerse`
   - Database Password: (choose a secure password)
   - Region: (select closest to your location)
5. Click "Create new project"
6. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Configure Google OAuth

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** in the list and click to configure
3. Enable Google provider
4. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
   - Application type: **Web application**
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**
5. Back in Supabase, paste the Google Client ID and Client Secret
6. Save the configuration

## Step 4: Set Environment Variables

### Frontend (.env.local)
Create `frontend/.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Backend (.env)
Create `backend/.env` with:
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
FRONTEND_URL=http://localhost:3000
```

## Step 5: Set Up Database Schema

Now you need to create the required database tables for ProVerse. You have two options:

### Option A: Automated Setup (Recommended)
```bash
# Run the database setup script
npm run setup:db
```

This will automatically create all required tables, indexes, and security policies.

### Option B: Manual Setup
1. Open Supabase Dashboard → **SQL Editor**
2. Copy the contents of `database/supabase_schema.sql`
3. Paste into the SQL editor and click **"Run"**

### Post-Setup Configuration
After creating the schema, enable additional features:

1. **Enable Vector Extension** (for AI semantic search):
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Configure Storage** (for file uploads):
   - Go to **Storage** in Supabase dashboard
   - Create bucket: `proverse-files`
   - Set public/private access as needed

3. **Enable Realtime** (for collaboration):
   ```sql
   BEGIN;
     DROP PUBLICATION IF EXISTS supabase_realtime;
     CREATE PUBLICATION supabase_realtime FOR TABLE 
       projects, project_modules, wireframes, 
       wireframe_screens, comments, chat_messages, bugs;
   COMMIT;
   ```

## Step 6: Restart Development Servers

```bash
# Kill existing processes
lsof -ti:3000,3001,3002 | xargs kill -9

# Start development servers
npm run dev
```

## Step 7: Test Google Authentication

1. Go to [http://localhost:3000](http://localhost:3000)
2. Click "Google" sign-in button
3. You should be redirected to Google OAuth
4. After successful authentication, you'll be redirected back to the dashboard

## Database Schema Overview

The ProVerse database includes these key tables:

### Core Tables
- **profiles** - User profiles (extends Supabase auth)
- **teams** & **team_members** - Team management
- **projects** & **project_modules** - Project structure

### Module Tables
- **brainstorming_sessions** & **ideas** - Brainstorming data
- **wireframes** & related tables - Wireframing module
- **figma_files** & **prds** - Figma integration & PRDs
- **generated_code** - AI-generated code
- **test_suites** & **test_cases** - QA testing
- **bugs** - Bug tracking
- **analytics_events** - Usage analytics

### Supporting Tables
- **file_uploads** - File management
- **comments** - Universal commenting system
- **chat_sessions** & **chat_messages** - AI conversations
- **vector_documents** - Semantic search data
- **integrations** - Third-party service configs

## Troubleshooting

### Common Issues:

1. **"Invalid OAuth redirect URI"**
   - Make sure the redirect URI in Google Console matches your Supabase project URL
   - Format: `https://your-project-ref.supabase.co/auth/v1/callback`

2. **"Supabase not configured" error**
   - Check that environment variables are set correctly
   - Restart the development servers after adding environment variables

3. **Database setup fails**
   - Verify you're using the SERVICE_ROLE_KEY (not anon key)
   - Check Supabase project is active and accessible
   - Try manual setup via SQL Editor

4. **Still getting loading state**
   - Open browser developer tools and check for console errors
   - Verify the environment variables are loaded (check Network tab)

5. **Database connection issues**
   - Your Supabase project might still be initializing
   - Wait a few minutes and try again

## Current Status

✅ **Completed**: Updated authentication code to handle missing Supabase configuration gracefully  
✅ **Completed**: Created comprehensive database schema for ProVerse  
⚠️ **Pending**: Supabase project setup and environment variable configuration  
🎯 **Next**: Complete steps above to enable Google authentication and database functionality 