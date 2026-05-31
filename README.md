# 🚀 Enhanced Google Drive Index

[![GitHub stars](https://img.shields.io/github/stars/shohan-001/enhanced-gdrive-index?style=social)](https://github.com/shohan-001/enhanced-gdrive-index/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shohan-001/enhanced-gdrive-index?style=social)](https://github.com/shohan-001/enhanced-gdrive-index/network)
[![GitHub issues](https://img.shields.io/github/issues/shohan-001/enhanced-gdrive-index)](https://github.com/shohan-001/enhanced-gdrive-index/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Powered%20by-Cloudflare%20Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)

A feature-rich Google Drive Index built on **Cloudflare Workers** with dark glassmorphism UI, grid view with thumbnail previews, admin panel, Telegram bot integration, and shared drive support. Based on [Parveen Bhadoo's GDI](https://gitlab.com/GoogleDriveIndex/Google-Drive-Index).

🌐 **Live Demo:** [iswvoid.me](https://iswvoid.me)

![Homepage](screenshots/homepage.png)

---

## ✨ Features

### 🔐 Authentication System
Beautiful animated login page with wave effects and smooth transitions. Supports both light and dark themes with glassmorphism design.

![Login Page](screenshots/login_page.png)

**Login Page Highlights:**
- ⚡ Smooth CSS animations with wave effects
- 🌓 Auto dark/light mode support
- ✨ Glassmorphism card design with blur effects
- 🎭 Animated rotating title text
- 📱 Fully responsive on all devices
- 🔄 Seamless transitions between states

---

### 🛡️ Admin Panel
Full-featured admin dashboard for managing users and monitoring activity.

![Admin Dashboard](screenshots/admin_dashboard.png)

**Dashboard Features:**
- 📊 Real-time statistics (users, downloads, logins)
- ⏳ Pending signup approvals at a glance
- 👥 Complete user management (approve, block, delete)
- 🏷️ Role-based access control (admin/user)

![User Management](screenshots/admin_users.png)

---

### 📋 Activity Logging
Track all user activity with powerful log management tools.

![Activity Logs](screenshots/admin_logs.png)

**Log Features:**
- 🔍 Filter by activity type
- 🗑️ Cleanup tools (delete by age, type, or all)
- 📱 IP and user agent tracking
- ⏰ Timestamp for all activities

---

### 🎨 Dark Glassmorphism UI
Custom dark teal color palette with modern design elements.

![File Browser](screenshots/file_browser.png)

**UI Highlights:**
- 🌙 Dark teal color palette (#0D1F23, #132E35, #2D4A53)
- ✨ Floating particle animations
- 🔮 Glassmorphism cards with blur effects
- 🎯 Smooth hover animations
- 📁 Golden folder icons with glow effects
- 🖼️ Grid/List view toggle with thumbnail previews

---

### 🖼️ Grid View with Thumbnails
Toggle between list and grid views. Grid view shows file thumbnail previews from Google Drive, making it easy to browse image folders without opening each file.

![Grid View](screenshots/grid_view.png)

**Grid View Features:**
- 📸 Real-time thumbnail previews from Google Drive API
- 🔄 Toggle between grid and list views
- 💾 View preference saved to localStorage
- 📱 Responsive grid adapts to all screen sizes
- 📁 Folder icons with golden glow in grid mode
- 🖼️ Supports all file types with thumbnails (images, PDFs, docs, etc.)

---

### 🎬 Media Player
Built-in video and audio player with Plyr integration.

![Video Player](screenshots/video_player.png)

---

### 🔍 Global Search
Search across all configured drives instantly.

![Search Results](screenshots/search_results.png)

---

### 📱 Additional Features

| Feature | Description |
|---------|-------------|
| 📁 Multi-Drive Support | Configure multiple Google Drive folders |
| 💾 KV User Database | Cloudflare KV for persistent user storage |
| 📱 PWA Support | Installable as a Progressive Web App |
| 🔒 Session Management | IP lock and single session options |
| 🔗 Direct Link Protection | Optional protection for download links |
| ⏰ Link Expiry | Configurable file link expiration |

---

### 🤖 Telegram Admin Bot

Control your index directly from Telegram with admin notifications and user management.

| Command | Description |
|---------|-------------|
| `/approve <user>` | Approve pending user |
| `/block <user>` | Block user |
| `/pending` | List pending signups with approve/block buttons |
| `/loginnotify` | Toggle login notifications |
| `/logs` | Show recent activity logs |
| `/logs_type <type>` | Filter logs by type |
| `/logs_delete_old <days>` | Delete logs older than N days |
| `/logs_delete_type <type>` | Delete logs by type |
| `/logs_delete_all` | Delete all logs |

**Features:**
- 🔔 Instant notifications for new signups
- ✅ Approve/Block users with inline keyboard buttons
- 📊 View activity logs from Telegram
- 🔐 Optional login notifications

---

## 🚀 Quick Start

### Prerequisites
- Cloudflare account with Workers enabled
- Google Cloud Console project with Drive API enabled
- Cloudflare KV namespace (for user management)

### Deployment Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Copy and configure**
   ```bash
   cp worker.example.js worker.js
   ```

3. **Edit `worker.js`** with your credentials (see [Configuration Guide](CONFIGURATION.md))

4. **Deploy to Cloudflare Workers**
   - Go to [Cloudflare Workers Dashboard](https://dash.cloudflare.com/)
   - Create a new Worker
   - Paste your configured `worker.js` content
   - Bind your KV namespace as `ENV`

5. **Set up the first admin user** via KV:
   ```json
   KEY: USER:yourusername
   VALUE: {"username":"yourusername","password":"yourpassword","status":"approved","roles":["admin","user"],"created_at":1234567890}
   ```

---

## ⚙️ Configuration

See [CONFIGURATION.md](CONFIGURATION.md) for detailed setup instructions including:
- Google Cloud Console setup
- OAuth 2.0 credentials
- Drive folder IDs
- Crypto key generation
- KV namespace setup

---

## 🗺️ Roadmap

Planned features for future releases:

### 🔐 Authentication & Security
- [ ] Two-Factor Authentication (2FA)
- [ ] Password reset via email
- [ ] OAuth login (Google/GitHub)
- [ ] Rate limiting for brute force protection
- [ ] Session history for users

### 📊 Admin Panel Improvements
- [ ] Analytics dashboard with charts
- [ ] User activity graphs
- [ ] Export logs as CSV/JSON
- [ ] Bulk user actions
- [x] Telegram notifications on new signups

### 📁 File Management
- [x] File upload to Google Drive
- [ ] Create folders from UI
- [ ] Shareable links with expiry
- [ ] Favorites/Bookmarks
- [ ] Recent files history

### 🎨 UI/UX Enhancements
- [ ] Light/Dark theme toggle
- [ ] Custom color themes
- [x] Grid/List view toggle with thumbnail previews
- [ ] Keyboard shortcuts
- [x] Drag & drop upload

### 🔧 Technical
- [ ] Cloudflare R2 caching
- [x] Image/video thumbnails via Google Drive API
- [ ] More file type previews
- [ ] REST API endpoints

---

## 🙏 Credits

- Original Project: [Google Drive Index](https://gitlab.com/GoogleDriveIndex/Google-Drive-Index) by Parveen Bhadoo
- UI Framework: Bootstrap 5 with Bootswatch themes
- Media Player: [Plyr](https://plyr.io/)
- Icons: Bootstrap Icons

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Copy `worker.example.js` to `worker.js` and add your credentials
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

<p align="center">
  Made with ❤️ | Powered by Cloudflare Workers
</p>
