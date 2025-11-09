# 💕 Love Letters Website - Beginner's Guide

Welcome! This guide will teach you everything you need to know about your romantic love letter website. Don't worry if you've never coded before - I'll explain everything in simple terms!

---

## 📖 Table of Contents
1. [What You've Got](#what-youve-got)
2. [How to See Your Website](#how-to-see-your-website)
3. [How to Use the Website](#how-to-use-the-website)
4. [How to Change Names](#how-to-change-names)
5. [How to Change the Passcode](#how-to-change-the-passcode)
6. [How to Add Letters](#how-to-add-letters)
7. [Understanding Your Files](#understanding-your-files)
8. [Troubleshooting](#troubleshooting)

---

## 🎁 What You've Got

Your website has these pages:

1. **Login Page** - Protects your letters with a passcode
2. **Home Page** - Shows all your letters in a beautiful grid
3. **Letter Page** - Shows each letter with photos and music
4. **Add Letter Page** - Form to write new letters

**Special Features:**
- Floating heart animations ❤️
- Fade-in text effects
- Automatic YouTube music playback
- Beautiful pink and purple colors
- Mobile-friendly design
- Letters saved permanently in the cloud

---

## 👀 How to See Your Website

The website is already running! Look at the preview window in Bolt.new to see it live.

**Default Passcode:** `ourlove2024`

Type this passcode to unlock and see your letters!

---

## 💝 How to Use the Website

### Logging In
1. Open the website
2. Type the passcode: `ourlove2024`
3. Click "Unlock Our Memories"

### Viewing Letters
1. After logging in, you'll see all letters on the home page
2. Click any letter card to read it
3. The letter will show:
   - The full message
   - A photo (if added)
   - YouTube music playing automatically (if added)
   - Floating hearts animation

### Writing a New Letter
1. Click the "Write New Letter" button on the home page
2. Fill in:
   - **Who is writing** - Choose your name
   - **Letter Title** - Example: "Missing You Today"
   - **Your Message** - Write your heartfelt message
   - **Photo URL** (optional) - Paste a link to a photo
   - **YouTube Music URL** (optional) - Paste a YouTube link
3. Click "Send Letter with Love"
4. Your letter appears on the home page!

### Logging Out
- Click the "Logout" button at the top of the home page

---

## ✏️ How to Change Names

Right now, the two users are called "Person 1" and "Person 2". Let's change them to your real names!

### Step 1: Find the Database
Your letters are stored in a database called Supabase. It's already set up and working!

### Step 2: Change the Names
You need to update the names in the database. Here are two ways:

**Option A: Using Supabase Dashboard** (Easiest)
1. Go to your Supabase project dashboard
2. Click on "Table Editor" in the left menu
3. Click on the "users" table
4. You'll see two rows (Person 1 and Person 2)
5. Click on each name and change it to your real names
6. Save the changes

**Option B: Using SQL** (If you're comfortable)
Run this SQL command in your Supabase SQL editor:

```sql
-- Change Person 1 to Alex (replace with your name)
UPDATE users SET name = 'Alex' WHERE name = 'Person 1';

-- Change Person 2 to Jordan (replace with your name)
UPDATE users SET name = 'Jordan' WHERE name = 'Person 2';
```

That's it! The new names will appear on all letters.

---

## 🔐 How to Change the Passcode

To change the secret passcode that protects your letters:

### Step 1: Open the Login File
Find this file: `src/components/Login.tsx`

### Step 2: Find This Line
Look for line 12. It says:
```typescript
if (passcode === 'ourlove2024') {
```

### Step 3: Change the Passcode
Replace `ourlove2024` with your new passcode. For example:
```typescript
if (passcode === 'MyNewPassword123') {
```

**Important:** Keep the quotes around your passcode!

### Step 4: Save
Save the file and your new passcode is active!

---

## 📝 How to Add Letters

### Finding Photos for Your Letters

**Recommended: Use Pexels** (Free beautiful photos)
1. Go to https://www.pexels.com
2. Search for what you want (example: "couple", "sunset", "flowers")
3. Click on a photo you like
4. Right-click the photo → "Copy Image Address"
5. Paste this link in the "Photo URL" field when writing a letter

Example photo link:
```
https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg
```

### Finding Music for Your Letters

**Use YouTube**
1. Go to https://www.youtube.com
2. Search for your favorite song
3. Copy the entire URL from the address bar
4. Paste this link in the "YouTube Music URL" field

Example YouTube link:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Tips:**
- The music will play automatically when someone opens the letter
- Use romantic songs, your favorite songs, or songs with special meaning

---

## 📁 Understanding Your Files

Here's what each file does (in simple terms):

### Main Files You Might Edit

**`src/components/Login.tsx`**
- The login page
- Change the passcode here

**`src/components/HomePage.tsx`**
- The main page showing all letters
- Shows letters in a grid

**`src/components/LetterPage.tsx`**
- Shows individual letters
- Displays the photo and plays music

**`src/components/AddLetterPage.tsx`**
- The form to write new letters

**`src/index.css`**
- All the colors and animations
- The floating hearts are here!

### Files You Probably Won't Need to Touch

**`src/lib/supabase.ts`**
- Connects to the database
- Already set up and working

**`src/App.tsx`**
- Controls which page shows
- Navigation between pages

---

## 🎨 How to Change Colors

Want to change the pink and purple colors?

### Step 1: Open the CSS File
Find this file: `src/index.css`

### Step 2: Change Background Colors
The gradient backgrounds use these colors:
- `from-pink-50` - Light pink
- `via-purple-50` - Light purple
- `to-rose-50` - Light rose

You can change these to:
- Blue: `from-blue-50 via-sky-50 to-cyan-50`
- Green: `from-green-50 via-emerald-50 to-teal-50`
- Neutral: `from-gray-50 via-slate-50 to-zinc-50`

### Step 3: Change Button Colors
Find buttons with `from-pink-400 to-purple-400` and change to your preferred colors.

---

## 🌐 How to Share Your Website

Your website is already online! Here's how to share it:

1. **The website is live** - It's already hosted and accessible
2. **Share the URL** - Give the website link to your partner
3. **Share the passcode** - Tell them the secret passcode to login

**Privacy Note:** Only people with the passcode can see your letters!

---

## ❓ Troubleshooting

### "Wrong passcode" Error
- Make sure you're typing the exact passcode: `ourlove2024`
- It's case-sensitive (lowercase matters)
- No extra spaces before or after

### Letters Not Showing Up
- Check your internet connection
- Refresh the page
- Make sure the database is connected

### Photos Not Appearing
- Make sure the URL is a direct link to an image
- URLs should end with `.jpg`, `.jpeg`, or `.png`
- Try using Pexels photos (always work!)

### Music Not Playing
- Make sure you copied the full YouTube URL
- Check that the URL starts with `https://www.youtube.com/watch?v=`
- Some videos might not allow embedding

### Can't Login After Changing Passcode
- Double-check you changed it correctly in `src/components/Login.tsx`
- Make sure you kept the quotes around the passcode
- Refresh the page

---

## 💡 Quick Tips

1. **Write from the heart** - These letters are special, make them personal!
2. **Add photos** - Pictures make letters more memorable
3. **Use music** - Songs can capture feelings words can't
4. **Write regularly** - Make it a habit to write letters to each other
5. **Be creative** - Use the letters for anniversaries, apologies, or just because!

---

## 🎓 Learning More

Want to customize your website more? Here are beginner-friendly resources:

- **HTML/CSS Basics:** https://www.w3schools.com
- **Tailwind CSS (styling):** https://tailwindcss.com
- **React Basics:** https://react.dev/learn

But remember: Your website is already beautiful and fully functional! You don't need to learn coding to use it.

---

## 💖 Final Words

You now have a beautiful, private space to share love letters with someone special. This website is:

- ✅ Fully functional
- ✅ Secure with a passcode
- ✅ Saves letters permanently
- ✅ Beautiful and romantic
- ✅ Easy to use
- ✅ Mobile-friendly

**Enjoy writing your love letters!** 💕

---

*Made with ❤️ for you and your special someone*
