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
3. Choose **Web application**
4. Add authorized redirect URIs (your worker URL)
5. Copy the **Client ID** and **Client Secret**

### 3. Get Refresh Token
Use the [OAuth Playground](https://developers.google.com/oauthplayground/) or similar tool to get a refresh token with Drive access.

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
