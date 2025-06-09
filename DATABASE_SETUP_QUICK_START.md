# 🚀 ProVerse Database Quick Setup

Since you have Supabase and Google OAuth credentials configured, here's how to set up the database tables:

## ⚡ Quick Setup (2 minutes)

### 1. Add Backend Environment Variables
Make sure your `backend/.env` includes the SERVICE_ROLE_KEY:
```bash
# Backend: backend/.env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
FRONTEND_URL=http://localhost:3000
```

### 2. Run Database Setup
```bash
npm run setup:db
```

### 3. Enable Vector Search (Optional)
In Supabase SQL Editor, run:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4. Test Authentication
```bash
npm run dev
```
Go to http://localhost:3000 and try Google sign-in!

## 📋 What Gets Created

The automated setup creates **25+ tables** including:

### Core Tables
- `profiles` - User data
- `projects` - Main projects
- `project_modules` - Module instances
- `teams` & `team_members` - Team management

### Feature Tables  
- `brainstorming_sessions` & `ideas`
- `wireframes` & `wireframe_screens`
- `figma_files` & `prds`
- `generated_code` & `test_suites`
- `bugs` & `analytics_events`
- `chat_sessions` & `chat_messages`
- `file_uploads` & `comments`

### Security Features
- ✅ Row Level Security (RLS) enabled
- ✅ Automatic profile creation on signup
- ✅ Team-based access control
- ✅ Audit trails with timestamps

## 🔍 Manual Setup (Alternative)

If the automated script doesn't work:

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor**
3. Copy contents of `database/supabase_schema.sql`
4. Paste and click **"Run"**

## ✅ Verification

After setup, test that everything works:

1. **Sign up a new user** - Profile should be created automatically
2. **Check tables** - Go to Supabase → Database → Tables
3. **Test authentication** - Google sign-in should work
4. **Create a project** - Should save to database

## 🐛 Troubleshooting

**Setup script fails?**
- Make sure you're using `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
- Check your Supabase project is active

**Tables not created?**
- Use manual setup method above
- Check Supabase logs for errors

**Authentication still not working?**
- Verify environment variables are loaded
- Restart development servers
- Check browser console for errors

## 🎯 Next Steps

Once database is set up:
1. Test user registration/login
2. Create your first project
3. Explore the ProVerse modules
4. Set up file storage bucket (optional)
5. Configure integrations (Figma, JIRA, etc.)

---

**Need help?** Check `SUPABASE_SETUP.md` for detailed instructions or `database/README.md` for technical details. 