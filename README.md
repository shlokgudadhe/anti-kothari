# anti-kothari

A private, Google-authenticated expense-sharing app for a friend group. It runs on Vercel and stores persistent data in Supabase Postgres. Set `NEXT_PUBLIC_APP_NAME` to change the displayed app name.

## What it includes

- Google sign-in
- Bootstrap admins defined by `ADMIN_EMAILS`; admins can approve, remove, promote, and demote people
- Private groups and group membership
- Equal-split expenses, an activity feed, per-user net balance, and recorded settlements
- Database-enforced access controls (RLS)

## Deploy

1. Create a Supabase project and run [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql) in its SQL Editor.
2. In **Authentication → Providers → Google**, enable Google. Create Google OAuth credentials, then add Supabase's callback URL shown in that provider screen to the Google Cloud Console.
3. Set the Site URL in **Authentication → URL Configuration** to your production Vercel URL. Add `http://localhost:3000/auth/callback` and `https://YOUR-APP.vercel.app/auth/callback` to Redirect URLs.
4. Create `.env.local` from `.env.example`. Add the Supabase URL, publishable/anon key, service-role key, `ADMIN_EMAILS`, and `NEXT_PUBLIC_SITE_URL`.
5. Push this repository to GitHub, import it in Vercel, and add the same environment variables under **Settings → Environment Variables**. Deploy.

`SUPABASE_SERVICE_ROLE_KEY` is used only in server actions and is never exposed to the browser. Keep it secret.

## Local development

```bash
npm install
npm run dev
```

## Practical next upgrades

- Custom, percentage, share-based, and itemized expense splits
- Expense editing/deletion with an immutable audit history
- Settlement suggestions that minimize the number of transfers
- Receipt uploads and OCR-assisted expense entry
- Push/email reminders and UPI deep links
