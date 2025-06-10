# 📧 ProVerse Email Authentication Setup

## 🚨 Issue: "Email not confirmed" Error

You're getting the "Email not confirmed" error because Supabase requires email verification by default. Here are **3 solutions**:

## 🚀 Quick Solution 1: Disable Email Confirmation (Development)

**Best for:** Development and testing

1. **Open Supabase Dashboard**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your ProVerse project

2. **Disable Email Confirmation**
   - Navigate to **Authentication** → **Settings**
   - Find "**Email confirmation**" section
   - **Toggle OFF** "Enable email confirmations"
   - Click **Save**

3. **Test Immediately**
   - Stop your servers (`Ctrl+C`)
   - Restart: `npm run dev`
   - Try signing up again - should work instantly!

---

## 🔧 Solution 2: Use Built-in Supabase SMTP (Recommended)

**Best for:** Production with minimal setup

Supabase provides **100 free emails/hour** using their SMTP service:

1. **Enable Email Confirmations**
   - Go to **Authentication** → **Settings**
   - Enable "**Email confirmation**"
   - Leave **SMTP settings** as default (uses Supabase's service)

2. **Configure Email Templates**
   - In **Authentication** → **Email Templates**
   - Customize the "**Confirm signup**" template
   - Set redirect URL to: `http://localhost:3000/auth/callback`

3. **Test the Flow**
   - Sign up with a real email
   - Check your inbox for confirmation email
   - Click the link to confirm

---

## 🎯 Solution 3: Custom SMTP Provider (Advanced)

**Best for:** High-volume production apps

### Option 3A: Gmail SMTP
```bash
# Add to your .env files
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Not your regular password!
```

### Option 3B: SendGrid
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Option 3C: Mailgun
```bash
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=your_domain
```

**Setup Steps:**
1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Enable "**Enable custom SMTP**"
3. Fill in your provider details
4. Test with "**Send test email**"

---

## 🔄 Current ProVerse Implementation

We've already implemented the email confirmation flow:

### Backend Routes Available:
- `POST /api/auth/register` - Sign up (sends confirmation email)
- `POST /api/auth/login` - Sign in (checks if confirmed)
- `POST /api/auth/confirm` - Confirm email with token
- `POST /api/auth/resend-confirmation` - Resend confirmation email

### Frontend Features:
- ✅ Registration form with validation
- ✅ Login form with error handling
- ✅ Auth callback page for email confirmation
- ✅ Automatic redirect after confirmation

---

## 🛠️ Fix Your Current Issue

### Immediate Fix (Recommended):
1. **Disable email confirmation** in Supabase (Solution 1 above)
2. Your existing users will be able to sign in immediately
3. New users won't need email confirmation

### Alternative Fix:
1. **Keep email confirmation enabled**
2. Ask existing users to check their email for confirmation links
3. Or manually confirm them in Supabase dashboard:
   - Go to **Authentication** → **Users**
   - Find your user → Click **Edit**
   - Set "**Email Confirmed**" to `true`

---

## 🧪 Testing Email Authentication

### Test Email Confirmation Flow:
1. **Enable email confirmation** in Supabase
2. **Set up SMTP** (use Supabase's built-in service)
3. **Configure email template** redirect URL
4. **Test registration:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
   ```
5. **Check email and click confirmation link**
6. **Test login:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

### Test Without Email Confirmation:
1. **Disable email confirmation** in Supabase
2. **Register and login immediately** without email step

---

## 🏷️ Email Templates Customization

In Supabase **Authentication** → **Email Templates**, you can customize:

### Confirmation Email Template:
```html
<h2>Welcome to ProVerse!</h2>
<p>Thanks for signing up. Please confirm your email address.</p>
<a href="{{ .ConfirmationURL }}">Confirm Email</a>
```

### Redirect URLs:
- **Development**: `http://localhost:3000/auth/callback`
- **Production**: `https://your-domain.com/auth/callback`

---

## 🚨 Troubleshooting

### "Email not confirmed" Error:
- ✅ **Solution**: Disable email confirmation in Supabase
- ✅ **Alternative**: Check email and click confirmation link

### Confirmation emails not sending:
- Check SMTP settings in Supabase
- Verify email template configuration
- Test with Supabase's built-in SMTP first

### Confirmation link not working:
- Check redirect URL matches your app
- Verify `/auth/callback` page exists and works
- Check browser console for errors

### Email going to spam:
- Use a custom domain for sending
- Set up SPF/DKIM records
- Use reputable SMTP provider

---

## 🎯 Recommended Setup for ProVerse

For **development**:
1. **Disable email confirmation** for faster testing
2. Enable it later when needed

For **production**:
1. **Enable email confirmation** for security
2. **Use Supabase's built-in SMTP** (100 free emails/hour)
3. **Upgrade to custom SMTP** when you need more volume

---

## 📈 Email Limits & Pricing

### Supabase Built-in SMTP:
- **Free tier**: 100 emails/hour
- **Pro tier**: 10,000 emails/hour
- **Enterprise**: Unlimited

### Custom SMTP Providers:
- **SendGrid**: 100 free emails/day, then $19.95/month
- **Mailgun**: 5,000 free emails/month, then $35/month  
- **Gmail**: Free but limited, use App Passwords

---

## ✅ Quick Action Items

**Right now** (to fix your issue):
1. Go to Supabase → Authentication → Settings
2. **Disable "Email confirmation"**
3. Save changes
4. Restart your servers: `npm run dev`
5. Try signing up again - should work!

**Later** (for production):
1. Re-enable email confirmation
2. Set up proper SMTP
3. Test the full email flow
4. Update email templates with your branding

---

**Need help?** The backend is already set up with all the email confirmation routes. Just toggle the setting in Supabase! 