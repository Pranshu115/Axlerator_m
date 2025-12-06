# 🌱 How to Seed Your Supabase Database

## Problem

Your website looks empty because the Supabase database has no truck data yet. We migrated the code but need to add the data.

## Solution

I've created a script to populate your Supabase database with all the truck data.

---

## Step 1: Run the Seed Script

**Option A: Using Node.js (Recommended)**

```bash
node scripts/seed-supabase.js
```

**Option B: Using npm script (if added to package.json)**

```bash
npm run seed:supabase
```

---

## Step 2: Verify Data in Supabase

1. Go to your Supabase Dashboard
2. Click **"Table Editor"** (left sidebar)
3. Click on **"trucks"** table
4. You should see 12 trucks listed

---

## What the Script Does

- ✅ Connects to your Supabase database
- ✅ Inserts 12 trucks with all details (images, prices, specs)
- ✅ Uses your existing `.env.local` credentials
- ✅ Shows progress and results

---

## If You Get Errors

### Error: "Table does not exist"
**Solution:** Run the SQL migration first:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the content from `COPY_THIS_SQL.sql`
3. Click "Run"
4. Then run the seed script again

### Error: "Credentials not found"
**Solution:** Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Error: "Trucks already exist"
**Solution:** 
- If you want to keep existing data, skip seeding
- If you want to reseed, delete trucks in Supabase dashboard first

---

## After Seeding

1. **Refresh your website** - You should now see all trucks!
2. **Check the homepage** - Certified trucks section should be populated
3. **Check browse page** - All trucks should be visible

---

## Quick Command

Just run this in your terminal:

```bash
node scripts/seed-supabase.js
```

That's it! Your website will be back to normal with all the trucks showing! 🚀

