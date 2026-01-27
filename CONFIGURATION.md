# ⚙️ Configuration Guide

This guide will help you set up your own instance of the Enhanced Google Drive Index.

---

## 🔑 Google Cloud Console Setup

### 1. Create a Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Drive API**

### 2. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - Choose **External** user type
   - Fill in the required app information
   - Add your email to test users
4. Choose **Desktop app** as the application type
5. Give it a name (e.g., "GDrive Index")
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

> **Note:** Desktop app type is simpler and works perfectly with Cloudflare Workers. No redirect URIs are needed!

### 3. Get Refresh Token (Using Rclone)

The easiest way to get a refresh token is using **rclone**. Here's how:

#### Step 1: Download Rclone
1. Go to [rclone.org/downloads](https://rclone.org/downloads/)
2. Download the appropriate version for your OS
3. Extract the zip file to a folder (e.g., `C:\rclone`)

#### Step 2: Open Command Prompt
1. Press `Win + R`, type `cmd`, and press Enter
2. Navigate to the rclone folder:
   ```
   cd C:\rclone
   ```

#### Step 3: Run Rclone Config
1. Run the configuration command:
   ```
   rclone config
   ```

2. Follow the prompts:
   ```
   n) New remote
   ```
   Type `n` and press Enter

3. Enter a name for this remote (e.g., `gdrive`) and press Enter

4. When asked for storage type, find **Google Drive** and enter its number (usually `17` or search for `drive`)

5. **Client ID:** Paste your OAuth Client ID from Google Cloud Console

6. **Client Secret:** Paste your OAuth Client Secret

7. **Scope:** Choose `1` for full access (drive)

8. **Service Account:** Leave blank (just press Enter)

9. **Advanced Config:** Type `n` (no)

10. **Auto Config:** Type `y` (yes) - this will open your browser

11. Sign in with your Google account and authorize the app

12. **Configure as team drive:** Type `n` (no) unless you're using a Shared Drive

13. **Confirm:** Type `y` to confirm

#### Step 4: Get Your Refresh Token
1. After configuration, run:
   ```
   rclone config file
   ```

2. This shows the config file location. Open that file in a text editor

3. Find your remote section and copy the `refresh_token` value:
   ```ini
   [gdrive]
   type = drive
   client_id = YOUR_CLIENT_ID
   client_secret = YOUR_CLIENT_SECRET
   token = {"access_token":"...","token_type":"Bearer","refresh_token":"YOUR_REFRESH_TOKEN_HERE","expiry":"..."}
   ```

4. The `refresh_token` inside the `token` JSON is what you need!

> **Tip:** You can also view your config directly by running: `rclone config show`

---

## 📝 Configuration Variables

Edit these values in `worker.js`:

### Authentication Config (`authConfig`)

```javascript
const authConfig = {
    "siteName": "Your Site Name",
    "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
    "client_secret": "YOUR_CLIENT_SECRET",
    "refresh_token": "YOUR_REFRESH_TOKEN",
    // ... other settings
};
```

| Setting | Description |
|---------|-------------|
| `siteName` | Display name for your site |
| `client_id` | Google OAuth Client ID |
| `client_secret` | Google OAuth Client Secret |
| `refresh_token` | OAuth refresh token with Drive access |
| `enable_login` | Enable login system (true/false) |
| `enable_signup` | Allow new signups (true/false) |
| `login_days` | Session duration in days |

### Drive Folders (`roots`)

```javascript
"roots": [
    {
        "id": "FOLDER_ID_FROM_DRIVE_URL",
        "name": "📁 Folder Name",
        "username": "", // Optional folder-level auth
        "password": "",
        "protect_file_link": false
    },
    // Add more folders...
]
```

**How to get Folder ID:**
1. Open the folder in Google Drive
2. Copy the ID from the URL: `https://drive.google.com/drive/folders/THIS_IS_THE_ID`

---

## 🔐 Crypto Keys

The following keys are used for session encryption. You can keep the defaults or generate your own.

```javascript
const crypto_base_key = "3225f86e99e205347b4310e437253bfd"
const hmac_base_key = "4d1fbf294186b82d74fff2494c04012364200263d6a36123db0bd08d6be1423c"
const encrypt_iv = new Uint8Array([247, 254, 106, 195, 32, 148, 131, 244, 222, 133, 26, 182, 20, 138, 215, 81])
```

### Generating New Keys (Optional)

If you want to generate your own keys for extra security:

**Option 1: Using Node.js**
```javascript
// Generate 256-bit key (32 bytes = 64 hex chars)
const crypto = require('crypto');

// For crypto_base_key (32 hex chars = 128 bits, or use 64 for 256 bits)
console.log('crypto_base_key:', crypto.randomBytes(16).toString('hex'));

// For hmac_base_key (64 hex chars = 256 bits)
console.log('hmac_base_key:', crypto.randomBytes(32).toString('hex'));

// For encrypt_iv (16 bytes)
const iv = crypto.randomBytes(16);
console.log('encrypt_iv:', `new Uint8Array([${Array.from(iv).join(', ')}])`);
```

**Option 2: Using browser console**
```javascript
// Generate crypto_base_key
console.log(Array.from(crypto.getRandomValues(new Uint8Array(16)))
  .map(b => b.toString(16).padStart(2, '0')).join(''));

// Generate hmac_base_key
console.log(Array.from(crypto.getRandomValues(new Uint8Array(32)))
  .map(b => b.toString(16).padStart(2, '0')).join(''));

// Generate encrypt_iv
console.log('new Uint8Array([' + Array.from(crypto.getRandomValues(new Uint8Array(16))).join(', ') + '])');
```

**Option 3: Online generators**
- Use any secure random hex generator
- crypto_base_key: 32 hex characters
- hmac_base_key: 64 hex characters
- encrypt_iv: 16 random bytes (0-255)

---

## 💾 Cloudflare KV Setup

### 1. Create KV Namespace
1. Go to Cloudflare Dashboard → Workers → KV
2. Create a namespace (e.g., `GDI_USERS`)
3. Note the namespace ID

### 2. Bind to Worker
In your Worker settings, add a KV Namespace binding:
- Variable name: `ENV`
- KV Namespace: Select your namespace

### 3. Create Admin User
Add this key-value pair to your KV namespace:

**Key:** `USER:admin`

**Value:**
```json
{
  "username": "admin",
  "password": "your_secure_password",
  "status": "approved",
  "roles": ["admin", "user"],
  "created_at": 1702900000000
}
```

---

## 🎨 UI Customization (`uiConfig`)

```javascript
const uiConfig = {
    "theme": "darkly",           // Bootswatch theme
    "favicon": "URL_TO_FAVICON",
    "logo_link_name": "URL_TO_LOGO",
    "login_image": "URL_TO_LOGIN_BG",
    "contact_link": "YOUR_CONTACT_URL",
    "company_name": "Your Company",
    "copyright_year": "2025",
    // ... more options
};
```

---

## 🚫 Blocked Regions/ASN

```javascript
const blocked_region = ['XX', 'YY'];  // ISO country codes
const blocked_asn = [12345, 67890];   // ASN numbers
```

---

## 🤖 Telegram Bot Setup (Optional)

The Telegram bot allows you to manage users and receive notifications directly from Telegram.

### 1. Create Bot via BotFather

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow prompts to create your bot
3. Save your **Bot Token** (looks like `123456789:AABBcc...`)
4. Send `/setcommands` to BotFather, select your bot, then paste:

```
approve - Approve pending user
block - Block user
pending - List pending signups
loginnotify - Toggle login notifications
logs - Show recent activity logs
logs_type - Filter logs by type
logs_delete_old - Delete old logs by age
logs_delete_type - Delete logs by type
logs_delete_all - Delete all logs
```

### 2. Get Your Chat ID

1. Send any message to your new bot
2. Open this URL in browser (replace `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
3. Find `"chat":{"id":123456789}` - this number is your `TO_ID`

### 3. Set Environment Variables

In Cloudflare Worker settings → Variables:
- **`BOT_TOKEN`**: Your bot token from BotFather
- **`TO_ID`**: Your Telegram chat ID (from step 2)

> ⚠️ **Important**: Add these as encrypted secrets, not plain text variables.

### 4. Set Webhook

After deploying your worker, set the webhook by opening this URL once:

```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://YOUR_WORKER_DOMAIN/telegram
```

Replace:
- `<BOT_TOKEN>` with your bot token
- `YOUR_WORKER_DOMAIN` with your Cloudflare Worker domain

### 5. Verify Connection

Send `/pending` to your bot - you should get a response!

---

## ✅ Deployment Checklist

- [ ] Google Cloud project created
- [ ] Drive API enabled
- [ ] OAuth credentials generated
- [ ] Refresh token obtained
- [ ] Folder IDs collected
- [ ] KV namespace created
- [ ] Admin user added to KV
- [ ] Worker deployed
- [ ] KV binding configured
- [ ] Test login working
- [ ] (Optional) Telegram bot configured
- [ ] (Optional) Webhook set for Telegram

