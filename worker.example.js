// Software: GDI-JS
// Version: 2.3.7 - Enhanced with Admin Panel and KV User/Activity Management
// Author: Parveen Bhadoo & Gemini
// Website: https://gdi.js.org

// add multiple serviceaccounts as {}, {}, {}, random account will be selected by each time app is opened.

const environment = 'production'; // This Variable Decides the environment of the app. 'production' or 'development' or 'local'

const serviceaccounts = [];
const randomserviceaccount = serviceaccounts[Math.floor(Math.random() * serviceaccounts.length)]; // DO NOT TOUCH THIS
const domains_for_dl = [''] // add multiple cloudflare addresses to balance the load on download/stream servers, eg. ['https://testing.fetchgoogleapi.workers.dev', 'https://testing2.fetchgoogleapi2.workers.dev']
const domain_for_dl = domains_for_dl[Math.floor(Math.random() * domains_for_dl.length)]; // DO NOT TOUCH THIS
const blocked_region = ['']; // add regional codes seperated by comma, eg. ['IN', 'US', 'PK']
const blocked_asn = []; // add ASN numbers from http://www.bgplookingglass.com/list-of-autonomous-system-numbers, eg. [16509, 12345]

// --- KV DATABASE CONFIGURATION ---
const USER_PREFIX = 'USER:';
const LOG_PREFIX = 'LOG:';
const ADMIN_KEY = 'ADMIN_USERS';

const authConfig = {
    "siteName": "YOUR_SITE_NAME", // Website name
    "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com", // Client id from Google Cloud Console
    "client_secret": "YOUR_CLIENT_SECRET", // Client Secret from Google Cloud Console
    "refresh_token": "YOUR_REFRESH_TOKEN", // Authorize token - Get from OAuth Playground
    "service_account": false, // true if you're using Service Account instead of user account
    "service_account_json": randomserviceaccount, // don't touch this one
    "files_list_page_size": 100,
    "search_result_list_page_size": 100,
    "enable_cors_file_down": false,
    "enable_password_file_verify": true, // support for .password file not working right now
    "direct_link_protection": false, // protects direct links with Display UI
    "disable_anonymous_download": false, // disables direct links without session
    "file_link_expiry": 365, // expire file link in set number of days
    "search_all_drives": true, // search all of your drives instead of current drive if set to true
    "enable_login": true, // set to true if you want to add login system
    "enable_signup": true, // set to true if you want to add signup system
    "enable_social_login": false, // set to true if you want to add social login system
    "google_client_id_for_login": "", // Google Client ID for Login
    "google_client_secret_for_login": "", // Google Client Secret for Login
    "redirect_domain": "", // Domain for login redirect eg. https://example.com
    "login_database": "KV", // HARDCODED TO KV for new features
    "login_days": 3, // days to keep logged in
    "enable_ip_lock": false, // set to true if you want to lock user downloads to user IP
    "single_session": false, // set to true if you want to allow only one session per user
    "ip_changed_action": false, // set to true if you want to logout user if IP changed

    // --- Add folder IDs here to exclude them from search results ---
    "excluded_from_search": [
        // "FOLDER_ID_TO_EXCLUDE" // Example: This will hide folders from search
    ],

    // NOTE: Local users_list is ignored when login_database is "KV"
    // When using KV, manage users via admin panel instead
    "users_list": [
        // { "username": "example_user", "password": "secure_password" },
    ],
    "roots": [
        {
            "id": "YOUR_FOLDER_ID_1", // Get from Google Drive folder URL
            "name": "📁 Folder 1",
            "username": "", "password": "", // Optional folder-level auth
            "protect_file_link": false
        },
        {
            "id": "YOUR_FOLDER_ID_2",
            "name": "📁 Folder 2",
            "protect_file_link": false
        },
        // Add more folders as needed...
    ]
};
const crypto_base_key = "3225f86e99e205347b4310e437253bfd" // Example 256 bit key used, generate your own.
const hmac_base_key = "4d1fbf294186b82d74fff2494c04012364200263d6a36123db0bd08d6be1423c" // Example 256 bit key used, generate your own.
const encrypt_iv = new Uint8Array([247, 254, 106, 195, 32, 148, 131, 244, 222, 133, 26, 182, 20, 138, 215, 81]); // Example 128 bit IV used, generate your own.
const uiConfig = {
    "theme": "darkly", // switch between themes, default set to slate, select from https://gitlab.com/GoogleDriveIndex/Google-Drive-Index
    "version": "2.3.7", // don't touch this one. get latest code using generator at https://bdi-generator.hashhackers.com
    "logo_image": true,
    "logo_height": "50px",
    "logo_width": "auto",
    "favicon": "https://cdn.jsdelivr.net/npm/@googledrive/index@2.2.3/images/favicon.ico",
    "logo_link_name": "https://cdn.jsdelivr.net/gh/shohan-001/Gdrive-Index@93879490cc17773db86f235553e0346356db0b2a/IndexPageLogo.png",
    "login_image": "https://files.catbox.moe/li4oys.jpg",
    "fixed_header": true,
    "header_padding": "80",
    "nav_link_1": "Home",
    "nav_link_3": "Current Path",
    "nav_link_4": "Contact",
    "fixed_footer": true,
    "hide_footer": false,
    "header_style_class": "navbar-dark bg-dark",
    "footer_style_class": "bg-dark",
    "css_a_tag_color": "white",
    "css_p_tag_color": "white",
    "folder_text_color": "white",
    "loading_spinner_class": "text-light",
    "search_button_class": "btn btn-info",
    "path_nav_alert_class": "alert alert-primary",
    "file_view_alert_class": "alert alert-danger",
    "file_count_alert_class": "alert alert-secondary",
    "contact_link": "YOUR_CONTACT_LINK", // e.g., Telegram, email, etc.
    "copyright_year": "2025",
    "company_name": "YOUR_COMPANY_NAME",
    "company_link": "YOUR_COMPANY_URL",
    "credit": false,
    "display_size": true,
    "display_time": false,
    "display_download": true,
    "disable_player": false,
    "disable_video_download": false,
    "allow_selecting_files": true,
    "second_domain_for_dl": false,
    "poster": "https://cdn.jsdelivr.net/npm/@googledrive/index@2.2.3/images/poster.jpg",
    "audioposter": "https://cdn.jsdelivr.net/npm/@googledrive/index@2.2.3/images/music.jpg",
    "jsdelivr_cdn_src": "https://cdn.jsdelivr.net/npm/@googledrive/index",
    "render_head_md": true,
    "render_readme_md": true,
    "unauthorized_owner_link": "https://telegram.dog/Telegram",
    "unauthorized_owner_email": "abuse@telegram.org",
    "downloaddomain": domain_for_dl,
    "show_logout_button": authConfig.enable_login ? true : false,
};

const player_config = {
    "player": "plyr",
    "videojs_version": "8.3.0",
    "plyr_io_version": "3.7.8",
    "jwplayer_version": "8.16.2"
}

// DON'T TOUCH BELOW THIS UNLESS YOU KNOW WHAT YOU'RE DOING
var gds = [];
const drive_list = authConfig.roots.map(it => it.id)
let app_js_file
if (environment === 'production') {
    app_js_file = uiConfig.jsdelivr_cdn_src + '@' + uiConfig.version + '/src/app.min.js'
} else if (environment === 'development') {
    app_js_file = '/app.js'
} else if (environment === 'local') {
    app_js_file = 'http://127.0.0.1:5500/src/app.js'
}

// --- KV HELPER FUNCTIONS ---

/**
 * Retrieves a user object from KV.
 * @param {string} username 
 * @returns {Promise<object | null>}
 */
async function getKVUser(username) {
    try {
        const userJson = await ENV.get(USER_PREFIX + username, 'json');
        return userJson;
    } catch (e) {
        console.error("KV Read Error:", e);
        return null;
    }
}

/**
 * Saves or updates a user object in KV.
 * @param {string} username 
 * @param {object} userData 
 * @returns {Promise<void>}
 */
async function setKVUser(username, userData) {
    try {
        await ENV.put(USER_PREFIX + username, JSON.stringify(userData));
    } catch (e) {
        console.error("KV Write Error:", e);
    }
}

/**
 * Logs activity to KV with a timestamp prefix for easy listing.
 * @param {string} type - e.g., 'LOGIN_SUCCESS', 'SIGNUP_PENDING', 'FILE_DOWNLOAD'
 * @param {string} username 
 * @param {object} request 
 * @param {object} details 
 * @returns {Promise<void>}
 */
async function logActivity(type, username, request, details = {}) {
    try {
        const timestamp = Date.now();
        // Unique key: LOG:<timestamp>:<random_suffix>
        const key = `${LOG_PREFIX}${timestamp}:${Math.random().toString(36).substring(2, 8)}`;
        const logEntry = {
            timestamp,
            type,
            user: username,
            ip: request.headers.get("CF-Connecting-IP") || 'unknown',
            userAgent: request.headers.get("User-Agent") || 'unknown',
            details,
        };
        // Logs are write-heavy, use put
        await ENV.put(key, JSON.stringify(logEntry));
    } catch (e) {
        console.error("KV Logging Error:", e);
    }
}

/**
 * Checks if a user has the admin role.
 * For simplicity, we check a specific user key set on deployment.
 * @param {string} username 
 * @returns {Promise<boolean>}
 */
async function isAdmin(username) {
    if (!username) return false;
    const user = await getKVUser(username);
    return user && user.roles && user.roles.includes('admin');
}

/**
 * Deletes activity logs older than specified days
 */
async function deleteOldLogs(daysOld = 30) {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    let cursor = null;
    let listComplete = false;
    let deletedCount = 0;

    try {
        while (!listComplete) {
            const listResponse = await ENV.list({ prefix: LOG_PREFIX, cursor: cursor, limit: 1000 });
            listComplete = listResponse.list_complete;
            cursor = listResponse.cursor;

            const deletePromises = [];

            for (const key of listResponse.keys) {
                const keyParts = key.name.split(':');
                if (keyParts.length >= 2) {
                    const timestamp = parseInt(keyParts[1]);
                    if (timestamp < cutoffTime) {
                        deletePromises.push(ENV.delete(key.name));
                        deletedCount++;
                    }
                }

                if (deletePromises.length >= 100) {
                    await Promise.all(deletePromises);
                    deletePromises.length = 0;
                }
            }

            if (deletePromises.length > 0) {
                await Promise.all(deletePromises);
            }
        }

        return deletedCount;
    } catch (error) {
        console.error("Error deleting old logs:", error);
        throw error;
    }
}

/**
* Deletes logs by specific type
*/
async function deleteLogsByType(logType) {
    let cursor = null;
    let listComplete = false;
    let deletedCount = 0;

    try {
        while (!listComplete) {
            const listResponse = await ENV.list({ prefix: LOG_PREFIX, cursor: cursor, limit: 1000 });
            listComplete = listResponse.list_complete;
            cursor = listResponse.cursor;

            const deletePromises = [];
            const keyPromises = listResponse.keys.map(key =>
                ENV.get(key.name, 'json').then(log => ({ key: key.name, log }))
            );
            const keyLogs = await Promise.all(keyPromises);

            for (const { key, log } of keyLogs) {
                if (log && log.type === logType) {
                    deletePromises.push(ENV.delete(key));
                    deletedCount++;
                }

                if (deletePromises.length >= 100) {
                    await Promise.all(deletePromises);
                    deletePromises.length = 0;
                }
            }

            if (deletePromises.length > 0) {
                await Promise.all(deletePromises);
            }
        }

        return deletedCount;
    } catch (error) {
        console.error("Error deleting logs by type:", error);
        throw error;
    }
}

// --- CORE HTML TEMPLATES ---

function html(current_drive_order = 0, model = {}) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <title>${authConfig.siteName}</title>
  <meta name="robots" content="noindex" />
  <link rel="icon" href="${uiConfig.favicon}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* Dark Glassmorphism Theme - Matching Homepage Palette */
    :root {
      /* Dark Teal Palette */
      --darkest-bg: #0D1F23;
      --dark-teal: #132E35;
      --muted-blue: #2D4A53;
      --dusty-blue: #69818D;
      --light-gray-blue: #AFB3B7;
      --slate-gray: #5A636A;
      
      /* Semantic Colors */
      --bg-primary: var(--darkest-bg);
      --bg-secondary: var(--dark-teal);
      --bg-tertiary: #1A3F48;
      --glass-bg: rgba(19, 46, 53, 0.7);
      --glass-border: rgba(105, 129, 141, 0.2);
      --text-primary: var(--light-gray-blue);
      --text-secondary: var(--dusty-blue);
      --accent-main: var(--muted-blue);
      --accent-light: var(--dusty-blue);
      --shadow-color: rgba(45, 74, 83, 0.4);
      --shadow-glow: 0 0 40px var(--shadow-color);
      --hover-bg: rgba(45, 74, 83, 0.8);
      --folder-color: #fce300;
      --file-icon-color: var(--slate-gray);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      min-height: 100vh;
      color: var(--text-primary);
      position: relative;
      overflow-x: hidden;
      padding-bottom: 100px;
      -webkit-font-smoothing: antialiased;
    }

    /* Animated Background - Matching Homepage */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(ellipse at 10% 20%, rgba(45, 74, 83, 0.2) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(20, 50, 60, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(105, 129, 141, 0.15) 0%, transparent 50%);
      animation: backgroundShift 20s ease infinite;
      z-index: 0;
      pointer-events: none;
    }

    @keyframes backgroundShift {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
      50% { transform: translate(50px, -50px) scale(1.1); opacity: 0.8; }
    }

    /* Floating Particles */
    .particles {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--accent-light);
      border-radius: 50%;
      opacity: 0.3;
      animation: float 15s infinite ease-in-out;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); }
      33% { transform: translateY(-100px) translateX(50px); }
      66% { transform: translateY(-50px) translateX(-50px); }
    }

    /* Glassmorphism Navbar - Matching Homepage */
    .navbar {
      background: rgba(19, 46, 53, 0.7) !important;
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      border-bottom: 1px solid var(--glass-border);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      padding: 0.75rem 0;
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .navbar.scrolled {
      background: rgba(19, 46, 53, 0.95) !important;
      box-shadow: var(--shadow-glow);
    }

    .navbar-brand {
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--text-primary) !important;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: transform 0.3s ease;
    }

    .navbar-brand:hover {
      transform: scale(1.05);
    }

    .navbar-brand img {
      height: 42px;
      width: auto;
      filter: drop-shadow(0 2px 8px rgba(105, 129, 141, 0.4));
      transition: all 0.3s ease;
      animation: logoFloat 3s ease-in-out infinite;
    }

    @keyframes logoFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    .navbar-brand:hover img {
      filter: drop-shadow(0 4px 12px rgba(105, 129, 141, 0.6));
      transform: rotate(-5deg);
    }

    .navbar-brand span {
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: titleShine 3s ease-in-out infinite;
    }

    @keyframes titleShine {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.2); }
    }

    .nav-link {
      color: var(--text-secondary) !important;
      font-weight: 500;
      padding: 0.5rem 1rem !important;
      margin: 0 0.25rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(105, 129, 141, 0.15), transparent);
      transition: left 0.5s ease;
    }

    .nav-link:hover::before {
      left: 100%;
    }

    .nav-link:hover {
      color: var(--text-primary) !important;
      background: rgba(105, 129, 141, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 0 20px var(--shadow-color);
    }

    /* Search Bar - Matching Homepage Style */
    .form-control {
      background: var(--glass-bg) !important;
      border: 1px solid var(--glass-border) !important;
      border-radius: 50px !important;
      color: var(--text-primary) !important;
      padding: 0.5rem 1rem !important;
      font-size: 0.9rem;
      height: 2.5rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .form-control::placeholder {
      color: var(--slate-gray);
    }

    .form-control:focus {
      background: rgba(19, 46, 53, 0.8) !important;
      border-color: var(--accent-main) !important;
      box-shadow: 0 0 40px var(--shadow-color) !important;
      color: var(--text-primary) !important;
      transform: translateY(-2px);
    }

    /* Buttons - Matching Homepage Style */
    .btn {
      border-radius: 0.75rem;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      padding: 0.75rem 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s ease, height 0.6s ease;
    }

    .btn:hover::before {
      width: 300px;
      height: 300px;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px var(--shadow-color);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent-main), var(--accent-light));
      color: var(--text-primary);
    }

    .btn-info {
      background: linear-gradient(135deg, var(--accent-main), var(--accent-light)) !important;
      color: var(--text-primary) !important;
      border-radius: 50px !important;
      padding: 0.5rem 1.2rem !important;
      font-size: 0.9rem;
    }

    .btn-success {
      background: linear-gradient(135deg, #37a86e 0%, #69818D 100%);
      color: white;
    }

    .btn-warning {
      background: linear-gradient(135deg, #FFD700 0%, #69818D 100%);
      color: var(--darkest-bg);
    }

    .btn-danger {
      background: linear-gradient(135deg, #ff6b6b 0%, #D80032 100%);
      color: white;
    }

    .btn-secondary {
      background: rgba(105, 129, 141, 0.2);
      color: var(--text-primary);
      border: 1px solid var(--glass-border);
    }

    /* Content Area */
    .content-wrapper {
      padding: ${uiConfig.fixed_header ? uiConfig.header_padding : '20'}px 0 20px 0;
      min-height: calc(100vh - 200px);
      position: relative;
      z-index: 2;
    }

    /* Breadcrumb - Matching Homepage */
    .alert-primary {
      background: var(--glass-bg) !important;
      border: 1px solid var(--glass-border) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: var(--text-primary) !important;
      border-radius: 12px !important;
      margin-bottom: 1rem !important;
      padding: 0.75rem 1rem !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      animation: fadeInUp 0.5s ease;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .breadcrumb {
      background: transparent !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .breadcrumb-item {
      color: var(--text-secondary);
    }

    .breadcrumb-item a {
      color: var(--accent-light);
      text-decoration: none;
      transition: color 0.3s ease;
      position: relative;
    }

    .breadcrumb-item a::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--accent-light);
      transition: width 0.3s ease;
    }

    .breadcrumb-item a:hover::after {
      width: 100%;
    }

    .breadcrumb-item a:hover {
      color: var(--text-primary);
    }

    .breadcrumb-item.active {
      color: var(--text-primary);
    }

    .breadcrumb-item + .breadcrumb-item::before {
      color: var(--text-secondary);
    }

    /* List Group - Matching Homepage */
    .list-group {
      background: transparent !important;
      margin-bottom: 1rem;
    }

    .list-group-item {
      background: var(--glass-bg) !important;
      border: 1px solid var(--glass-border) !important;
      border-radius: 12px !important;
      margin-bottom: 0.75rem;
      color: var(--text-primary) !important;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 1rem 1.25rem;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      position: relative;
      overflow: hidden;
    }

    .list-group-item::after {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(105, 129, 141, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .list-group-item:hover::after {
      opacity: 1;
    }

    .list-group-item:hover {
      background: var(--hover-bg) !important;
      border-color: var(--accent-main) !important;
      transform: translateX(8px) scale(1.01);
      box-shadow: 0 10px 30px var(--shadow-color);
    }

    .list-group-item a {
      color: var(--text-primary) !important;
      text-decoration: none;
      font-weight: 500;
      position: relative;
      z-index: 1;
    }

    /* Folder Icons - Golden Color */
    .bi-folder-fill, .bi-folder2-open {
      color: var(--folder-color) !important;
      filter: drop-shadow(0 2px 4px rgba(252, 227, 0, 0.3));
      transition: transform 0.3s ease;
    }

    .list-group-item:hover .bi-folder-fill,
    .list-group-item:hover .bi-folder2-open {
      transform: scale(1.1);
    }

    /* File Icons */
    .bi-file-earmark, .bi-file-earmark-text, .bi-file-earmark-music, 
    .bi-file-earmark-play, .bi-file-earmark-image, .bi-file-earmark-pdf {
      color: var(--file-icon-color) !important;
      transition: transform 0.3s ease;
    }

    .list-group-item:hover .bi-file-earmark,
    .list-group-item:hover .bi-file-earmark-text,
    .list-group-item:hover .bi-file-earmark-music,
    .list-group-item:hover .bi-file-earmark-play,
    .list-group-item:hover .bi-file-earmark-image,
    .list-group-item:hover .bi-file-earmark-pdf {
      transform: scale(1.1);
    }

    /* Count Alert */
    .alert-secondary {
      background: var(--glass-bg) !important;
      border: 1px solid var(--glass-border) !important;
      border-radius: 12px !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: var(--text-primary) !important;
      font-weight: 600;
      padding: 0.75rem;
      margin-bottom: 1rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      animation: fadeInUp 0.5s ease;
    }

    /* Footer - Matching Homepage */
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(19, 46, 53, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--glass-border);
      color: var(--text-secondary) !important;
      padding: 0.75rem 0;
      z-index: 999;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
    }

    .footer .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .footer p {
      color: var(--text-secondary) !important;
      margin: 0;
      font-size: 0.85rem;
    }

    .footer a {
      color: var(--accent-light);
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
    }

    .footer a::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--accent-light);
      transition: width 0.3s ease;
    }

    .footer a:hover::after {
      width: 100%;
    }

    .footer a:hover {
      color: var(--text-primary) !important;
      text-shadow: 0 0 8px var(--shadow-color);
    }

    .footer .float-end {
      margin: 0;
    }

    /* Card Styles */
    .card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 1.5rem;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeInUp 0.5s ease;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 45px 0 rgba(0, 0, 0, 0.5);
    }

    .card-header {
      background: rgba(45, 74, 83, 0.6) !important;
      border-bottom: 1px solid var(--glass-border);
      border-radius: 1.5rem 1.5rem 0 0 !important;
      font-weight: 600;
      padding: 1.25rem;
      color: var(--text-primary);
    }

    /* Table Styles */
    .table {
      color: var(--text-primary);
    }

    .table thead {
      background: rgba(105, 129, 141, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .table tbody tr {
      background: rgba(19, 46, 53, 0.4);
      transition: all 0.2s ease;
      border-bottom: 1px solid var(--glass-border);
    }

    .table tbody tr:hover {
      background: var(--hover-bg);
      transform: scale(1.01);
    }

    /* Form Select */
    .form-select {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      border-radius: 0.75rem;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .form-select:focus {
      background: rgba(19, 46, 53, 0.8);
      border-color: var(--accent-light);
      box-shadow: 0 0 0 0.2rem rgba(105, 129, 141, 0.25);
      color: var(--text-primary);
    }

    .form-select option {
      background: var(--dark-teal);
      color: var(--text-primary);
    }

    /* Alert Variants */
    .alert {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 1rem;
      color: var(--text-primary);
      animation: fadeInUp 0.5s ease;
    }

    .alert-success {
      background: rgba(55, 168, 110, 0.2) !important;
      border-color: rgba(55, 168, 110, 0.3) !important;
    }

    .alert-danger {
      background: rgba(216, 0, 50, 0.2) !important;
      border-color: rgba(216, 0, 50, 0.3) !important;
    }

    .alert-warning {
      background: rgba(255, 215, 0, 0.2) !important;
      border-color: rgba(255, 215, 0, 0.3) !important;
    }

    .alert-info {
      background: rgba(105, 129, 141, 0.2) !important;
      border-color: rgba(105, 129, 141, 0.3) !important;
    }

    /* Modal */
    .modal-content {
      background: rgba(13, 31, 35, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 1.5rem;
      box-shadow: var(--shadow-glow);
      color: var(--text-primary);
    }

    .modal-header {
      border-bottom: 1px solid var(--glass-border);
    }

    .modal-footer {
      border-top: 1px solid var(--glass-border);
    }

    .btn-close {
      filter: invert(1);
    }

    /* Badge Styling */
    .badge {
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      font-weight: 600;
    }

    .badge.bg-primary {
      background: linear-gradient(135deg, var(--accent-main), var(--accent-light)) !important;
      color: var(--text-primary) !important;
    }

    /* Pagination */
    .pagination .page-link {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      border-radius: 0.5rem;
      margin: 0 0.25rem;
      transition: all 0.3s ease;
    }

    .pagination .page-link:hover {
      background: rgba(105, 129, 141, 0.3);
      border-color: var(--accent-light);
      color: white;
      transform: translateY(-2px);
    }

    .pagination .page-item.active .page-link {
      background: linear-gradient(135deg, var(--accent-main), var(--accent-light));
      border-color: var(--accent-light);
      color: var(--text-primary);
    }

    /* Loading Spinner - Matching Homepage */
    .loading {
      position: fixed;
      z-index: 999;
      height: 2em;
      width: 2em;
      margin: auto;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    .loading:before {
      content: '';
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(rgba(13, 31, 35, 0.95), rgba(0, 0, 0, 0.98));
      backdrop-filter: blur(10px);
    }

    .loading:not(:required):after {
      content: '';
      display: block;
      font-size: 10px;
      width: 1em;
      height: 1em;
      margin-top: -0.5em;
      animation: spinner 150ms infinite linear;
      border-radius: 0.5em;
      box-shadow: 
        rgba(105, 129, 141, 0.75) 1.5em 0 0 0,
        rgba(105, 129, 141, 0.75) 1.1em 1.1em 0 0,
        rgba(105, 129, 141, 0.75) 0 1.5em 0 0,
        rgba(105, 129, 141, 0.75) -1.1em 1.1em 0 0,
        rgba(105, 129, 141, 0.75) -1.5em 0 0 0,
        rgba(105, 129, 141, 0.75) -1.1em -1.1em 0 0,
        rgba(105, 129, 141, 0.75) 0 -1.5em 0 0,
        rgba(105, 129, 141, 0.75) 1.1em -1.1em 0 0;
    }

    @keyframes spinner {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Scrollbar - Matching Homepage */
    ::-webkit-scrollbar {
      width: 12px;
    }

    ::-webkit-scrollbar-track {
      background: var(--bg-secondary);
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, var(--accent-main), var(--accent-light));
      border-radius: 10px;
      border: 2px solid var(--bg-secondary);
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, var(--accent-light), var(--accent-main));
    }

    /* Links */
    a {
      color: var(--accent-light);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    a:hover {
      color: var(--text-primary);
    }

    /* Selection Style */
    ::selection {
      background: var(--accent-main);
      color: var(--text-primary);
    }

    /* Responsive */
    @media (max-width: 768px) {
      body {
        padding-bottom: 120px;
      }

      .navbar-brand {
        font-size: 1.25rem;
      }

      .navbar-brand img {
        height: 36px;
      }

      .content-wrapper {
        padding: ${uiConfig.fixed_header ? '70' : '20'}px 0 20px 0;
      }

      .list-group-item {
        padding: 0.875rem 1rem;
      }

      .footer {
        padding: 0.5rem 0;
      }

      .footer .container {
        flex-direction: column;
        text-align: center;
        gap: 0.25rem;
      }

      .footer p {
        font-size: 0.75rem;
      }

      .footer .float-end {
        float: none !important;
      }
    }

    @media (max-height: 600px) {
      .footer {
        position: relative;
        margin-top: 2rem;
      }
      
      body {
        padding-bottom: 0;
      }
    }
  </style>
  <script>
  window.drive_names = JSON.parse('${JSON.stringify(authConfig.roots.map(it => it.name))}');
  window.MODEL = JSON.parse('${JSON.stringify(model)}');
  window.current_drive_order = ${current_drive_order};
  window.UI = JSON.parse('${JSON.stringify(uiConfig)}');
  window.player_config = JSON.parse('${JSON.stringify(player_config)}');
  </script>
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootswatch@5.0.0/dist/${uiConfig.theme}/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
  <script src="${app_js_file}"></script>
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked@5.1.1/lib/marked.umd.min.js"></script>
</head>
<body>
  <div class="particles" id="particles"></div>

  <nav class="navbar navbar-expand-lg${uiConfig.fixed_header ? ' fixed-top' : ''} ${uiConfig.header_style_class}" id="navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img src="https://cdn.jsdelivr.net/gh/shohan-001/Gdrive-Index@93879490cc17773db86f235553e0346356db0b2a/IndexPageLogo.png" alt="${authConfig.siteName}">
        <span>${authConfig.siteName}</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          ${uiConfig.show_logout_button ? '<li class="nav-item"><a class="nav-link" href="/logout"><i class="bi bi-box-arrow-right"></i> Logout</a></li>' : ''}
        </ul>
      </div>
    </div>
  </nav>

  <div class="content-wrapper">
    <div id="app-content"></div>
  </div>

  ${!uiConfig.hide_footer ? `
  <footer class="footer mt-auto py-3 text-muted ${uiConfig.footer_style_class}">
    <div class="container">
      <p class="float-end"><a href="#">↑ Back to top</a></p>
      ${uiConfig.credit ? '<p>Powered by <a href="https://www.npmjs.com/package/@googledrive/index" target="_blank">GDI</a></p>' : ''}
      <p>© ${uiConfig.copyright_year} - <a href="${uiConfig.company_link}" target="_blank">${uiConfig.company_name}</a></p>
    </div>
  </footer>
  ` : ''}

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
  
  <script>
    // Create floating particles - Matching Homepage
    function createParticles() {
      const particlesContainer = document.getElementById('particles');
      if (!particlesContainer) return;
      
      const particleCount = 30;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
      }
    }
    
    createParticles();

    // Navbar scroll effect - Matching Homepage
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });

    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  </script>
</body>
</html>`;
};

const homepage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <title>${authConfig.siteName}</title>
    <meta name="robots" content="noindex">
    <link rel="icon" href="${uiConfig.favicon}">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#132E35">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
    
    <style>
        :root {
            /* Dark Teal Palette */
            --darkest-bg: #0D1F23;
            --dark-teal: #132E35;
            --muted-blue: #2D4A53;
            --dusty-blue: #69818D;
            --light-gray-blue: #AFB3B7;
            --slate-gray: #5A636A;
            
            /* Semantic Colors (Remapped) */
            --bg-primary: var(--darkest-bg);
            --bg-secondary: var(--dark-teal);
            --bg-tertiary: #1A3F48; 
            --glass-bg: rgba(19, 46, 53, 0.7); 
            --glass-border: rgba(105, 129, 141, 0.2); 
            --text-primary: var(--light-gray-blue);
            --text-secondary: var(--dusty-blue);
            --accent-main: var(--muted-blue);
            --accent-light: var(--dusty-blue);
            --shadow-color: rgba(45, 74, 83, 0.4);
            --shadow-glow: 0 0 40px var(--shadow-color);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            position: relative;
        }

        /* Animated Background */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(ellipse at 10% 20%, rgba(45, 74, 83, 0.2) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(20, 50, 60, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(105, 129, 141, 0.15) 0%, transparent 50%);
            z-index: 0;
            animation: backgroundShift 20s ease infinite;
        }

        @keyframes backgroundShift {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
            50% { transform: translate(50px, -50px) scale(1.1); opacity: 0.8; }
        }

        /* Floating Particles (Using Accent) */
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--accent-light);
            border-radius: 50%;
            opacity: 0.3;
            animation: float 15s infinite ease-in-out;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            33% { transform: translateY(-100px) translateX(50px); }
            66% { transform: translateY(-50px) translateX(-50px); }
        }

        /* Glassmorphism Navbar (Increased blur and adjusted transparency) */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 1rem 2rem;
            background: rgba(19, 46, 53, 0.7);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border-bottom: 1px solid var(--glass-border);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }

        .navbar.scrolled {
            padding: 0.5rem 2rem;
            background: rgba(19, 46, 53, 0.95);
            box-shadow: var(--shadow-glow);
        }

        .navbar-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo-section {
            display: flex;
            align-items: center;
            gap: 1rem;
            text-decoration: none;
        }

        .logo-img {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            box-shadow: 0 0 20px var(--shadow-color);
            animation: logoFloat 3s ease-in-out infinite;
            transition: transform 0.3s ease;
        }

        .logo-img:hover {
            transform: scale(1.1) rotate(5deg);
        }

        @keyframes logoFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .nav-links {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }

        .nav-link {
            padding: 0.75rem 1.5rem;
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            border-radius: 12px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(105, 129, 141, 0.15), transparent);
            transition: left 0.5s ease;
        }

        .nav-link:hover::before {
            left: 100%;
        }

        .nav-link:hover {
            color: var(--text-primary);
            background: rgba(105, 129, 141, 0.05);
            box-shadow: 0 0 20px var(--shadow-color);
        }

        .nav-link.active {
            background: rgba(105, 129, 141, 0.1);
            color: var(--accent-light);
        }

        /* Hero Section */
        .hero {
            position: relative;
            min-height: 40vh; 
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 120px 20px 40px;
            z-index: 2;
        }
        
        .hero-content {
            max-width: 1200px;
            text-align: center;
            animation: fadeInUp 1s ease;
            padding-bottom: 0;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .hero-title {
            font-size: clamp(2.5rem, 8vw, 5rem);
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-main) 50%, var(--accent-light) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: titleShine 3s ease-in-out infinite;
        }

        @keyframes titleShine {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.2); }
        }

        .hero-subtitle {
            font-size: clamp(1rem, 3vw, 1.3rem);
            color: var(--text-secondary);
            margin-bottom: 3rem;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
        }

        /* Search Bar - FIXED */
        .search-container {
            max-width: 700px;
            margin: 0 auto 1.5rem;
            position: relative;
        }

        .search-wrapper {
            position: relative;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid var(--glass-border);
            border-radius: 60px;
            padding: 0.5rem;
            display: flex;
            gap: 0.5rem;
            align-items: stretch;
            transition: all 0.3s ease;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .search-wrapper:focus-within {
            border-color: var(--accent-main);
            box-shadow: 0 0 40px var(--shadow-color);
            transform: translateY(-2px);
        }

        .search-input {
            flex: 1;
            background: transparent !important;
            border: none !important;
            outline: none !important;
            padding: 1rem 1.5rem;
            color: var(--text-primary) !important;
            font-size: 1rem;
            font-weight: 500;
            min-width: 0;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }

        .search-input::placeholder {
            color: var(--slate-gray);
            opacity: 1;
        }

        /* Remove autofill background */
        .search-input:-webkit-autofill,
        .search-input:-webkit-autofill:hover,
        .search-input:-webkit-autofill:focus,
        .search-input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px var(--glass-bg) inset !important;
            -webkit-text-fill-color: var(--text-primary) !important;
            transition: background-color 5000s ease-in-out 0s;
        }

        .search-btn {
            background: linear-gradient(135deg, var(--accent-main), var(--accent-light));
            border: none;
            padding: 1rem 2.5rem;
            border-radius: 50px;
            color: var(--text-primary);
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px var(--shadow-color);
            white-space: nowrap;
            flex-shrink: 0;
        }

        .search-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 30px var(--shadow-color);
        }

        .search-btn:active {
            transform: scale(0.98);
        }

        /* Drive Cards Grid */
        .drives-section {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px 4rem; 
            position: relative;
            z-index: 2;
        }

        .section-header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .section-title {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--text-primary), var(--accent-main));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .section-subtitle {
            color: var(--text-secondary);
            font-size: 1.1rem;
        }

        .drives-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }

        .drive-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            padding: 2rem;
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
        }

        .drive-card::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(105, 129, 141, 0.1) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        .drive-card:hover::after {
            opacity: 1;
        }

        .drive-card:hover {
            transform: translateY(-10px) scale(1.02);
            border-color: var(--accent-main);
            box-shadow: 0 20px 60px var(--shadow-color);
        }

        .drive-icon-wrapper {
            width: 80px;
            height: 80px;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--accent-main), var(--accent-light));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            box-shadow: 0 10px 30px var(--shadow-color);
            transition: transform 0.3s ease;
        }

        .drive-card:hover .drive-icon-wrapper {
            transform: scale(1.1) rotate(5deg);
        }

        .drive-name {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
        }

        .drive-description {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }

        .drive-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, var(--accent-main), var(--accent-light));
            border: none;
            border-radius: 16px;
            color: var(--text-primary);
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .drive-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s ease, height 0.6s ease;
        }

        .drive-btn:hover::before {
            width: 300px;
            height: 300px;
        }

        .drive-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px var(--shadow-color);
        }

        .drive-btn span {
            position: relative;
            z-index: 1;
        }

        /* Loading State */
        .loading-spinner {
            display: inline-block;
            width: 50px;
            height: 50px;
            border: 4px solid var(--glass-border);
            border-top-color: var(--accent-main);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Footer */
        .footer {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid var(--glass-border);
            padding: 2rem 2rem 1.5rem;
            margin-top: 5rem;
            text-align: center;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }

        .footer-link {
            color: var(--light-gray-blue); 
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            position: relative;
        }

        .footer-link::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--accent-light);
            transition: width 0.3s ease;
        }

        .footer-link:hover::after {
            width: 100%;
        }

        .footer-link:hover {
            color: var(--accent-light);
            font-weight: 700;
            text-shadow: 0 0 8px var(--shadow-color);
        }

        .footer-text {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin: 0.5rem 0;
        }

        .footer-text a {
            color: var(--accent-main);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        .footer-text a:hover {
            color: var(--accent-light);
        }

        /* Mobile Menu Toggle */
        .menu-toggle {
            display: none;
            background: transparent;
            border: none;
            color: var(--text-primary);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .navbar {
                padding: 1rem;
            }

            .menu-toggle {
                display: block;
            }

            .nav-links {
                position: fixed;
                top: 80px;
                left: 0;
                right: 0;
                background: rgba(19, 46, 53, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                flex-direction: column;
                padding: 2rem;
                gap: 1rem;
                transform: translateY(-100%);
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease;
                border-bottom: 1px solid var(--glass-border);
            }

            .nav-links.active {
                transform: translateY(0);
                opacity: 1;
                pointer-events: all;
            }

            .hero {
                padding: 100px 20px 40px;
            }

            .hero-title {
                font-size: 2.5rem;
            }

            .drives-grid {
                grid-template-columns: 1fr;
            }

            .search-wrapper {
                flex-direction: row;
                padding: 0.4rem;
            }

            .search-input {
                padding: 0.875rem 1rem;
                font-size: 0.95rem;
            }

            .search-btn {
                padding: 0.875rem 1.5rem;
                font-size: 0.95rem;
            }

            .footer {
                padding: 1.5rem 1rem 1rem;
            }

            .footer-links {
                gap: 1.5rem;
                margin-bottom: 1rem;
            }

            .footer-text {
                font-size: 0.85rem;
            }
        }

        /* Smooth Scroll */
        html {
            scroll-behavior: smooth;
        }

        /* Selection Style */
        ::selection {
            background: var(--accent-main);
            color: var(--text-primary);
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 12px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, var(--accent-main), var(--accent-light));
            border-radius: 10px;
            border: 2px solid var(--bg-secondary);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, var(--accent-light), var(--accent-main));
        }
    </style>
    
    <script>
        window.drive_names = JSON.parse('${JSON.stringify(authConfig.roots.map(it => it.name))}');
        window.UI = JSON.parse('${JSON.stringify(uiConfig)}');
    </script>
</head>
<body>
    <div class="particles" id="particles"></div>

    <nav class="navbar" id="navbar">
        <div class="navbar-content">
            <a href="/" class="logo-section">
                <img src="https://files.catbox.moe/hfjlrl.png" alt="Logo" class="logo-img">
            </a>
            
            <button class="menu-toggle" id="menuToggle">☰</button>
            
            <div class="nav-links" id="navLinks">
                <a href="/" class="nav-link active">Home</a>
                <a href="/about" class="nav-link">About</a>
                <a href="${uiConfig.contact_link}" target="_blank" class="nav-link">Contact</a>
                ${uiConfig.show_logout_button ? '<a href="/logout" class="nav-link">Logout</a>' : ''}
            </div>
        </div>
    </nav>

    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">Welcome to ${uiConfig.company_name}</h1>
            <p class="hero-subtitle">Your blazing-fast cloud storage solution with enterprise-grade security and lightning performance</p>
            
            <div class="search-container">
                <form class="search-wrapper" method="get" action="/0:search">
                    <input 
                        class="search-input" 
                        name="q" 
                        type="search" 
                        placeholder="Search across all drives..." 
                        required
                        autocomplete="off"
                    >
                    <button class="search-btn" type="submit">
                        <span>Search</span>
                    </button>
                </form>
            </div>
        </div>
    </section>

    <section class="drives-section">
        <div class="drives-grid" id="drive-list">
            <div style="text-align: center; padding: 3rem;">
                <div class="loading-spinner"></div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="footer-content">
            <p class="footer-text">
                © ${uiConfig.copyright_year} <a href="${uiConfig.company_link}" target="_blank">${uiConfig.company_name}</a>. All rights reserved.
            </p>
            <div class="footer-links">
                <a href="/" class="footer-link">Home</a>
                <a href="/about" class="footer-link">About</a>
                <a href="${uiConfig.contact_link}" target="_blank" class="footer-link">Contact</a>
                <a href="https://github.com/shohan-001/Gdrive-Index" target="_blank" class="footer-link">GitHub</a>
            </div>
            <p class="footer-text" style="opacity: 0.7;">
                Powered by <a href="https://www.npmjs.com/package/@googledrive/index" target="_blank">GDI</a>
            </p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }
        
        createParticles();

        // Mobile Menu Toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });

        // Load drives
        document.addEventListener('DOMContentLoaded', function() {
            const driveList = document.getElementById('drive-list');
            
            if (!window.drive_names || window.drive_names.length === 0) {
                driveList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">⚠️ No drives configured or failed to load.</div>';
                return;
            }
            
            const drives = window.drive_names;
            const driveIcons = ['📁', '🎓', '🎮', '🎬', '📺', '💼', '🎵', '📸', '📚', '🎨'];
            
            let html = '';
            for (let i = 0; i < drives.length; i++) {
                const icon = driveIcons[i % driveIcons.length];
                html += \`
                    <div class="drive-card" style="animation-delay: \${i * 0.1}s;" onclick="window.location.href='/\${i}:/'">
                        <div class="drive-icon-wrapper">\${icon}</div>
                        <div class="drive-name">\${drives[i]}</div>
                        <div class="drive-description">Access files and folders instantly</div>
                        <button class="drive-btn">
                            <span>Browse Files →</span>
                        </button>
                    </div>
                \`;
            }
            
            driveList.innerHTML = html;
        });

        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('✅ SW Registered'))
                    .catch(err => console.log('❌ SW Error:', err));
            });
        }

        // Performance monitoring
        window.addEventListener('load', () => {
            if ('performance' in window) {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('⚡ Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms');
                }, 0);
            }
        });
    </script>
</body>
</html>`;

const adminPanelHTML = (username) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>${authConfig.siteName} - Admin Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootswatch@5.0.0/dist/${uiConfig.theme}/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            --warning-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --info-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --dark-gradient: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
        }

        body { 
            padding-top: 70px; 
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            color: #e8eaf6;
            font-family: 'Inter', sans-serif;
          }
 
          .navbar {
              background: rgba(30, 60, 114, 0.95) !important;
              backdrop-filter: blur(10px);
              box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
          }
 
          .navbar-brand {
              font-weight: 700;
              font-size: 1.5rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
          }
 
          .card { 
              border-radius: 1rem;
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
              transition: all 0.3s ease;
          }
 
          .card:hover {
              transform: translateY(-5px);
              box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
          }
 
          .card-header {
              background: rgba(255, 255, 255, 0.1) !important;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              font-weight: 600;
          }
 
          .stats-card {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 1rem;
              padding: 1.5rem;
              border: 1px solid rgba(255, 255, 255, 0.2);
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
          }
 
          .stats-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 4px;
              background: var(--primary-gradient);
          }
 
          .stats-card.success::before { background: var(--success-gradient); }
          .stats-card.warning::before { background: var(--warning-gradient); }
          .stats-card.info::before { background: var(--info-gradient); }
 
          .stats-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          }
 
          .stats-card h5 {
              font-size: 0.9rem;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #b0bec5;
              margin-bottom: 0.5rem;
          }
 
          .stats-card .h2 {
              font-size: 2.5rem;
              font-weight: 700;
              background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
          }
 
          .nav-link { 
              cursor: pointer;
              transition: all 0.3s ease;
              position: relative;
          }
 
          .nav-link::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 50%;
              width: 0;
              height: 2px;
              background: var(--primary-gradient);
              transition: all 0.3s ease;
              transform: translateX(-50%);
          }
 
          .nav-link.active::after,
          .nav-link:hover::after {
              width: 80%;
          }
 
          .table-responsive { 
              max-height: 70vh; 
              overflow-y: auto;
              border-radius: 0.5rem;
          }
 
          .table {
              color: #e8eaf6;
          }
 
          .table thead {
              background: rgba(102, 126, 234, 0.3);
              position: sticky;
              top: 0;
              z-index: 10;
          }
 
          .table tbody tr {
              transition: all 0.2s ease;
          }
 
          .table tbody tr:hover {
              background: rgba(255, 255, 255, 0.1);
              transform: scale(1.01);
          }
 
          .status-badge-pending { 
              animation: pulse 1.5s infinite; 
          }
 
          @keyframes pulse { 
              0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7); } 
              70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); } 
              100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); } 
          }
 
          .btn {
              border-radius: 0.5rem;
              font-weight: 600;
              transition: all 0.3s ease;
              border: none;
          }
 
          .btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          }
 
          .btn-sm {
              padding: 0.4rem 0.8rem;
              font-size: 0.85rem;
          }
 
          .log-details { 
              font-size: 0.75rem; 
              color: #b0bec5; 
          }
 
          .log-table th, .log-table td { 
              font-size: 0.85rem; 
          }
 
          .fixed-header-offset { 
              padding-top: 80px; 
          }
 
          .form-select, .form-control {
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: #e8eaf6;
              border-radius: 0.5rem;
          }
 
          .form-select:focus, .form-control:focus {
              background: rgba(255, 255, 255, 0.15);
              border-color: #667eea;
              color: #e8eaf6;
              box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          }
 
          .form-select option {
              background: #2c3e50;
              color: #e8eaf6;
          }
 
          .modal-content {
              background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 1rem;
          }
 
          .modal-header {
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
 
          .modal-footer {
              border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
 
          .spinner-border-sm {
              width: 1rem;
              height: 1rem;
          }
 
          .icon-wrapper {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 3rem;
              height: 3rem;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.1);
              margin-bottom: 0.5rem;
          }
 
          .icon-wrapper i {
              font-size: 1.5rem;
          }
 
          .badge {
              padding: 0.5rem 1rem;
              border-radius: 0.5rem;
              font-weight: 600;
          }
          
          /* --- MOBILE RESPONSIVENESS FIXES --- */
          /* General adjustments for smaller screens */
          @media (max-width: 767.98px) { /* Targeting extra small to medium devices */
              body { 
                  padding-top: 60px; /* Slightly less padding to accommodate smaller header */
              }
              .fixed-header-offset { 
                  padding-top: 10px; /* Reduces the offset for content below the navbar */
              }

              /* Stats cards become full width on extra small screens */
              .col-lg-3, .col-md-6 {
                  width: 100%; /* Force full width */
                  flex: 0 0 100%;
                  max-width: 100%;
                  margin-bottom: 1rem !important; /* Standardize bottom margin */
              }

              .stats-card .h2 { 
                  font-size: 2rem; /* Make the numbers slightly smaller */
              }

              /* Navbar adjustments for mobile */
              .navbar-brand {
                  margin-right: 0.5rem; /* Give a bit of space next to brand */
              }
              
              /* Ensure the toggler is always visible on small screens */
              .navbar-toggler {
                  display: block; /* Overrides any hidden states */
                  margin-left: auto; /* Push toggler to the right */
              }

              /* Hide the admin username on the main navbar row on mobile,
                 it will be shown inside the collapsed menu */
              .navbar-text.admin-username-desktop {
                  display: none !important;
              }

              /* Ensure collapsed menu takes full width and has proper styling */
              #adminNavbarContent {
                  background: rgba(30, 60, 114, 0.95); /* Keep consistent background */
                  border-radius: 0 0 0.5rem 0.5rem;
                  padding: 1rem 0; /* Add vertical padding */
              }

              /* Adjustments for nav links inside collapsed menu */
              .navbar-nav {
                  padding-left: 1rem; /* Indent menu items */
              }
              .navbar-nav .nav-item {
                  width: 100%; /* Make each nav item take full width */
              }
              .navbar-nav .nav-link {
                  text-align: left; /* Align links to the left */
              }
          }
          /* For medium screens and up, show the admin username next to brand */
          @media (min-width: 768px) {
              .navbar-text.admin-username-desktop {
                  display: inline !important;
              }
              .navbar-text.admin-username-mobile {
                  display: none !important;
              }
          }
          /* --- END MOBILE RESPONSIVENESS FIXES --- */
      </style>
  </head>
  <body>
      <nav class="navbar navbar-expand-md fixed-top"> <div class="container-fluid">
              <a class="navbar-brand" href="/">${authConfig.siteName}</a>
              
              <span class="navbar-text me-auto text-white-50 admin-username-desktop">
                  | Admin: <strong class="text-white">${username}</strong>
              </span>

              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbarContent">
                  <span class="navbar-toggler-icon"></span>
              </button>
              
              <div class="collapse navbar-collapse" id="adminNavbarContent">
                  <span class="navbar-text mt-2 mb-2 text-white-50 admin-username-mobile">
                      | Admin: <strong class="text-white">${username}</strong>
                  </span>

                  <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                      <li class="nav-item">
                          <a class="nav-link active text-white" id="nav-dashboard" onclick="showPanel('dashboard')">
                              <i class="bi bi-speedometer2"></i> Dashboard
                          </a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link text-white" id="nav-users" onclick="showPanel('users')">
                              <i class="bi bi-people-fill"></i> Users
                          </a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link text-white" id="nav-logs" onclick="showPanel('logs')">
                              <i class="bi bi-journal-text"></i> Logs
                          </a>
                      </li>
                      <li class="nav-item">
                          <a class="nav-link text-white" href="/logout">
                              <i class="bi bi-box-arrow-right"></i> Logout
                          </a>
                      </li>
                  </ul>
              </div>
          </div>
      </nav>
  
      <div class="container-fluid fixed-header-offset">
          <div id="dashboard-panel" class="panel">
              <h2 class="mt-4 mb-4 text-center">
                  <i class="bi bi-speedometer2"></i> Admin Dashboard
              </h2>
              <div class="row">
                  <div class="col-lg-3 col-md-6 mb-4">
                      <div class="stats-card">
                          <div class="icon-wrapper">
                              <i class="bi bi-people-fill text-primary"></i>
                          </div>
                          <h5>Total Users</h5>
                          <p class="h2" id="stat-total-users">...</p>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-6 mb-4">
                      <div class="stats-card warning">
                          <div class="icon-wrapper">
                              <i class="bi bi-clock-fill text-warning"></i>
                          </div>
                          <h5>Pending Approvals</h5>
                          <p class="h2" id="stat-pending-users">...</p>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-6 mb-4">
                      <div class="stats-card info">
                          <div class="icon-wrapper">
                              <i class="bi bi-download text-info"></i>
                          </div>
                          <h5>Today's Downloads</h5>
                          <p class="h2" id="stat-downloads">...</p>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-6 mb-4">
                      <div class="stats-card success">
                          <div class="icon-wrapper">
                              <i class="bi bi-check-circle-fill text-success"></i>
                          </div>
                          <h5>Successful Logins</h5>
                          <p class="h2" id="stat-logins">...</p>
                      </div>
                  </div>
              </div>
              <div class="card shadow mt-4">
                  <div class="card-header">
                      <i class="bi bi-exclamation-circle-fill"></i> Pending Signups
                  </div>
                  <div class="card-body table-responsive p-0">
                      <table class="table table-hover mb-0">
                          <thead>
                              <tr>
                                  <th><i class="bi bi-person"></i> Username</th>
                                  <th><i class="bi bi-calendar"></i> Created</th>
                                  <th><i class="bi bi-gear"></i> Action</th>
                              </tr>
                          </thead>
                          <tbody id="pending-users-list">
                              <tr><td colspan="3" class="text-center">Loading...</td></tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
  
          <div id="users-panel" class="panel" style="display:none;">
              <h2 class="mt-4 mb-4 text-center">
                  <i class="bi bi-people-fill"></i> User Management
              </h2>
              <div class="card shadow">
                  <div class="card-header">
                      <i class="bi bi-table"></i> All Users
                  </div>
                  <div class="card-body table-responsive p-0">
                      <table class="table table-hover mb-0">
                          <thead>
                              <tr>
                                  <th><i class="bi bi-person"></i> User</th>
                                  <th><i class="bi bi-shield"></i> Status</th>
                                  <th><i class="bi bi-award"></i> Role</th>
                                  <th><i class="bi bi-calendar"></i> Created</th>
                                  <th><i class="bi bi-gear"></i> Actions</th>
                              </tr>
                          </thead>
                          <tbody id="all-users-list">
                              <tr><td colspan="5" class="text-center">Loading...</td></tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
  
          <div id="logs-panel" class="panel" style="display:none;">
              <h2 class="mt-4 mb-4 text-center">
                  <i class="bi bi-journal-text"></i> Activity Logs
              </h2>
              <div class="row mb-4">
    <div class="col-12">
        <div class="card shadow" style="background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3);">
            <div class="card-header" style="background: rgba(255, 107, 107, 0.2) !important;">
                <i class="bi bi-trash3-fill"></i> Log Cleanup Tools
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label"><i class="bi bi-calendar-x"></i> Delete Logs Older Than:</label>
                        <div class="input-group">
                            <input type="number" id="daysOld" class="form-control" value="30" min="1" max="365">
                            <span class="input-group-text">days</span>
                        </div>
                        <button class="btn btn-warning w-100 mt-2" onclick="cleanupLogs('deleteOld')">
                            <i class="bi bi-clock-history"></i> Delete Old Logs
                        </button>
                    </div>
                    
                    <div class="col-md-4">
                        <label class="form-label"><i class="bi bi-filter"></i> Delete Logs By Type:</label>
                        <select id="logTypeToDelete" class="form-select">
                            <option value="FILE_DOWNLOAD">File Downloads</option>
                            <option value="FILE_VIEW">File Views</option>
                            <option value="SEARCH_QUERY">Search Queries</option>
                            <option value="LOGIN_SUCCESS">Successful Logins</option>
                            <option value="LOGIN_FAILED">Failed Logins</option>
                            <option value="SIGNUP_PENDING">Pending Signups</option>
                        </select>
                        <button class="btn btn-warning w-100 mt-2" onclick="cleanupLogs('deleteByType')">
                            <i class="bi bi-funnel"></i> Delete By Type
                        </button>
                    </div>
                    
                    <div class="col-md-4">
                        <label class="form-label"><i class="bi bi-exclamation-triangle"></i> Danger Zone:</label>
                        <div class="alert alert-danger p-2 mb-2" style="font-size: 0.85rem;">
                            <strong>Warning:</strong> This deletes ALL logs!
                        </div>
                        <button class="btn btn-danger w-100" onclick="cleanupLogs('deleteAll')">
                            <i class="bi bi-trash3-fill"></i> Delete All Logs
                        </button>
                    </div>
                </div>
                
                <div id="cleanup-status" class="alert mt-3" style="display: none;"></div>
            </div>
        </div>
    </div>
</div>
              <div class="row mb-3">
                  <div class="col-md-4">
                      <select id="log-filter-type" class="form-select" onchange="loadLogs()">
                          <option value="">All Activity Types</option>
                          <option value="LOGIN_SUCCESS">Login Success</option>
                          <option value="LOGIN_FAILED">Login Failed</option>
                          <option value="SIGNUP_PENDING">Signup Pending</option>
                          <option value="USER_APPROVED">User Approved</option>
                          <option value="FILE_DOWNLOAD">File Download</option>
                          <option value="SEARCH_QUERY">Search Query</option>
                          <option value="ADMIN_ACCESS_SUCCESS">Admin Access</option>
                          <option value="USER_STATUS_CHANGE">User Status Change</option>
                          <option value="USER_ROLE_CHANGE">User Role Change</option>
                          <option value="USER_DELETED">User Deleted</option>
                      </select>
                  </div>
              </div>
              <div class="card shadow">
                  <div class="card-header">
                      <i class="bi bi-activity"></i> Recent Activities
                  </div>
                  <div class="card-body table-responsive p-0">
                      <table class="table table-hover log-table mb-0">
                          <thead>
                              <tr>
                                  <th><i class="bi bi-clock"></i> Time</th>
                                  <th><i class="bi bi-tag"></i> Type</th>
                                  <th><i class="bi bi-person"></i> User</th>
                                  <th><i class="bi bi-info-circle"></i> IP/Agent</th>
                                  <th><i class="bi bi-file-text"></i> Details</th>
                              </tr>
                          </thead>
                          <tbody id="activity-logs-list">
                              <tr><td colspan="5" class="text-center">Loading...</td></tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </div>
  
      <div class="modal fade" id="adminModal" tabindex="-1">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="adminModalLabel">Action Result</h5>
                      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body" id="adminModalBody">...</div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
              </div>
          </div>
      </div>
  
      <script>
          const USER_PREFIX = 'USER:';
          const LOG_PREFIX = 'LOG:';
  
          function showPanel(panelId) {
              document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
              document.getElementById(panelId + '-panel').style.display = 'block';
              document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
              document.getElementById('nav-' + panelId).classList.add('active');
  
              if (panelId === 'users') {
                  loadAllUsers();
              } else if (panelId === 'logs') {
                  loadLogs();
              } else if (panelId === 'dashboard') {
                  loadDashboardData();
              }
               // Close the mobile menu after selection
              const navbarToggler = document.querySelector('.navbar-toggler');
              const navbarCollapse = document.querySelector('#adminNavbarContent');
              if (window.innerWidth < 768 && navbarCollapse.classList.contains('show')) { // Changed breakpoint
                  navbarToggler.click(); 
              }
          }
  
          function showModal(title, body) {
              document.getElementById('adminModalLabel').textContent = title;
              document.getElementById('adminModalBody').innerHTML = body;
              new bootstrap.Modal(document.getElementById('adminModal')).show();
          }
  
          async function api(path, method = 'GET', body = null) {
              const options = { method, headers: { 'Content-Type': 'application/json' } };
              if (body) options.body = JSON.stringify(body);
              try {
                  const response = await fetch(path, options);
                  return await response.json();
              } catch (error) {
                  console.error("API Error:", error);
                  showModal('API Error', \`Connection failed: \${error.message}\`);
                  return { success: false, error: error.message };
              }
          }
  
          async function loadDashboardData() {
              try {
                  const stats = await api('/api/admin/stats');
                  document.getElementById('stat-total-users').textContent = stats.totalUsers || '0';
                  document.getElementById('stat-pending-users').textContent = stats.pendingUsers || '0';
                  document.getElementById('stat-downloads').textContent = stats.todayDownloads || '0';
                  document.getElementById('stat-logins').textContent = stats.todayLogins || '0';
                  
                  const users = await api('/api/admin/users');
                  renderUserList(users.filter(u => u.status === 'pending'), 'pending-users-list', true);
              } catch(e) {
                  console.error("Dashboard Load Error:", e);
                  showModal('Data Error', 'Failed to load dashboard statistics.');
              }
          }
  
          async function loadAllUsers() {
              const userListBody = document.getElementById('all-users-list');
              userListBody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border spinner-border-sm" role="status"></div> Loading...</td></tr>';
              const users = await api('/api/admin/users');
              renderUserList(users, 'all-users-list');
          }
  
          function renderUserList(users, elementId, isPendingList = false) {
              const listBody = document.getElementById(elementId);
              if (users.length === 0) {
                  listBody.innerHTML = \`<tr><td colspan="\${isPendingList ? 3 : 5}" class="text-center">No users found.</td></tr>\`;
                  return;
              }
  
              listBody.innerHTML = users.map(user => {
                  const statusColor = {
                      'approved': 'success',
                      'pending': 'warning status-badge-pending',
                      'blocked': 'danger',
                  }[user.status] || 'secondary';
  
                  const actions = isPendingList 
                      ? \`<button class="btn btn-sm btn-success me-2" onclick="updateUserStatus('\${user.username}', 'approved')"><i class="bi bi-check-lg"></i> Approve</button>\`
                      : \`
                          <button class="btn btn-sm btn-info me-2" onclick="updateUserRole('\${user.username}')"><i class="bi bi-person-fill-gear"></i></button>
                          <button class="btn btn-sm btn-\${user.status === 'blocked' ? 'success' : 'warning'} me-2" onclick="updateUserStatus('\${user.username}', '\${user.status === 'blocked' ? 'approved' : 'blocked'}')"><i class="bi bi-\${user.status === 'blocked' ? 'unlock' : 'lock'}-fill"></i></button>
                          <button class="btn btn-sm btn-danger" onclick="deleteUser('\${user.username}')"><i class="bi bi-trash-fill"></i></button>
                      \`;
                  
                  const tableContent = isPendingList 
                      ? \`<td>\${user.username}</td><td>\${new Date(user.created_at).toLocaleString()}</td><td>\${actions}</td>\`
                      : \`
                          <td>\${user.username}</td>
                          <td><span class="badge bg-\${statusColor.split(' ')[0]}">\${user.status}</span></td>
                          <td>\${user.roles ? user.roles.join(', ') : 'user'}</td>
                          <td>\${new Date(user.created_at).toLocaleDateString()}</td>
                          <td>\${actions}</td>
                      \`;
  
                  return \`<tr>\${tableContent}</tr>\`;
              }).join('');
          }
          
          async function updateUserStatus(username, status) {
              if (!confirm(\`Confirm: Update \${username} to \${status}?\`)) return;
              const result = await api('/api/admin/users', 'POST', { username, status });
              if (result.success) {
                  showModal('Success', \`User \${username} is now <strong>\${status}</strong>.\`);
                  loadAllUsers();
                  loadDashboardData();
              } else {
                  showModal('Error', \`Failed: \${result.error}\`);
              }
          }
  
          async function updateUserRole(username) {
              const newRole = prompt(\`Enter roles for \${username} (comma-separated):\`);
              if (newRole === null) return;
              const rolesArray = newRole.split(',').map(r => r.trim().toLowerCase()).filter(r => r);
              const result = await api('/api/admin/users', 'POST', { username, roles: rolesArray });
              if (result.success) {
                  showModal('Success', \`Roles updated to: \${rolesArray.join(', ')}\`);
                  loadAllUsers();
              } else {
                  showModal('Error', \`Failed: \${result.error}\`);
              }
          }
  
          async function deleteUser(username) {
              if (!confirm(\`WARNING: Delete \${username}? This cannot be undone.\`)) return;
              const result = await api('/api/admin/users', 'POST', { username, action: 'delete' });
              if (result.success) {
                  showModal('Success', \`User \${username} deleted.\`);
                  loadAllUsers();
                  loadDashboardData();
              } else {
                  showModal('Error', \`Failed: \${result.error}\`);
              }
          }
  
          async function loadLogs() {
              const logListBody = document.getElementById('activity-logs-list');
              const typeFilter = document.getElementById('log-filter-type').value;
              logListBody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border spinner-border-sm"></div> Loading...</td></tr>';
              
              const logs = await api(\`/api/admin/logs?type=\${typeFilter}\`);
              
              if (logs.length === 0) {
                  logListBody.innerHTML = '<tr><td colspan="5" class="text-center">No logs found.</td></tr>';
                  return;
              }
  
              logListBody.innerHTML = logs.map(log => {
                  let badgeClass = 'secondary';
                  if (log.type.includes('SUCCESS') || log.type.includes('APPROVED')) badgeClass = 'success';
                  else if (log.type.includes('FAILED') || log.type.includes('BLOCKED') || log.type.includes('DELETED')) badgeClass = 'danger';
                  else if (log.type.includes('DOWNLOAD') || log.type.includes('QUERY') || log.type.includes('ACCESS')) badgeClass = 'info';
                  else if (log.type.includes('PENDING') || log.type.includes('CHANGE')) badgeClass = 'warning';
  
                  let detailsHtml = '';
                  try {
                      detailsHtml = Object.keys(log.details).map(key => 
                          \`<strong>\${key}:</strong> \${JSON.stringify(log.details[key]).replace(/"/g, '')}\`
                      ).join('<br>');
                  } catch {
                      detailsHtml = JSON.stringify(log.details);
                  }
  
                  return \`
                      <tr>
                          <td>\${new Date(log.timestamp).toLocaleString()}</td>
                          <td><span class="badge bg-\${badgeClass}">\${log.type}</span></td>
                          <td>\${log.user}</td>
                          <td>
                              <small>IP: \${log.ip}</small><br>
                              <small class="log-details">\${log.userAgent.substring(0, 40)}...</small>
                          </td>
                          <td>\${detailsHtml}</td>
                      </tr>
                  \`;
              }).join('');
          }
          async function cleanupLogs(action) {
            const statusDiv = document.getElementById('cleanup-status');
            const daysOld = document.getElementById('daysOld').value;
            const logType = document.getElementById('logTypeToDelete').value;
            
            let confirmMessage = '';
            let payload = { action };
            
            if (action === 'deleteOld') {
                confirmMessage = \`Delete all logs older than \${daysOld} days?\`;
                payload.daysOld = daysOld;
            } else if (action === 'deleteByType') {
                confirmMessage = \`Delete all logs of type "\${logType}"?\`;
                payload.logType = logType;
            } else if (action === 'deleteAll') {
                confirmMessage = 'WARNING: This will delete ALL activity logs permanently. Are you absolutely sure?';
            }
            
            if (!confirm(confirmMessage)) return;
            
            statusDiv.style.display = 'block';
            statusDiv.className = 'alert alert-info mt-3';
            statusDiv.innerHTML = '<div class="spinner-border spinner-border-sm me-2"></div> Processing cleanup...';
            
            try {
                const response = await fetch('/api/admin/logs', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    statusDiv.className = 'alert alert-success mt-3';
                    statusDiv.innerHTML = \`<i class="bi bi-check-circle-fill me-2"></i><strong>Success!</strong> \${result.message}\`;
                    
                    setTimeout(() => {
                        loadLogs();
                        statusDiv.style.display = 'none';
                    }, 3000);
                } else {
                    statusDiv.className = 'alert alert-danger mt-3';
                    statusDiv.innerHTML = \`<i class="bi bi-x-circle-fill me-2"></i><strong>Error:</strong> \${result.error}\`;
                }
            } catch (error) {
                statusDiv.className = 'alert alert-danger mt-3';
                statusDiv.innerHTML = \`<i class="bi bi-x-circle-fill me-2"></i><strong>Error:</strong> \${error.message}\`;
            }
        }
          document.addEventListener('DOMContentLoaded', () => {
              loadDashboardData();
              showPanel('dashboard');
          });
      </script>
  </body>
  </html>
  `;

// --- ORIGINAL HTML TEMPLATES AND UTILITY FUNCTIONS (Required for worker.js) ---

const login_html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in</title>
    <meta name="robots" content="noindex, nofollow">
    <meta name="googlebot" content="noindex, nofollow">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔐</text></svg>">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --light-bg-start: #c7ebe2;
            --light-bg-end: #dbf5ed;
            --dark-bg-start: #1a202c;
            --dark-bg-end: #2d3748;
            --wave-fill-light: rgba(0, 153, 128, 0.08);
            --wave-fill-dark: rgba(255, 255, 255, 0.05);
        }

        * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        html.dark {
            color-scheme: dark;
        }

        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
            position: relative;
            transition: background 0.5s ease;
        }

        .waves-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, var(--light-bg-start) 0%, var(--light-bg-end) 100%);
            z-index: -1;
            transition: background 0.5s ease;
        }

        .dark .waves-header {
            background: linear-gradient(135deg, var(--dark-bg-start) 0%, var(--dark-bg-end) 100%);
        }

        .waves {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 15vh;
            margin-bottom: -7px;
            min-height: 100px;
            max-height: 150px;
        }

        .parallax > use {
            animation: wave-move 25s cubic-bezier(.55, .5, .45, .5) infinite;
            fill: var(--wave-fill-light);
            transition: fill 0.5s ease;
        }
        
        .dark .parallax > use {
            fill: var(--wave-fill-dark);
        }

        .parallax > use:nth-child(1) { animation-delay: -2s; animation-duration: 7s; }
        .parallax > use:nth-child(2) { animation-delay: -3s; animation-duration: 10s; }
        .parallax > use:nth-child(3) { animation-delay: -4s; animation-duration: 13s; }
        .parallax > use:nth-child(4) { animation-delay: -5s; animation-duration: 20s; }

        @keyframes wave-move {
            0% { transform: translate3d(-90px, 0, 0); }
            100% { transform: translate3d(85px, 0, 0); }
        }

        .main-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            position: relative;
            z-index: 1;
        }

        .login-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 2rem;
            padding: 2.5rem;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 420px;
            animation: card-entrance 0.8s cubic-bezier(0.23, 1, 0.32, 1);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .dark .login-card {
            background: rgba(45, 55, 72, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        }

        @keyframes card-entrance {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .title-container {
            text-align: center;
            margin-bottom: 2.5rem;
            position: relative;
            min-height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .animated-title {
            font-size: clamp(1.8rem, 6vw, 2.2rem);
            font-weight: 700;
            color: #2d3748;
            margin: 0;
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .dark .animated-title { color: #e2e8f0; }

        .title-word {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            white-space: nowrap;
            opacity: 0;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            background: linear-gradient(135deg, #00997f 0%, #00b894 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .dark .title-word {
            background: linear-gradient(135deg, #4fd1c7 0%, #38b2ac 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .title-word.active {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            animation: title-glow 2s ease-in-out infinite alternate;
        }

        .title-word.exit {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9) translateY(-10px);
        }

        .title-word.enter {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.1) translateY(10px);
        }

        @keyframes title-glow {
            0% { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) drop-shadow(0 0 10px rgba(0, 153, 127, 0.2)); }
            100% { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) drop-shadow(0 0 20px rgba(0, 153, 127, 0.4)); }
        }

        .input-group { 
            position: relative; 
            margin-bottom: 1.5rem; 
            animation: input-slide-in 0.6s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
        }

        .input-group:nth-child(1) { animation-delay: 0.3s; }
        .input-group:nth-child(2) { animation-delay: 0.4s; }

        @keyframes input-slide-in {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .input-wrapper {
            position: relative;
            background: #ffffff;
            border: 2px solid transparent;
            border-radius: 50px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            transform: scale(1);
        }
        
        .dark .input-wrapper {
            background: #2d3748;
        }

        .input-wrapper:focus-within {
            border-color: #00997f;
            box-shadow: 0 0 0 3px rgba(0, 153, 127, 0.2);
            transform: scale(1.02);
        }

        .input-wrapper:hover {
            transform: scale(1.01);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .dark .input-wrapper:hover {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .input-wrapper input {
            width: 100%;
            height: 50px;
            padding: 0 50px;
            border: none;
            outline: none;
            background: transparent;
            font-size: 1rem;
            color: #2d3748;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .dark .input-wrapper input { color: #e2e8f0; }

        .input-wrapper input::placeholder { 
            color: #a0aec0; 
            font-weight: 400; 
            transition: all 0.3s ease;
        }
        .dark .input-wrapper input::placeholder { color: #718096; }

        .input-wrapper:focus-within input::placeholder {
            opacity: 0;
            transform: translateY(-10px);
        }

        .input-icon {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: #718096;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-wrapper:focus-within .input-icon { 
            color: #00997f; 
            transform: translateY(-50%) scale(1.1);
        }

        .toggle-password {
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #718096;
            cursor: pointer;
            padding: 5px;
            transition: all 0.3s ease;
            border-radius: 50%;
        }

        .toggle-password:hover {
            background: rgba(0, 153, 127, 0.1);
            color: #00997f;
            transform: translateY(-50%) scale(1.1);
        }

        .login-btn {
            width: 100%;
            height: 50px;
            background: linear-gradient(135deg, #00997f 0%, #00b894 100%);
            border: none;
            border-radius: 50px;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 1rem;
            position: relative;
            overflow: hidden;
            animation: button-slide-in 0.6s ease-out 0.6s forwards;
            opacity: 0;
            transform: translateY(20px);
        }

        @keyframes button-slide-in {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .login-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .login-btn:hover::before {
            left: 100%;
        }

        .login-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(0, 153, 127, 0.4);
        }

        .login-btn:active {
            transform: translateY(-1px);
        }

        .login-btn.loading {
            pointer-events: none;
            background: #a0aec0;
        }

        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .signup-link {
            display: block;
            text-align: center;
            margin-top: 1.5rem;
            padding: 0.75rem;
            color: #00997f;
            font-weight: 600;
            text-decoration: none;
            border-radius: 50px;
            transition: all 0.3s ease;
            animation: button-slide-in 0.6s ease-out 0.7s forwards;
            opacity: 0;
            transform: translateY(20px);
            font-size: 0.95rem;
        }

        .dark .signup-link {
            color: #4fd1c7;
        }

        .signup-link:hover {
            background: rgba(0, 153, 127, 0.1);
            transform: translateY(-2px);
        }

        .dark .signup-link:hover {
            background: rgba(79, 209, 199, 0.1);
        }

        .theme-toggle-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10;
        }
        
        .dark .theme-toggle-btn {
             background: rgba(0, 0, 0, 0.2);
             border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .theme-toggle-btn:hover {
            transform: scale(1.15) rotate(15deg);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .theme-toggle-btn svg {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: absolute;
            color: #2d3748;
        }
        .dark .theme-toggle-btn svg { color: #e2e8f0; }

        #sun-icon { 
            opacity: 0; 
            transform: scale(0) rotate(-90deg); 
        }
        .dark #sun-icon { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
        }
        #moon-icon {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
        .dark #moon-icon { 
            opacity: 0; 
            transform: scale(0) rotate(90deg); 
        }

        .error-message {
            background: #ff6b6b;
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 500;
            display: none;
            animation: error-shake 0.5s ease-in-out;
        }
        
        .error-message.show { 
            display: block; 
            animation: error-slide-in 0.4s ease-out;
        }

        @keyframes error-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        @keyframes error-slide-in {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .footer-text {
            text-align: center;
            color: #718096;
            font-size: 0.875rem;
            margin-top: 2rem;
            font-weight: 500;
            animation: footer-fade-in 0.6s ease-out 0.8s forwards;
            opacity: 0;
        }
        .dark .footer-text { color: #a0aec0; }

        @keyframes footer-fade-in {
            to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .login-card { padding: 2rem 1.5rem; }
            .animated-title { font-size: clamp(1.6rem, 8vw, 2rem); }
            .title-container { min-height: 70px; }
        }
    </style>
</head>
<body>
    <div class="waves-header">
        <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
            <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g class="parallax">
                <use xlink:href="#gentle-wave" x="48" y="0" />
                <use xlink:href="#gentle-wave" x="48" y="3" />
                <use xlink:href="#gentle-wave" x="48" y="5" />
                <use xlink:href="#gentle-wave" x="48" y="7" />
            </g>
        </svg>
    </div>

    <button class="theme-toggle-btn" id="theme-toggle" aria-label="Toggle theme">
        <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
    </button>

    <div class="main-container">
        <div class="login-card">
            <div class="title-container">
                <h1 class="animated-title">
                    <span class="title-word active">Welcome Back!</span>
                    <span class="title-word">Hello Again!</span>
                    <span class="title-word">Ready to Sign In?</span>
                </h1>
            </div>
            <div id="error-message" class="error-message"></div>

            <form onsubmit="handleLogin(event)" method="post">
                <div class="input-group">
                    <div class="input-wrapper">
                        <div class="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <input type="text" id="email" placeholder="Username" required>
                    </div>
                </div>

                <div class="input-group">
                    <div class="input-wrapper">
                        <div class="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <input type="password" id="password" placeholder="Password" required>
                        <button type="button" id="togglePassword" class="toggle-password" aria-label="Toggle password visibility">
                            <svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            <svg class="eye-closed" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        </button>
                    </div>
                </div>

                <button type="submit" id="btn-login" class="login-btn">
                    Sign In
                </button>
            </form>
            
            <a href="/signup" class="signup-link">
                Don't have an account? Sign Up
            </a>

            <div class="footer-text">
                &copy; <span id="current-year"></span> ${uiConfig.company_name}
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('current-year').textContent = new Date().getFullYear();

            const titles = document.querySelectorAll('.title-word');
            if (titles.length > 1) {
                let currentTitle = 0;
                
                const cycleTitle = () => {
                    const oldTitle = titles[currentTitle];
                    oldTitle.classList.remove('active');
                    oldTitle.classList.add('exit');

                    currentTitle = (currentTitle + 1) % titles.length;
                    const newTitle = titles[currentTitle];

                    newTitle.classList.add('enter');
                    
                    setTimeout(() => {
                        newTitle.classList.remove('enter');
                        newTitle.classList.add('active');
                    }, 100);

                    setTimeout(() => {
                        oldTitle.classList.remove('exit');
                    }, 800);
                };

                setInterval(cycleTitle, 4000);
            }

            const themeToggleBtn = document.getElementById('theme-toggle');
            const htmlElement = document.documentElement;

            function applyTheme(theme) {
                if (theme === 'dark') {
                    htmlElement.classList.add('dark');
                } else {
                    htmlElement.classList.remove('dark');
                }
                localStorage.setItem('theme', theme);
            }
            
            themeToggleBtn.addEventListener('click', () => {
                const currentTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
                applyTheme(currentTheme);
                themeToggleBtn.style.transform = 'scale(0.9) rotate(15deg)';
                setTimeout(() => {
                    themeToggleBtn.style.transform = '';
                }, 150);
            });

            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme) {
                applyTheme(savedTheme);
            } else if (prefersDark) {
                applyTheme('dark');
            }

            const togglePassword = document.getElementById('togglePassword');
            const passwordInput = document.getElementById('password');
            const eyeOpen = togglePassword.querySelector('.eye-open');
            const eyeClosed = togglePassword.querySelector('.eye-closed');

            togglePassword.addEventListener('click', () => {
                const isPassword = passwordInput.getAttribute('type') === 'password';
                passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
                eyeOpen.style.display = isPassword ? 'none' : 'block';
                eyeClosed.style.display = isPassword ? 'block' : 'none';
                passwordInput.focus();
            });

            const queryParams = new URLSearchParams(window.location.search);
            if (queryParams.has('error')) {
                showError(queryParams.get('error'));
            }

            setTimeout(() => {
                document.getElementById('email').focus();
            }, 500);
        });

        function handleLogin(event) {
            event.preventDefault();
            const button = document.getElementById('btn-login');
            const originalText = button.innerHTML;

            button.classList.add('loading');
            button.innerHTML = '<span class="loading-spinner"></span>';
            
            const formData = new URLSearchParams();
            formData.append('username', document.getElementById('email').value);
            formData.append('password', document.getElementById('password').value);
            
            fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            })
            .then(res => {
                if (!res.ok) {
                    return res.json().catch(() => ({ ok: false, message: 'Invalid credentials.' }));
                }
                return res.json();
            })
            .then(data => {
                if (!data.ok) {
                    showError(data.message || "Invalid credentials. Please try again.");
                    resetLoginButton(button, originalText);
                } else {
                    button.innerHTML = '✓ Success!';
                    button.style.background = 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)';
                    setTimeout(() => {
                        window.location.replace('/');
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Login Error:', error);
                showError("Connection error. Please try again.");
                resetLoginButton(button, originalText);
            });
        }
        
        function resetLoginButton(button, originalText) {
             button.classList.remove('loading');
             button.innerHTML = originalText;
        }

        function showError(message) {
            const errorDiv = document.getElementById("error-message");
            errorDiv.textContent = message;
            errorDiv.classList.add("show");
            
            setTimeout(() => {
                errorDiv.classList.remove("show");
            }, 5000);
        }
    </script>
</body>
</html>`;

const signup_html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - ${authConfig.siteName}</title>
    <meta name="robots" content="noindex, nofollow">
    <meta name="googlebot" content="noindex, nofollow">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔐</text></svg>">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --light-bg-start: #c7ebe2;
            --light-bg-end: #dbf5ed;
            --dark-bg-start: #1a202c;
            --dark-bg-end: #2d3748;
            --wave-fill-light: rgba(0, 153, 128, 0.08);
            --wave-fill-dark: rgba(255, 255, 255, 0.05);
        }

        * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        html.dark {
            color-scheme: dark;
        }

        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            overflow: hidden;
            position: relative;
            transition: background 0.5s ease;
        }

        .waves-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, var(--light-bg-start) 0%, var(--light-bg-end) 100%);
            z-index: -1;
            transition: background 0.5s ease;
        }

        .dark .waves-header {
            background: linear-gradient(135deg, var(--dark-bg-start) 0%, var(--dark-bg-end) 100%);
        }

        .waves {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 15vh;
            margin-bottom: -7px;
            min-height: 100px;
            max-height: 150px;
        }

        .parallax > use {
            animation: wave-move 25s cubic-bezier(.55, .5, .45, .5) infinite;
            fill: var(--wave-fill-light);
            transition: fill 0.5s ease;
        }
        
        .dark .parallax > use {
            fill: var(--wave-fill-dark);
        }

        .parallax > use:nth-child(1) { animation-delay: -2s; animation-duration: 7s; }
        .parallax > use:nth-child(2) { animation-delay: -3s; animation-duration: 10s; }
        .parallax > use:nth-child(3) { animation-delay: -4s; animation-duration: 13s; }
        .parallax > use:nth-child(4) { animation-delay: -5s; animation-duration: 20s; }

        @keyframes wave-move {
            0% { transform: translate3d(-90px, 0, 0); }
            100% { transform: translate3d(85px, 0, 0); }
        }

        .main-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            position: relative;
            z-index: 1;
        }

        .signup-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 2rem;
            padding: 2.5rem;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 420px;
            animation: card-entrance 0.8s cubic-bezier(0.23, 1, 0.32, 1);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .dark .signup-card {
            background: rgba(45, 55, 72, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        }

        @keyframes card-entrance {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .title-container {
            text-align: center;
            margin-bottom: 2rem;
        }

        .animated-title {
            font-size: clamp(1.8rem, 6vw, 2.2rem);
            font-weight: 700;
            background: linear-gradient(135deg, #00997f 0%, #00b894 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            animation: title-glow 2s ease-in-out infinite alternate;
            margin-bottom: 0.5rem;
        }

        .dark .animated-title {
            background: linear-gradient(135deg, #4fd1c7 0%, #38b2ac 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        @keyframes title-glow {
            0% { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) drop-shadow(0 0 10px rgba(0, 153, 127, 0.2)); }
            100% { filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) drop-shadow(0 0 20px rgba(0, 153, 127, 0.4)); }
        }

        .subtitle {
            color: #718096;
            font-size: 0.95rem;
            margin-top: 0.5rem;
        }
        .dark .subtitle { color: #a0aec0; }

        .input-group { 
            position: relative; 
            margin-bottom: 1.5rem; 
            animation: input-slide-in 0.6s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
        }

        .input-group:nth-child(1) { animation-delay: 0.2s; }
        .input-group:nth-child(2) { animation-delay: 0.3s; }

        @keyframes input-slide-in {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .input-wrapper {
            position: relative;
            background: #ffffff;
            border: 2px solid transparent;
            border-radius: 50px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            transform: scale(1);
        }
        
        .dark .input-wrapper {
            background: #2d3748;
        }

        .input-wrapper:focus-within {
            border-color: #00997f;
            box-shadow: 0 0 0 3px rgba(0, 153, 127, 0.2);
            transform: scale(1.02);
        }

        .input-wrapper:hover {
            transform: scale(1.01);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .dark .input-wrapper:hover {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .input-wrapper input {
            width: 100%;
            height: 50px;
            padding: 0 50px;
            border: none;
            outline: none;
            background: transparent;
            font-size: 1rem;
            color: #2d3748;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .dark .input-wrapper input { color: #e2e8f0; }

        .input-wrapper input::placeholder { 
            color: #a0aec0; 
            font-weight: 400; 
            transition: all 0.3s ease;
        }
        .dark .input-wrapper input::placeholder { color: #718096; }

        .input-wrapper:focus-within input::placeholder {
            opacity: 0;
            transform: translateY(-10px);
        }

        .input-icon {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: #718096;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-wrapper:focus-within .input-icon { 
            color: #00997f; 
            transform: translateY(-50%) scale(1.1);
        }

        .toggle-password {
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #718096;
            cursor: pointer;
            padding: 5px;
            transition: all 0.3s ease;
            border-radius: 50%;
        }

        .toggle-password:hover {
            background: rgba(0, 153, 127, 0.1);
            color: #00997f;
            transform: translateY(-50%) scale(1.1);
        }

        .signup-btn {
            width: 100%;
            height: 50px;
            background: linear-gradient(135deg, #00997f 0%, #00b894 100%);
            border: none;
            border-radius: 50px;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 1rem;
            position: relative;
            overflow: hidden;
            animation: button-slide-in 0.6s ease-out 0.5s forwards;
            opacity: 0;
            transform: translateY(20px);
        }

        @keyframes button-slide-in {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .signup-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .signup-btn:hover::before {
            left: 100%;
        }

        .signup-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(0, 153, 127, 0.4);
        }

        .signup-btn:active {
            transform: translateY(-1px);
        }

        .signup-btn.loading {
            pointer-events: none;
            background: #a0aec0;
        }

        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .login-link {
            display: block;
            text-align: center;
            margin-top: 1.5rem;
            padding: 0.75rem;
            color: #00997f;
            font-weight: 600;
            text-decoration: none;
            border-radius: 50px;
            transition: all 0.3s ease;
            animation: button-slide-in 0.6s ease-out 0.6s forwards;
            opacity: 0;
            transform: translateY(20px);
            font-size: 0.95rem;
        }

        .dark .login-link {
            color: #4fd1c7;
        }

        .login-link:hover {
            background: rgba(0, 153, 127, 0.1);
            transform: translateY(-2px);
        }

        .dark .login-link:hover {
            background: rgba(79, 209, 199, 0.1);
        }

        .theme-toggle-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10;
        }
        
        .dark .theme-toggle-btn {
             background: rgba(0, 0, 0, 0.2);
             border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .theme-toggle-btn:hover {
            transform: scale(1.15) rotate(15deg);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .theme-toggle-btn svg {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: absolute;
            color: #2d3748;
        }
        .dark .theme-toggle-btn svg { color: #e2e8f0; }

        #sun-icon { 
            opacity: 0; 
            transform: scale(0) rotate(-90deg); 
        }
        .dark #sun-icon { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
        }
        #moon-icon {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
        .dark #moon-icon { 
            opacity: 0; 
            transform: scale(0) rotate(90deg); 
        }

        .message-box {
            padding: 12px 20px;
            border-radius: 12px;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 500;
            display: none;
            animation: message-slide-in 0.4s ease-out;
        }

        .message-box.success {
            background: #00b894;
            color: white;
        }

        .message-box.error {
            background: #ff6b6b;
            color: white;
        }
        
        .message-box.show { 
            display: block; 
        }

        @keyframes message-slide-in {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .footer-text {
            text-align: center;
            color: #718096;
            font-size: 0.875rem;
            margin-top: 2rem;
            font-weight: 500;
            animation: footer-fade-in 0.6s ease-out 0.7s forwards;
            opacity: 0;
        }
        .dark .footer-text { color: #a0aec0; }

        @keyframes footer-fade-in {
            to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .signup-card { padding: 2rem 1.5rem; }
            .animated-title { font-size: clamp(1.6rem, 8vw, 2rem); }
        }
    </style>
</head>
<body>
    <div class="waves-header">
        <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
            <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g class="parallax">
                <use xlink:href="#gentle-wave" x="48" y="0" />
                <use xlink:href="#gentle-wave" x="48" y="3" />
                <use xlink:href="#gentle-wave" x="48" y="5" />
                <use xlink:href="#gentle-wave" x="48" y="7" />
            </g>
        </svg>
    </div>

    <button class="theme-toggle-btn" id="theme-toggle" aria-label="Toggle theme">
        <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
    </button>

    <div class="main-container">
        <div class="signup-card">
            <div class="title-container">
                <h1 class="animated-title">Create Account</h1>
                <p class="subtitle">Join us today and get started</p>
            </div>
            <div id="message-box" class="message-box"></div>

            <form onsubmit="handleSignup(event)" method="post">
                <div class="input-group">
                    <div class="input-wrapper">
                        <div class="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <input type="text" id="email" placeholder="Username (min 4 characters)" required minlength="4">
                    </div>
                </div>

                <div class="input-group">
                    <div class="input-wrapper">
                        <div class="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <input type="password" id="password" placeholder="Password (min 8 characters)" required minlength="8">
                        <button type="button" id="togglePassword" class="toggle-password" aria-label="Toggle password visibility">
                            <svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            <svg class="eye-closed" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        </button>
                    </div>
                </div>

                <button type="submit" id="btn-signup" class="signup-btn">
                    Create Account
                </button>
                
                <a href="/login" class="login-link">
                    Already have an account? Sign In
                </a>
            </form>

            <div class="footer-text">
                &copy; <span id="current-year"></span> ${uiConfig.company_name}
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('current-year').textContent = new Date().getFullYear();

            const themeToggleBtn = document.getElementById('theme-toggle');
            const htmlElement = document.documentElement;

            function applyTheme(theme) {
                if (theme === 'dark') {
                    htmlElement.classList.add('dark');
                } else {
                    htmlElement.classList.remove('dark');
                }
                localStorage.setItem('theme', theme);
            }
            
            themeToggleBtn.addEventListener('click', () => {
                const currentTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
                applyTheme(currentTheme);
                themeToggleBtn.style.transform = 'scale(0.9) rotate(15deg)';
                setTimeout(() => {
                    themeToggleBtn.style.transform = '';
                }, 150);
            });

            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme) {
                applyTheme(savedTheme);
            } else if (prefersDark) {
                applyTheme('dark');
            }

            const togglePassword = document.getElementById('togglePassword');
            const passwordInput = document.getElementById('password');
            const eyeOpen = togglePassword.querySelector('.eye-open');
            const eyeClosed = togglePassword.querySelector('.eye-closed');

            togglePassword.addEventListener('click', () => {
                const isPassword = passwordInput.getAttribute('type') === 'password';
                passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
                eyeOpen.style.display = isPassword ? 'none' : 'block';
                eyeClosed.style.display = isPassword ? 'block' : 'none';
                passwordInput.focus();
            });

            const queryParams = new URLSearchParams(window.location.search);
            if (queryParams.has('error')) {
                showMessage(queryParams.get('error'), 'error');
            }

            setTimeout(() => {
                document.getElementById('email').focus();
            }, 500);
        });

        function handleSignup(event) {
            event.preventDefault();
            const button = document.getElementById('btn-signup');
            const originalText = button.innerHTML;

            button.classList.add('loading');
            button.innerHTML = '<span class="loading-spinner"></span>';
            
            const formData = new URLSearchParams();
            formData.append('username', document.getElementById('email').value);
            formData.append('password', document.getElementById('password').value);
            
            fetch('/signup_api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            })
            .then(res => res.json())
            .then(data => {
                if (!data.ok) {
                    showMessage(data.error || "Signup failed. Please try again.", 'error');
                    resetButton(button, originalText);
                } else {
                    showMessage(data.message || "Account created successfully! Awaiting admin approval.", 'success');
                    button.innerHTML = '✓ Account Created!';
                    button.style.background = 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)';
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                }
            })
            .catch(error => {
                console.error('Signup Error:', error);
                showMessage("Connection error. Please try again.", 'error');
                resetButton(button, originalText);
            });
        }
        
        function resetButton(button, originalText) {
             button.classList.remove('loading');
             button.innerHTML = originalText;
        }

        function showMessage(message, type) {
            const messageBox = document.getElementById("message-box");
            messageBox.textContent = message;
            messageBox.className = 'message-box ' + type + ' show';
            
            setTimeout(() => {
                messageBox.classList.remove("show");
            }, 5000);
        }
    </script>
</body>
</html>`;


const aboutus_html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>About Us - ${authConfig.siteName}</title>
    <meta name="robots" content="noindex" />
    <link rel="icon" href="${uiConfig.favicon}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #132E35 0%, #2D4A53 100%);
            --bg-dark: #0D1F23;
            --bg-darker: #0A1619;
            --text-primary: #AFB3B7;
            --text-secondary: #69B18D;
            --text-accent: #5A636A;
            --card-bg: rgba(19, 46, 53, 0.6);
            --glass-border: rgba(105, 177, 141, 0.1);
            --hover-bg: rgba(45, 74, 83, 0.8);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-dark);
            min-height: 100vh;
            color: var(--text-primary);
            overflow-x: hidden;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(ellipse at 20% 50%, rgba(19, 46, 53, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(45, 74, 83, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 40% 20%, rgba(105, 177, 141, 0.15) 0%, transparent 50%);
            animation: backgroundShift 15s ease-in-out infinite;
            z-index: 0;
            pointer-events: none;
        }

        @keyframes backgroundShift {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
        }

        .navbar-toggler {
            border-color: rgba(105, 177, 141, 0.5);
        }

        .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28175, 179, 183, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        .navbar {
            background: rgba(13, 31, 35, 0.85) !important;
            backdrop-filter: blur(30px) saturate(180%);
            -webkit-backdrop-filter: blur(30px) saturate(180%);
            border-bottom: 1px solid var(--glass-border);
            box-shadow: 0 12px 50px rgba(0, 0, 0, 0.6);
            padding: 1rem 0;
            z-index: 1000;
            position: sticky;
            top: 0;
        }

        .navbar-brand {
            font-weight: 700;
            font-size: 1.5rem;
            color: var(--text-primary) !important;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transition: transform 0.3s ease;
        }

        .navbar-brand:hover {
            transform: scale(1.05);
        }

        .navbar-brand img {
            height: 50px;
            width: auto;
            filter: drop-shadow(0 2px 12px rgba(105, 177, 141, 0.5));
            transition: all 0.3s ease;
        }

        .navbar-brand:hover img {
            filter: drop-shadow(0 4px 16px rgba(105, 177, 141, 0.8));
            transform: rotate(-5deg) scale(1.05);
        }

        .nav-link {
            color: var(--text-accent) !important;
            font-weight: 500;
            padding: 0.5rem 1rem !important;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .nav-link:hover, .nav-link.active {
            color: var(--text-primary) !important;
            background: rgba(105, 177, 141, 0.15);
            transform: translateY(-2px);
        }

        .hero-section {
            position: relative;
            z-index: 2;
            padding: 120px 20px 80px;
            text-align: center;
            margin-top: 20px;
        }

        .hero-title {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            filter: drop-shadow(0 2px 10px rgba(105, 177, 141, 0.3));
            animation: titleFloat 3s ease-in-out infinite;
        }

        @keyframes titleFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .hero-subtitle {
            font-size: 1rem;
            color: var(--text-accent);
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.8;
        }

        .content {
            position: relative;
            z-index: 2;
            max-width: 1100px;
            margin: 0 auto;
            padding: 40px 20px 80px;
        }

        .section {
            margin-bottom: 60px;
        }

        .section-title {
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #69B18D 0%, #AFB3B7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .section-subtitle {
            font-size: 1.1rem;
            color: var(--text-accent);
            line-height: 1.8;
            margin-bottom: 20px;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }

        .feature-card {
            background: var(--card-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 15px;
            padding: 30px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .feature-card:hover {
            transform: translateY(-8px);
            border-color: rgba(105, 177, 141, 0.3);
            box-shadow: 0 12px 40px rgba(105, 177, 141, 0.2);
        }

        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #132E35 0%, #2D4A53 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin-bottom: 15px;
        }

        .feature-title {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 10px;
            color: var(--text-primary);
        }

        .feature-text {
            color: var(--text-accent);
            font-size: 0.95rem;
            line-height: 1.6;
        }

        .team-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }

        .team-member {
            background: var(--card-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .team-member:hover {
            transform: translateY(-5px);
            border-color: rgba(105, 177, 141, 0.3);
        }

        .member-avatar {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #132E35 0%, #2D4A53 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin: 0 auto 15px;
        }

        .member-name {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 5px;
            color: var(--text-primary);
        }

        .member-role {
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 15px;
        }

        .member-bio {
            color: var(--text-accent);
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 15px;
        }

        .social-link {
            width: 40px;
            height: 40px;
            background: rgba(105, 177, 141, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-primary);
            transition: all 0.3s ease;
            text-decoration: none;
        }

        .social-link:hover {
            background: linear-gradient(135deg, #132E35 0%, #69B18D 100%);
            transform: scale(1.1);
            color: white;
        }

        .contact-card {
            background: var(--card-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(45, 74, 83, 0.4);
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .contact-item:hover {
            background: rgba(105, 177, 141, 0.2);
            transform: translateX(5px);
        }

        .contact-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #132E35 0%, #2D4A53 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
        }

        .contact-info h4 {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 5px;
            color: var(--text-primary);
        }

        .contact-info p {
            font-size: 0.9rem;
            color: var(--text-accent);
            margin: 0;
        }

        .contact-info a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .contact-info a:hover {
            color: #2D4A53;
        }

        .faq-container {
            margin-top: 30px;
        }

        .faq-item {
            background: var(--card-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 12px;
            margin-bottom: 15px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .faq-item:hover {
            border-color: rgba(105, 177, 141, 0.3);
        }

        .faq-question {
            padding: 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            color: var(--text-primary);
            transition: all 0.3s ease;
        }

        .faq-question:hover {
            background: rgba(105, 177, 141, 0.1);
        }

        .faq-icon {
            transition: transform 0.3s ease;
            color: var(--text-secondary);
        }

        .faq-item.active .faq-icon {
            transform: rotate(180deg);
        }

        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            padding: 0 20px;
            color: var(--text-accent);
            line-height: 1.6;
        }

        .faq-item.active .faq-answer {
            max-height: 500px;
            padding: 0 20px 20px;
        }

        .cta-section {
            background: var(--card-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 50px;
            text-align: center;
            margin-top: 60px;
        }

        .cta-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 15px;
            color: var(--text-primary);
        }

        .cta-text {
            color: var(--text-accent);
            margin-bottom: 30px;
            font-size: 1rem;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #132E35 0%, #2D4A53 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(105, 177, 141, 0.3);
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(105, 177, 141, 0.5);
            color: white;
        }

        .footer {
            background: rgba(13, 31, 35, 0.9);
            backdrop-filter: blur(20px);
            border-top: 1px solid var(--glass-border);
            padding: 40px 20px;
            text-align: center;
            color: var(--text-accent);
        }

        .footer-link {
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.3s ease;
            margin: 0 10px;
        }

        .footer-link:hover {
            color: #2D4A53;
        }

        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(19, 46, 53, 0.4);
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #132E35 0%, #2D4A53 100%);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #2D4A53 0%, #132E35 100%);
        }

        @media (max-width: 768px) {
            .hero-section {
                padding: 60px 15px;
            }

            .section-title {
                font-size: 1.8rem;
            }

            .features-grid, .team-container {
                grid-template-columns: 1fr;
            }

            .cta-section {
                padding: 30px;
            }

            .cta-title {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">
                <img src="https://files.catbox.moe/hfjlrl.png" alt="${authConfig.siteName}" style="height: 50px; width: auto; margin-right: 10px;">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/about">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="${uiConfig.contact_link}" target="_blank">Contact</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="hero-section">
        <h1 class="hero-title">About ${authConfig.siteName}</h1>
        <p class="hero-subtitle">Your trusted cloud storage and file management platform</p>
    </div>

    <div class="content">
        <!-- Our Mission Section -->
        <div class="section">
            <h2 class="section-title">🎯 Our Mission</h2>
            <p class="section-subtitle">
                We are committed to providing a secure, fast, and user-friendly cloud storage solution. 
                Our platform enables seamless file management and sharing, empowering users to access their 
                content anytime, anywhere.
            </p>
        </div>

        <!-- What You Can Do Section -->
        <div class="section">
            <h2 class="section-title">✨ What You Can Do</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📁</div>
                    <div class="feature-title">Browse Files</div>
                    <div class="feature-text">Navigate through organized folders and access your files with an intuitive interface</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔍</div>
                    <div class="feature-title">Search Content</div>
                    <div class="feature-text">Powerful search functionality to find any file or folder instantly</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⬇️</div>
                    <div class="feature-title">Download Files</div>
                    <div class="feature-text">Download your files securely with high-speed direct links</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎬</div>
                    <div class="feature-title">Stream Media</div>
                    <div class="feature-text">Stream videos and audio files directly without downloading</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <div class="feature-title">Secure Access</div>
                    <div class="feature-text">Login system with admin approval for enhanced security</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <div class="feature-title">Mobile Friendly</div>
                    <div class="feature-text">Fully responsive design that works perfectly on all devices</div>
                </div>
            </div>
        </div>

        <!-- Contact Section -->
        <div class="section">
            <h2 class="section-title">📞 Get In Touch</h2>
            <div class="contact-card">
                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="bi bi-github"></i>
                    </div>
                    <div class="contact-info">
                        <h4>GitHub Repository</h4>
                        <p><a href="https://github.com/shohan-001/Gdrive-Index" target="_blank">github.com/shohan-001/Gdrive-Index</a></p>
                    </div>
                </div>

                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="bi bi-telegram"></i>
                    </div>
                    <div class="contact-info">
                        <h4>Telegram Support</h4>
                        <p><a href="https://t.me/Shohan_max" target="_blank">@Shohan_max</a></p>
                    </div>
                </div>

                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="bi bi-envelope"></i>
                    </div>
                    <div class="contact-info">
                        <h4>Email Support</h4>
                        <p><a href="mailto:support@iswvoid.me">support@iswvoid.me</a></p>
                    </div>
                </div>

                <div class="contact-item">
                    <div class="contact-icon">
                        <i class="bi bi-discord"></i>
                    </div>
                    <div class="contact-info">
                        <h4>Discord Community</h4>
                        <p><a href="https://discord.gg/iswvoid" target="_blank">Join our Discord</a></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- FAQ Section -->
        <div class="section">
            <h2 class="section-title">❓ Frequently Asked Questions</h2>
            <div class="faq-container">
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <span>How do I create an account?</span>
                        <i class="bi bi-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        Click on the "Sign Up" button on the homepage, fill in your username and password. 
                        Your account will be created and pending admin approval before you can access the platform.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <span>How long does account approval take?</span>
                        <i class="bi bi-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        Account approvals are typically processed within 24-48 hours. You'll receive access 
                        once an admin reviews and approves your registration.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <span>Can I download multiple files at once?</span>
                        <i class="bi bi-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        Yes! You can select multiple files and download them. The platform supports batch downloads 
                        for your convenience.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <span>Is my data secure?</span>
                        <i class="bi bi-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        Absolutely! We use industry-standard encryption, secure authentication, and regular security 
                        audits to protect your data. All file transfers are encrypted and your privacy is our priority.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <span>What file types are supported?</span>
                        <i class="bi bi-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        We support all file types including documents, images, videos, audio, archives, and more. 
                        Videos and audio files can be streamed directly without downloading.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <span>How do I search for files?</span>
                        <i class="bi bi-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        Use the search bar at the top of the page. Enter your search terms and press enter. 
                        The search will look through all file names across all accessible folders.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <span>Can I access this on mobile devices?</span>
                        <i class="bi bi-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        Yes! Our platform is fully responsive and works seamlessly on smartphones, tablets, and desktop 
                        computers. You can access your files from any device with an internet connection.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <span>What should I do if I forgot my password?</span>
                        <i class="bi bi-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        Please contact our support team via Telegram or Email (contact information above). 
                        An admin will help you reset your password securely.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <span>Are there any download limits?</span>
                        <i class="bi bi-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        Download limits depend on your account type and server capacity. For specific information 
                        about limits, please contact the admin team.
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        <span>How can I report a problem or bug?</span>
                        <i class="bi bi-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        You can report issues through our GitHub repository (create an issue), contact us on Telegram, 
                        or send an email to our support address. We appreciate detailed bug reports with screenshots if possible.
                    </div>
                </div>
            </div>
        </div>

        <!-- Call to Action -->
        <div class="cta-section">
            <h2 class="cta-title">Ready to Get Started?</h2>
            <p class="cta-text">Join our community and start accessing your files securely today</p>
            <a href="/" class="cta-button">Explore Files Now</a>
        </div>
    </div>

    <div class="footer">
        <p>&copy; ${uiConfig.copyright_year} ${authConfig.siteName}. All rights reserved.</p>
        <p>
            <a href="/" class="footer-link">Home</a>
            <a href="/about" class="footer-link">About</a>
            <a href="${uiConfig.contact_link}" target="_blank" class="footer-link">Contact</a>
            <a href="https://github.com/shohan-001/Gdrive-Index" target="_blank" class="footer-link">GitHub</a>
        </p>
        <p style="margin-top: 15px; font-size: 0.85rem;">
            Built with using Cloudflare Workers & Google Drive API
        </p>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function toggleFAQ(element) {
            const faqItem = element.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        }

        // Add smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .team-member, .faq-item, .contact-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    </script>
</body>
</html>`;

function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around separators
        .trim();
}

const manifest = {
    "name": authConfig.siteName,
    "short_name": "ISWVOID",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0a0e27",
    "theme_color": "#00f5ff",
    "icons": [
        {
            "src": uiConfig.favicon,
            "sizes": "192x192",
            "type": "image/png"
        }
    ]
};


const not_found = `<!DOCTYPE html>
<html lang=en>
  <meta charset=utf-8>
  <meta name=viewport content="initial-scale=1, minimum-scale=1, width=device-width">
  <title>Error 404 (Not Found)!!1</title>
  <style>
  *{margin:0;padding:0}html,code{font:15px/22px arial,sans-serif}html{background:#fff;color:#222;padding:15px}body{margin:7% auto 0;max-width:390px;min-height:180px;padding:30px 0 15px}* > body{background:url(//www.google.com/images/errors/robot.png) 100% 5px no-repeat;padding-right:205px}p{margin:11px 0 22px;overflow:hidden}ins{color:#777;text-decoration:none}a img{border:0}@media screen and (max-width:772px){body{background:none;margin-top:0;max-width:none;padding-right:0}}#logo{background:url(//www.google.com/images/branding/googlelogo/1x/googlelogo_color_150x54dp.png) no-repeat;margin-left:-5px}@media only screen and (min-resolution:192dpi){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat 0% 0%/100% 100%;-moz-border-image:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) 0}}@media only screen and (-webkit-min-device-pixel-ratio:2){#logo{background:url(//www.google.com/images/branding/googlelogo/2x/googlelogo_color_150x54dp.png) no-repeat;-webkit-background-size:100% 100%}}#logo{display:inline-block;height:54px;width:150px}
  </style>
  <a href=//www.google.com/><span id=logo aria-label=Google></span></a>
  <p><b>404.</b> <ins>That’s an error.</ins>
  <p id="status"></p>

  <script>
  document.getElementById("status").innerHTML =
"The requested URL <code>" + window.location.pathname + "</code> was not found on this server.  <ins>That’s all we know.</ins>";
  </script>`

const asn_blocked = `<html>
  <head>
  <title>Access Denied</title>
  <link href='https://fonts.googleapis.com/css?family=Lato:100' rel='stylesheet' type='text/css'>
  <style>
  body{
    margin:0;
    padding:0;
    width:100%;
    height:100%;
    color:#b0bec5;
    display:table;
    font-weight:100;
    font-family:Lato
  }
  .container{
    text-align:center;
    display:table-cell;
    vertical-align:middle
  }
  .content{
    text-align:center;
    display:inline-block
  }
  .message{
    font-size:80px;
    margin-bottom:40px
  }
  a{
    text-decoration:none;
    color:#3498db
  }

  </style>
  </head>
  <body>
  <div class="container">
  <div class="content">
  <div class="message">Access Denied</div>
  </div>
  </div>
  </body>
  </html>`

const directlink = `
  <html>
  <head>
  <title>Direct Link - Access Denied</title>
  <link href='https://fonts.googleapis.com/css?family=Lato:100' rel='stylesheet' type='text/css'>
  <style>
  body{
    margin:0;
    padding:0;
    width:100%;
    height:100%;
    color:#b0bec5;
    display:table;
    font-weight:100;
    font-family:Lato
  }
  .container{
    text-align:center;
    display:table-cell;
    vertical-align:middle
  }
  .content{
    text-align:center;
    display:inline-block
  }
  .message{
    font-size:80px;
    margin-bottom:40px
  }
  a{
    text-decoration:none;
    color:#3498db
  }

  </style>
  </head>
  <body>
  <div class="container">
  <div class="content">
  <div class="message">Access Denied</div>
  <center><a href=""><button id="goto">Click Here to Proceed!</button></a></center>
  </div>
  </div>
  </body>
  </html>
  `

function login(returnUrl = '/') {
    // Inject the returnUrl into the login HTML
    const loginHtmlWithReturn = login_html.replace(
        "window.location.replace('/');",
        `window.location.replace('${returnUrl}');`
    );
    return new Response(loginHtmlWithReturn, {
        status: 401,
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    });
}

// Helper function for JSON responses
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status: status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }
    });
}

// start handlerequest
async function handleRequest(request, event) {
    const region = request.headers.get('cf-ipcountry');
    const asn_servers = request.cf.asn;
    const referer = request.headers.get("Referer");
    var user_ip = request.headers.get("CF-Connecting-IP");
    let url = new URL(request.url);
    let path = url.pathname;
    let hostname = url.hostname;

    // --- ADMIN AUTH CHECK (Helper) ---
    let user_session_data = await checkUserSession(request);
    let isAuthenticated = user_session_data.isAuthenticated;
    let username = user_session_data.username;
    let isAdministrator = isAuthenticated ? await isAdmin(username) : false;

    // --- NEW ADMIN PANEL ROUTES ---
    if (path === '/admin') {
        if (!isAuthenticated) return login('/admin');
        if (!isAdministrator) return new Response('Access Denied: You are not an administrator.', { status: 403 });

        // NEW: Log successful admin panel access
        await logActivity('ADMIN_ACCESS_SUCCESS', username, request, { path: '/admin' });

        return new Response(adminPanelHTML(username), {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }

    if (path.startsWith('/api/admin/')) {
        if (!isAuthenticated || !isAdministrator) return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

        // Pass the username to the handlers for logging the admin who performed the action
        request.username = username;

        if (path === '/api/admin/users') return handleAdminUsers(request, user_ip);
        if (path === '/api/admin/logs') return handleAdminLogs(request);
        if (path === '/api/admin/stats') return handleAdminStats(request);

        return new Response(JSON.stringify({ success: false, error: 'API Not Found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    // --- END NEW ADMIN PANEL ROUTES ---

    if (path == '/app.js') {
        const js = await fetch('https://gitlab.com/GoogleDriveIndex/Google-Drive-Index/-/raw/dev/src/app.js', {
            method: 'GET',
        })
        const data = await js.text()
        return new Response(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/javascript; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            }
        });
    }
    if (path == '/logout') {
        // Log activity on successful logout
        if (isAuthenticated) await logActivity('LOGOUT_SUCCESS', username, request);

        let response = new Response("", {});
        response.headers.set('Set-Cookie', `session=; HttpOnly; Secure; SameSite=Lax;`);
        response.headers.set("Refresh", "1; url=/?error=Logged Out");
        return response;
    }

    if (path == '/about') {
        return new Response(aboutus_html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        });
    }

    if (path == '/findpath') {
        const params = url.searchParams;
        const id = params.get('id');
        const view = params.get('view') || 'false';
        return Response.redirect(url.protocol + hostname + '/0:findpath?id=' + id + '&view=' + view, 307);
    }

    // --- AUTHENTICATION LOGIC START ---
    if (authConfig.enable_login) {
        const login_database = authConfig.login_database.toLowerCase();

        // Bypass anonymous download restriction
        if (path == '/download.aspx' && !authConfig.disable_anonymous_download) {
            console.log("Anonymous Download")
        } else if (path == '/google_callback') {
            // Original Google Login logic (omitted for brevity, requires KV integration)
            return new Response('Google Login not fully implemented with new KV schema. Please use form login/signup.', { status: 501 });
        } else if (authConfig.enable_login && request.method === 'POST' && path === '/login') {
            const formdata = await request.formData();
            const inputUsername = formdata.get('username');
            const inputPassword = formdata.get('password');
            let user_found_and_approved = false;
            let user_status = 'not_found';
            let user_data = await getKVUser(inputUsername);

            if (user_data) {
                user_status = user_data.status;
                if (user_data.password === inputPassword) {
                    if (user_data.status === 'approved') {
                        user_found_and_approved = true;
                        await logActivity('LOGIN_SUCCESS', inputUsername, request);
                    } else {
                        await logActivity('LOGIN_FAILED', inputUsername, request, { reason: `Status: ${user_data.status}` });
                        return jsonResponse({ ok: false, message: `Your account status is ${user_data.status}. Login denied.` });
                    }
                } else {
                    await logActivity('LOGIN_FAILED', inputUsername, request, { reason: 'Incorrect password' });
                }
            } else {
                await logActivity('LOGIN_FAILED', inputUsername, request, { reason: 'User not found' });
            }

            if (user_found_and_approved) {
                const current_time = Date.now();
                const session_time = current_time + 86400000 * authConfig.login_days;
                const encryptedSession = `${await encryptString(inputUsername)}|${await encryptString(inputPassword)}|${await encryptString(session_time.toString())}`;

                // Session and IP lock logic (KV required)
                if (authConfig.single_session) {
                    await ENV.put(inputUsername + '_session', encryptedSession);
                }
                if (authConfig.ip_changed_action && user_ip) {
                    await ENV.put(inputUsername + '_ip', user_ip);
                }

                let response = new Response(JSON.stringify({ ok: true }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Set-Cookie': `session=${encryptedSession}; path=/; HttpOnly; Secure; SameSite=Lax`,
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    }
                });
                return response;
            } else {
                return jsonResponse({ ok: false, message: 'Invalid credentials or account not approved.' });
            }
        } else if (path == '/signup' && authConfig.enable_signup) {
            return new Response(signup_html, {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }
            });
        } else if (authConfig.enable_signup && request.method === 'POST' && path === '/signup_api') {
            const formdata = await request.formData();
            const inputUsername = formdata.get('username');
            const inputPassword = formdata.get('password');
            let jsonResponse;

            if (!inputUsername || !inputPassword) {
                jsonResponse = { ok: false, error: "Username and Password are required." };
            } else if (inputUsername.length < 4 || inputPassword.length < 8) {
                jsonResponse = { ok: false, error: "Username must be 4+ chars, Password must be 8+ chars." };
            } else {
                const checkKey = await getKVUser(inputUsername);
                if (checkKey) {
                    jsonResponse = { ok: false, error: "User Already Exists" };
                } else {
                    const newUser = {
                        username: inputUsername,
                        password: inputPassword,
                        status: 'pending', // REQUIRE ADMIN APPROVAL
                        roles: ['user'],
                        created_at: Date.now(),
                    };
                    await setKVUser(inputUsername, newUser);
                    await logActivity('SIGNUP_PENDING', inputUsername, request);
                    jsonResponse = { ok: true, message: "Account Created. Awaiting Admin Approval." };
                }
            }
            return new Response(JSON.stringify(jsonResponse), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Set-Cookie': `session=; path=/; HttpOnly; Secure; SameSite=Lax`,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                }
            });
        } else if (request.method === 'GET') {
            if (user_session_data.requiresLogin) {
                // Pass the current URL so user can be redirected back after login
                const returnUrl = url.pathname + url.search;
                return login(returnUrl);
            }
            // If isAuthenticated is true, proceed to normal worker logic
        }
    }
    // --- AUTHENTICATION LOGIC END ---

    // --- INITIALIZATION AND BLOCKING (Unchanged logic) ---
    if (gds.length === 0) {
        for (let i = 0; i < authConfig.roots.length; i++) {
            const gd = new googleDrive(authConfig, i);
            await gd.init();
            gds.push(gd)
        }
        let tasks = [];
        gds.forEach(gd => {
            tasks.push(gd.initRootType());
        });
        for (let task of tasks) {
            await task;
        }
    }

    let gd;

    function redirectToIndexPage() {
        return new Response('', {
            status: 307,
            headers: {
                'Location': `${url.origin}/0:/`
            }
        });
    }

    if (region && blocked_region.includes(region.toUpperCase())) {
        return new Response(asn_blocked, {
            status: 403,
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        })
    } else if (asn_servers && blocked_asn.includes(asn_servers)) {
        return new Response(asn_blocked, {
            headers: {
                'content-type': 'text/html;charset=UTF-8'
            },
            status: 401
        });
    } else if (path == '/') {
        // FIX: homepage was not defined in the code block used by the user.
        return new Response(homepage, {
            status: 200,
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        })
    } else if (path == '/fallback') {
        return new Response(html(0, {
            is_search_page: false,
            root_type: 1
        }), {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        });
    } else if (path == '/download.aspx') {
        // Logging File Access
        if (isAuthenticated) {
            await logActivity('FILE_DOWNLOAD', username, request, { file: url.searchParams.get('file'), ip_lock: authConfig['enable_ip_lock'] });
        } else {
            await logActivity('FILE_DOWNLOAD', 'anonymous', request, { file: url.searchParams.get('file') });
        }

        const file = await decryptString(url.searchParams.get('file'));
        const expiry = await decryptString(url.searchParams.get('expiry'));
        let integrity_result = false;
        if (authConfig['enable_ip_lock'] && user_ip) {
            const integrity = await genIntegrity(`${file}|${expiry}|${user_ip}`);
            const mac = url.searchParams.get('mac');
            integrity_result = await checkintegrity(mac, integrity);
        } else {
            const integrity = await genIntegrity(`${file}|${expiry}`);
            const mac = url.searchParams.get('mac');
            integrity_result = await checkintegrity(mac, integrity);
        }
        if (integrity_result) {
            let range = request.headers.get('Range');
            const inline = 'true' === url.searchParams.get('inline');
            return download(file, range, inline);
        } else {
            return new Response('Invalid Request!', {
                status: 401,
                headers: {
                    "content-type": "text/html;charset=UTF-8",
                },
            })
        }
    }

    if (authConfig['direct_link_protection']) {
        if (referer == null) {
            return new Response(directlink, {
                headers: {
                    'content-type': 'text/html;charset=UTF-8'
                },
                status: 401
            });
        } else if (referer.includes(hostname)) {
        } else {
            return new Response(directlink, {
                headers: {
                    'content-type': 'text/html;charset=UTF-8'
                },
                status: 401
            });
        }
    }

    const command_reg = /^\/(?<num>\d+):(?<command>[a-zA-Z0-9]+)(\/.*)?$/g;
    const match = command_reg.exec(path);
    if (match) {
        const num = match.groups.num;
        const order = Number(num);
        if (order >= 0 && order < gds.length) {
            gd = gds[order];
        } else {
            return redirectToIndexPage()
        }
        for (const r = gd.basicAuthResponse(request); r;) return r;
        const command = match.groups.command;
        if (command === 'search') {
            if (request.method === 'POST') {
                // Log search query - moved after actual search to avoid errors
                try {
                    return await handleSearch(request, gd, user_ip).then(async (response) => {
                        // Only log if search was successful and user is authenticated
                        if (response.ok && isAuthenticated) {
                            try {
                                const requestData = await request.clone().json();
                                await logActivity('SEARCH_QUERY', username, request, { query: requestData.q });
                            } catch (logError) {
                                console.error('Logging error:', logError);
                            }
                        }
                        return response;
                    });
                } catch (searchError) {
                    console.error('Search error:', searchError);
                    return new Response(JSON.stringify({
                        error: 'Search failed',
                        message: searchError.message
                    }), {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
            } else {
                const params = url.searchParams;
                return new Response(html(gd.order, {
                    q: params.get("q").replace(/'/g, "").replace(/"/g, "") || '',
                    is_search_page: true,
                    root_type: gd.root_type
                }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/html; charset=utf-8'
                    }
                });
            }
        } else if (command === 'id2path' && request.method === 'POST') {
            return handleId2Path(request, gd)
        } else if (command === 'fallback' && request.method === 'POST') {
            const formdata = await request.json();
            const id = await decryptString(formdata.id);
            const type = formdata.type;
            if (type && type == 'folder') {
                const page_token = formdata.page_token || null;
                const page_index = formdata.page_index || 0;
                const details = await gd._list_gdrive_files(id, page_token, page_index);
                for (const file of details.data.files) {
                    if (file.mimeType != 'application/vnd.google-apps.folder') {
                        file.link = await generateLink(file.id, user_ip);
                    }
                    file.driveId = await encryptString(file.driveId);
                    file.id = await encryptString(file.id);
                }
                const encryptedDetails = details;
                return new Response(JSON.stringify(encryptedDetails), {});
            }
            const details = await gd.findItemById(id)
            details.link = await generateLink(details.id, user_ip);
            details.id = formdata.id;
            details.parents[0] = null;
            return new Response(JSON.stringify(details), {});
        } else if (command === 'findpath' && request.method === 'GET') {
            return findId2Path(gd, url)
        }
    }

    const common_reg = /^\/\d+:\/.*$/g;
    try {
        if (!path.match(common_reg)) {
            return redirectToIndexPage();
        }
        let split = path.split("/");
        let order = Number(split[1].slice(0, -1));
        if (order >= 0 && order < gds.length) {
            gd = gds[order];
        } else {
            return redirectToIndexPage()
        }
        for (const r = gd.basicAuthResponse(request); r;) return r;
    } catch (e) {
        return redirectToIndexPage()
    }

    if (request.method == 'POST') {
        return apiRequest(request, gd, user_ip);
    }

    let action = url.searchParams.get('a');
    if (path.slice(-1) == '/' || action != null) {
        return new Response(html(gd.order, {
            root_type: gd.root_type
        }), {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        });
    } else {
        // This is a file view/stream request
        if (isAuthenticated) await logActivity('FILE_VIEW', username, request, { path: path });

        const file = await gd.get_single_file(path.slice(3));
        let range = request.headers.get('Range');
        const inline = 'true' === url.searchParams.get('inline');
        if (gd.root.protect_file_link && authConfig.enable_login) return login(path);
        return download(file.id, range, inline);

    }
}
// end handlerequest

// --- NEW ADMIN HANDLERS ---

/**
 * Handles /api/admin/users GET (list) and POST (update/delete)
 */
async function handleAdminUsers(request, user_ip) {
    if (request.method === 'GET') {
        const result = await listAllUsers();
        return jsonResponse(result);
    }

    if (request.method === 'POST') {
        const body = await request.json();
        const { username, status, roles, action } = body;

        if (!username) return jsonResponse({ success: false, error: 'Username is required' }, 400);

        const user = await getKVUser(username);
        if (!user) return jsonResponse({ success: false, error: 'User not found' }, 404);

        if (action === 'delete') {
            await ENV.delete(USER_PREFIX + username);
            // LOGGING: User deletion
            await logActivity('USER_DELETED', request.username, request, { target_user: username, admin_ip: user_ip });
            return jsonResponse({ success: true, message: `User ${username} deleted.` });
        }

        if (status) {
            const oldStatus = user.status;
            user.status = status;
            await setKVUser(username, user);

            // LOGGING: User status change (Block/Approve)
            await logActivity('USER_STATUS_CHANGE', request.username, request, { from: oldStatus, to: status, target_user: username, admin_ip: user_ip });

            if (status === 'approved' && oldStatus === 'pending') {
                // LOGGING: Explicit approval
                await logActivity('USER_APPROVED', request.username, request, { target_user: username, admin_ip: user_ip });
            }
        }

        if (roles) {
            const oldRoles = user.roles;
            user.roles = roles;
            await setKVUser(username, user);

            // LOGGING: User role change
            await logActivity('USER_ROLE_CHANGE', request.username, request, { from_roles: oldRoles, to_roles: roles, target_user: username, admin_ip: user_ip });
        }

        return jsonResponse({ success: true, user: user });
    }
}

/**
 * Handles /api/admin/logs GET (list)
 */
async function handleAdminLogs(request) {
    const url = new URL(request.url);

    // GET - List logs
    if (request.method === 'GET') {
        const typeFilter = url.searchParams.get('type') || '';
        const logs = await listAllLogs(typeFilter);
        return jsonResponse(logs);
    }

    // DELETE - Clean up logs
    if (request.method === 'DELETE') {
        try {
            const body = await request.json();
            const { action, daysOld, logType } = body;

            let deletedCount = 0;
            let message = '';

            if (action === 'deleteOld' && daysOld) {
                deletedCount = await deleteOldLogs(parseInt(daysOld));
                message = `Deleted ${deletedCount} logs older than ${daysOld} days`;

                await logActivity('ADMIN_LOG_CLEANUP', request.username, request, {
                    action: 'deleteOld',
                    daysOld: daysOld,
                    deletedCount: deletedCount
                });
            } else if (action === 'deleteByType' && logType) {
                deletedCount = await deleteLogsByType(logType);
                message = `Deleted ${deletedCount} logs of type "${logType}"`;

                await logActivity('ADMIN_LOG_CLEANUP', request.username, request, {
                    action: 'deleteByType',
                    logType: logType,
                    deletedCount: deletedCount
                });
            } else if (action === 'deleteAll') {
                deletedCount = await deleteOldLogs(0);
                message = `Deleted all ${deletedCount} activity logs`;

                await logActivity('ADMIN_LOG_CLEANUP', request.username, request, {
                    action: 'deleteAll',
                    deletedCount: deletedCount
                });
            } else {
                return jsonResponse({ success: false, error: 'Invalid action' }, 400);
            }

            return jsonResponse({
                success: true,
                deletedCount: deletedCount,
                message: message
            });
        } catch (error) {
            return jsonResponse({ success: false, error: error.message }, 500);
        }
    }

    return jsonResponse({ success: false, error: 'Method not allowed' }, 405);
}



/**
 * Handles /api/admin/stats GET (summary)
 */
async function handleAdminStats(request) {
    const allUsers = await listAllUsers();

    const totalUsers = allUsers.length;
    const pendingUsers = allUsers.filter(u => u.status === 'pending').length;

    // Fetch and filter logs for today's stats
    const today = new Date().setHours(0, 0, 0, 0);
    const allLogs = await listAllLogs(''); // Get all logs (up to max limit)

    const todayLogs = allLogs.filter(log => log.timestamp >= today);

    const todayDownloads = todayLogs.filter(log => log.type === 'FILE_DOWNLOAD').length;
    const todayLogins = todayLogs.filter(log => log.type === 'LOGIN_SUCCESS').length;

    const stats = {
        totalUsers,
        pendingUsers,
        todayDownloads,
        todayLogins,
    };

    return jsonResponse(stats);
}

// --- KV LISTING UTILITIES ---

/**
 * Lists all users from KV, fetching the value for each key.
 */
async function listAllUsers() {
    let cursor = null;
    let listComplete = false;
    const users = [];

    while (!listComplete) {
        // Max limit is 1000 per request, handle pagination if more than 1000 users exist
        const listResponse = await ENV.list({ prefix: USER_PREFIX, cursor: cursor });
        listComplete = listResponse.list_complete;
        cursor = listResponse.cursor;

        const keyPromises = listResponse.keys.map(key => ENV.get(key.name, 'json'));
        const userObjects = await Promise.all(keyPromises);

        userObjects.forEach(user => {
            if (user) users.push(user);
        });
    }

    return users.sort((a, b) => b.created_at - a.created_at);
}


/**
 * Lists all logs from KV, fetching the value for each key.
 */
async function listAllLogs(typeFilter = '') {
    let cursor = null;
    let listComplete = false;
    const logs = [];

    while (!listComplete && logs.length < 500) { // Limit to 500 for practical dashboard view
        const listResponse = await ENV.list({ prefix: LOG_PREFIX, cursor: cursor });
        listComplete = listResponse.list_complete;
        cursor = listResponse.cursor;

        const keyPromises = listResponse.keys.map(key => ENV.get(key.name, 'json'));
        const logObjects = await Promise.all(keyPromises);

        logObjects.forEach(log => {
            if (log) logs.push(log);
        });
    }

    // Sort by timestamp (descending, since keys are LOG:<timestamp>...)
    logs.sort((a, b) => b.timestamp - a.timestamp);

    if (typeFilter) {
        return logs.filter(log => log.type === typeFilter);
    }

    return logs;
}

// --- SESSION CHECKER REFACTOR ---

async function checkUserSession(request) {
    const cookie = request.headers.get('cookie');
    let isAuthenticated = false;
    let username = null;
    let requiresLogin = false;

    if (cookie && cookie.includes('session=')) {
        const session = cookie.split('session=').pop().split(';').shift().trim();
        if (session === 'null' || session === '' || session === null) {
            requiresLogin = true;
            return { isAuthenticated, username, requiresLogin };
        }

        try {
            username = await decryptString(session.split('|')[0]);
            const password = await decryptString(session.split('|')[1]);
            const session_time = await decryptString(session.split('|')[2]);
            const current_time = Date.now();
            const user_ip = request.headers.get("CF-Connecting-IP");

            if (Number(session_time) < current_time) {
                console.log('Session Expired');
                requiresLogin = true;
            } else {
                const user_data = await getKVUser(username);

                if (user_data && user_data.password === password) {
                    // Crucial: Check for APPROVED status
                    if (user_data.status !== 'approved') {
                        requiresLogin = true;
                        // Clear session cookie if status is not approved
                        return { isAuthenticated: false, username, requiresLogin, clearCookie: true };
                    }

                    isAuthenticated = true;

                    // Single session check
                    if (authConfig.single_session) {
                        const kv_session = await ENV.get(username + '_session');
                        if (kv_session !== session) {
                            requiresLogin = true;
                            console.log('User Logged in Somewhere Else');
                        }
                    }

                    // IP change check
                    if (authConfig.ip_changed_action && user_ip) {
                        const kv_ip = await ENV.get(username + '_ip');
                        if (kv_ip !== user_ip) {
                            requiresLogin = true;
                            console.log('IP Changed');
                        }
                    }
                } else {
                    requiresLogin = true;
                }
            }
        } catch (e) {
            console.error('Session Decryption Error:', e);
            requiresLogin = true;
        }
    } else {
        requiresLogin = authConfig.enable_login; // Only require login if login system is enabled
    }

    return { isAuthenticated, username, requiresLogin };
}

// ... (rest of the worker.js logic remains the same)

const JSONWebToken = {
    header: {
        alg: 'RS256',
        typ: 'JWT'
    },
    importKey: async function (pemKey) {
        var pemDER = this.textUtils.base64ToArrayBuffer(pemKey.split('\n').map(s => s.trim()).filter(l => l.length && !l.startsWith('---')).join(''));
        return crypto.subtle.importKey('pkcs8', pemDER, {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256'
        }, false, ['sign']);
    },
    createSignature: async function (text, key) {
        const textBuffer = this.textUtils.stringToArrayBuffer(text);
        return crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, textBuffer)
    },
    generateGCPToken: async function (serviceAccount) {
        const iat = parseInt(Date.now() / 1000);
        var payload = {
            "iss": serviceAccount.client_email,
            "scope": "https://www.googleapis.com/auth/drive",
            "aud": "https://oauth2.googleapis.com/token",
            "exp": iat + 3600,
            "iat": iat
        };
        const encPayload = btoa(JSON.stringify(payload));
        const encHeader = btoa(JSON.stringify(this.header));
        var key = await this.importKey(serviceAccount.private_key);
        var signed = await this.createSignature(encHeader + "." + encPayload, key);
        return encHeader + "." + encPayload + "." + this.textUtils.arrayBufferToBase64(signed).replace(/\//g, '_').replace(/\+/g, '-');
    },
    textUtils: {
        base64ToArrayBuffer: function (base64) {
            var binary_string = atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        },
        stringToArrayBuffer: function (str) {
            var len = str.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = str.charCodeAt(i);
            }
            return bytes.buffer;
        },
        arrayBufferToBase64: function (buffer) {
            let binary = '';
            let bytes = new Uint8Array(buffer);
            let len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }
    }
};

const SearchFunction = {
    formatSearchKeyword: function (keyword) {
        let nothing = "";
        let space = " ";
        if (!keyword) return nothing;
        return keyword.replace(/(!=)|['"=<>/\\:]/g, nothing)
            .replace(/[,，|(){}]/g, space)
            .trim()
    }

};

const DriveFixedTerms = new (class {
    default_file_fields = 'parents,id,name,mimeType,modifiedTime,createdTime,fileExtension,size';
    gd_root_type = {
        user_drive: 0,
        share_drive: 1
    };
    folder_mime_type = 'application/vnd.google-apps.folder';
})();

// web crypto functions
async function encryptString(string, iv) {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(crypto_base_key),
        "AES-CBC",
        false,
        ["encrypt"]
    );
    const encodedId = new TextEncoder().encode(string);
    const encryptedData = await crypto.subtle.encrypt({
        name: "AES-CBC",
        iv: encrypt_iv
    },
        key,
        encodedId
    );
    const encryptedString = btoa(Array.from(new Uint8Array(encryptedData), (byte) => String.fromCharCode(byte)).join(""));
    return encryptedString;
}

async function decryptString(encryptedString) {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(crypto_base_key),
        "AES-CBC",
        false,
        ["decrypt"]
    );
    const encryptedBytes = Uint8Array.from(atob(encryptedString), (char) => char.charCodeAt(0));
    const decryptedData = await crypto.subtle.decrypt({
        name: "AES-CBC",
        iv: encrypt_iv
    },
        key,
        encryptedBytes
    );
    const decryptedString = new TextDecoder().decode(decryptedData);
    return decryptedString;
}

// Web Crypto Integrity Generate API
async function genIntegrity(data, key = hmac_base_key) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hmacKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(key), {
        name: 'HMAC',
        hash: 'SHA-256'
    },
        false,
        ['sign']
    );
    const hmacBuffer = await crypto.subtle.sign('HMAC', hmacKey, dataBuffer);

    const hmacArray = Array.from(new Uint8Array(hmacBuffer));
    const hmacHex = hmacArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hmacHex;
}

async function checkintegrity(text1, text2) {
    return text1 === text2;
}


function enQuery(data) {
    const ret = [];
    for (let d in data) {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
    return ret.join('&');
}

async function getAccessToken() {
    if (authConfig.expires == undefined || authConfig.expires < Date.now()) {
        const obj = await fetchAccessToken();
        if (obj.access_token != undefined) {
            authConfig.accessToken = obj.access_token;
            authConfig.expires = Date.now() + 3500 * 1000;
        }
    }
    return authConfig.accessToken;
}

async function fetchAccessToken() {
    const url = "https://www.googleapis.com/oauth2/v4/token";
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var post_data;
    if (authConfig.service_account && typeof authConfig.service_account_json != "undefined") {
        const jwttoken = await JSONWebToken.generateGCPToken(authConfig.service_account_json);
        post_data = {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwttoken,
        };
    } else {
        post_data = {
            client_id: authConfig.client_id,
            client_secret: authConfig.client_secret,
            refresh_token: authConfig.refresh_token,
            grant_type: "refresh_token",
        };
    }

    let requestOption = {
        'method': 'POST',
        'headers': headers,
        'body': enQuery(post_data)
    };

    let response;
    for (let i = 0; i < 3; i++) {
        response = await fetch(url, requestOption);
        if (response.ok) {
            break;
        }
        await sleep(800 * (i + 1));
    }
    return await response.json();
}

async function sleep(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, ms);
    })
}
async function generateLink(file_id, user_ip, iv) {
    const encrypted_id = await encryptString(file_id, iv);
    const expiry = Date.now() + 1000 * 60 * 60 * 24 * authConfig.file_link_expiry;
    const encrypted_expiry = await encryptString(expiry.toString(), iv);
    let url
    if (authConfig['enable_ip_lock'] && user_ip) {
        const encrypted_ip = await encryptString(user_ip, iv);
        const integrity = await genIntegrity(`${file_id}|${expiry}|${user_ip}`);
        url = `/download.aspx?file=${encodeURIComponent(encrypted_id)}&expiry=${encodeURIComponent(encrypted_expiry)}&ip=${encodeURIComponent(encrypted_ip)}&mac=${encodeURIComponent(integrity)}`;
    } else {
        const integrity = await genIntegrity(`${file_id}|${expiry}`);
        url = `/download.aspx?file=${encodeURIComponent(encrypted_id)}&expiry=${encodeURIComponent(encrypted_expiry)}&mac=${encodeURIComponent(integrity)}`;
    }
    return url;
}

async function apiRequest(request, gd, user_ip) {
    let url = new URL(request.url);
    let path = url.pathname;
    path = path.replace(gd.url_path_prefix, '') || '/';
    let option = {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }

    if (path.slice(-1) == '/') {
        let requestData = await request.json();
        let list_result = await gd.request_list_of_files(
            path,
            requestData.page_token || null,
            Number(requestData.page_index) || 0
        );

        if (authConfig['enable_password_file_verify']) {
            let password = await gd.password(path);
            if (password && password.replace("\n", "") !== form.get('password')) {
                let html = `Y29kZWlzcHJvdGVjdGVk=0Xfi4icvJnclBCZy92dzNXYwJCI6ISZnF2czVWbiwSMwQDI6ISZk92YisHI6IicvJnclJyeYmFzZTY0aXNleGNsdWRlZA==`;
                return new Response(html, option);
            }
        }

        list_result.data.files = await Promise.all(list_result.data.files.map(async (file) => {
            const {
                driveId,
                id,
                mimeType,
                ...fileWithoutId
            } = file;

            const encryptedId = await encryptString(id);
            const encryptedDriveId = await encryptString(driveId);

            let link = null;
            if (mimeType !== 'application/vnd.google-apps.folder') {
                link = await generateLink(id, user_ip);
            }

            return {
                ...fileWithoutId,
                id: encryptedId,
                driveId: encryptedDriveId,
                mimeType: mimeType,
                link: link,
            };
        }));


        const encryptedFiles = list_result;
        const data = JSON.stringify(encryptedFiles)
        return new Response(data, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=UTF-8'

            }
        });
    } else {
        let file_json = await gd.get_single_file(path);
        const {
            driveId,
            id,
            ...fileWithoutId
        } = file_json;

        const encryptedId = await encryptString(id);
        const encryptedDriveId = await encryptString(driveId);
        const link = await generateLink(id, user_ip);
        const encryptedFile = {
            ...fileWithoutId,
            id: encryptedId,
            driveId: encryptedDriveId,
            link: link,
        };

        const encryptedFiles = encryptedFile;

        const data = JSON.stringify(encryptedFiles)
        return new Response(data, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=UTF-8'

            }
        });
    }
}

async function handleSearch(request, gd, user_ip = '') {
    const option = {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    };

    try {
        const requestData = await request.json();
        const q = requestData.q || '';
        const pageToken = requestData.page_token || null;
        const pageIndex = Number(requestData.page_index) || 0;

        if (q == '') {
            return new Response(JSON.stringify({
                "nextPageToken": null,
                "curPageIndex": 0,
                "data": {
                    "files": []
                }
            }), option);
        }

        const searchResult = await gd.searchFilesinDrive(q, pageToken, pageIndex);

        if (!searchResult || !searchResult.data || !searchResult.data.files) {
            return new Response(JSON.stringify({
                "nextPageToken": null,
                "curPageIndex": 0,
                "data": {
                    "files": []
                }
            }), option);
        }

        searchResult.data.files = await Promise.all(searchResult.data.files.map(async (file) => {
            try {
                const {
                    driveId,
                    id,
                    mimeType,
                    parents,
                    ...fileWithoutId
                } = file;

                const encryptedId = await encryptString(id);
                const encryptedDriveId = driveId ? await encryptString(driveId) : null;

                // Get the file path for navigation
                let path = null;
                let driveIndex = gd.order;
                try {
                    const pathResult = await gd.findPathById(id);
                    if (pathResult && pathResult.length > 0) {
                        path = pathResult[0];
                        driveIndex = pathResult[1];
                    }
                } catch (pathError) {
                    console.error('Path finding error:', pathError);
                }

                let link = null;
                if (mimeType !== 'application/vnd.google-apps.folder') {
                    link = await generateLink(id, user_ip);
                }

                return {
                    ...fileWithoutId,
                    id: encryptedId,
                    driveId: encryptedDriveId,
                    mimeType: mimeType,
                    link: link,
                    path: path,
                    driveIndex: driveIndex
                };
            } catch (fileError) {
                console.error('Error processing file:', fileError);
                return null;
            }
        }));

        // Filter out any null entries from failed file processing
        searchResult.data.files = searchResult.data.files.filter(f => f !== null);

        return new Response(JSON.stringify(searchResult), option);
    } catch (error) {
        console.error('Search error:', error);
        return new Response(JSON.stringify({
            "error": "Search failed",
            "message": error.message,
            "nextPageToken": null,
            "curPageIndex": 0,
            "data": {
                "files": []
            }
        }), {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });
    }
}

async function handleId2Path(request, gd) {
    const option = {
        status: 200,
        headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        }
    };
    try {
        const data = await request.json();
        const id = await decryptString(data.id);
        let [path, prefix] = await gd.findPathById(id);
        let jsonpath = '{"path": "/' + prefix + ':' + path + '"}'
        return new Response(jsonpath || '', option);
    } catch (error) {
        return new Response('{"message":"Request Failed or Path Not Found","error":"' + error + '"}', {
            status: 500,
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
            }
        });
    }
}

async function findId2Path(gd, url) {
    try {
        let [path, prefix] = await gd.findPathById(url.searchParams.get('id'));
        if (!path) {
            return new Response("Invalid URL");
        } else if (url.searchParams.get('view') && url.searchParams.get('view') == 'true') {
            return Response.redirect("https://" + url.hostname + "/" + prefix + ":" + path + "?a=view" || '', 302);
        } else {
            return Response.redirect("https://" + url.hostname + "/" + prefix + ":" + path || '', 302);
        }
    } catch (error) {
        const encrypted_id = await encryptString(url.searchParams.get('id'), encrypt_iv)
        return Response.redirect("https://" + url.hostname + "/fallback?id=" + encrypted_id || '', 302);
    }
}

class googleDrive {
    constructor(authConfig, order) {
        this.order = order;
        this.root = authConfig.roots[order];
        this.root.protect_file_link = this.root.protect_file_link || false;
        this.url_path_prefix = `/${order}:`;
        this.authConfig = authConfig;
        this.paths = [];
        this.files = [];
        this.passwords = [];
        this.paths["/"] = this.root['id'];
    }

    basicAuthResponse(request) {
        if (this.root.username && this.root.password) {
            const auth_header = request.headers.get('Authorization');
            if (!auth_header) {
                return new Response('Access Denied', {
                    status: 401,
                    headers: { 'WWW-Authenticate': 'Basic realm="Protected Area"' }
                });
            }
            const [user, pass] = atob(auth_header.split(' ').pop()).split(':');
            if (user !== this.root.username || pass !== this.root.password) {
                return new Response('Invalid Credentials', {
                    status: 401,
                    headers: { 'WWW-Authenticate': 'Basic realm="Protected Area"' }
                });
            }
        }
        return null;
    }

    async init() {
        await getAccessToken();
        if (authConfig.user_drive_real_root_id) return;
        const root_obj = await (gds[0] || this).findItemById('root');
        if (root_obj && root_obj.id) {
            authConfig.user_drive_real_root_id = root_obj.id
        }
    }

    async initRootType() {
        const root_id = this.root['id'];
        const types = DriveFixedTerms.gd_root_type;
        if (root_id === 'root' || root_id === authConfig.user_drive_real_root_id) {
            this.root_type = types.user_drive;
        } else {
            this.root_type = types.share_drive;
        }
    }


    async get_single_file(path) {
        if (typeof this.files[path] == 'undefined') {
            this.files[path] = await this.get_single_file_api(path);
        }
        return this.files[path];
    }

    async get_single_file_api(path) {
        let arr = path.split('/');
        let name = arr.pop();
        name = decodeURIComponent(name).replace(/\'/g, "\\'");
        let dir = arr.join('/') + '/';
        let parent = await this.findPathId(dir);
        let url = 'https://www.googleapis.com/drive/v3/files';
        let params = {
            'includeItemsFromAllDrives': true,
            'supportsAllDrives': true
        };
        params.q = `'${parent}' in parents and name = '${name}' and trashed = false and mimeType != 'application/vnd.google-apps.shortcut'`;
        params.fields = "files(id, name, mimeType, size ,createdTime, modifiedTime, iconLink, thumbnailLink, driveId, fileExtension)";
        url += '?' + enQuery(params);
        let requestOption = await this.requestOptions();
        let response;
        for (let i = 0; i < 3; i++) {
            response = await fetch(url, requestOption);
            if (response.ok) {
                break;
            }
            await sleep(800 * (i + 1));
        }
        let obj = await response.json();
        return obj.files[0];
    }

    async request_list_of_files(path, page_token = null, page_index = 0) {
        if (this.path_children_cache == undefined) {
            this.path_children_cache = {};
        }

        if (this.path_children_cache[path] &&
            this.path_children_cache[path][page_index] &&
            this.path_children_cache[path][page_index].data
        ) {
            let child_obj = this.path_children_cache[path][page_index];
            return {
                nextPageToken: child_obj.nextPageToken || null,
                curPageIndex: page_index,
                data: child_obj.data
            };
        }

        let id = await this.findPathId(path);
        let result = await this._list_gdrive_files(id, page_token, page_index);
        let data = result.data;
        if (result.nextPageToken && data.files) {
            if (!Array.isArray(this.path_children_cache[path])) {
                this.path_children_cache[path] = []
            }
            this.path_children_cache[path][Number(result.curPageIndex)] = {
                nextPageToken: result.nextPageToken,
                data: data
            };
        }

        return result
    }

    async _list_gdrive_files(parent, page_token = null, page_index = 0) {
        if (parent == undefined) {
            return null;
        }
        let obj;
        let params = {
            'includeItemsFromAllDrives': true,
            'supportsAllDrives': true
        };
        params.q = `'${parent}' in parents and trashed = false AND name !='.password' and mimeType != 'application/vnd.google-apps.shortcut' and mimeType != 'application/vnd.google-apps.document' and mimeType != 'application/vnd.google-apps.spreadsheet' and mimeType != 'application/vnd.google-apps.form' and mimeType != 'application/vnd.google-apps.site'`;
        params.orderBy = 'folder, name, modifiedTime desc';
        params.fields = "nextPageToken, files(id, name, mimeType, size, modifiedTime, driveId, kind, fileExtension)";
        params.pageSize = this.authConfig.files_list_page_size;

        if (page_token) {
            params.pageToken = page_token;
        }
        let url = 'https://www.googleapis.com/drive/v3/files';
        url += '?' + enQuery(params);
        let requestOption = await this.requestOptions();
        let response;
        for (let i = 0; i < 3; i++) {
            response = await fetch(url, requestOption);
            if (response.ok) {
                break;
            }
            await sleep(800 * (i + 1));
        }
        obj = await response.json();

        return {
            nextPageToken: obj.nextPageToken || null,
            curPageIndex: page_index,
            data: obj
        };
    }

    async password(path) {
        if (this.passwords[path] !== undefined) {
            return this.passwords[path];
        }

        let file = await this.get_single_file(path + '.password');
        if (file == undefined) {
            this.passwords[path] = null;
        } else {
            let url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
            let requestOption = await this.requestOptions();
            let response = await this.fetch200(url, requestOption);
            this.passwords[path] = await response.text();
        }

        return this.passwords[path];
    }

    async searchFilesinDrive(origin_keyword, page_token = null, page_index = 0) {
        const types = DriveFixedTerms.gd_root_type;
        const is_user_drive = this.root_type === types.user_drive;
        const is_share_drive = this.root_type === types.share_drive;
        const empty_result = {
            nextPageToken: null,
            curPageIndex: page_index,
            data: {
                files: []
            }
        };

        if (!is_user_drive && !is_share_drive) {
            return empty_result;
        }

        let keyword = SearchFunction.formatSearchKeyword(origin_keyword);
        if (!keyword) {
            return empty_result;
        }

        let words = keyword.split(/\s+/);
        let name_search_str = `name contains '${words.join("' AND name contains '")}'`;
        let params = {};

        if (is_user_drive) {
            if (authConfig.search_all_drives) {
                params.corpora = 'allDrives';
                params.includeItemsFromAllDrives = true;
                params.supportsAllDrives = true;
            } else {
                params.corpora = 'user';
            }
        }

        if (is_share_drive) {
            if (authConfig.search_all_drives) {
                params.corpora = 'allDrives';
            } else {
                params.corpora = 'drive';
                params.driveId = this.root.id;
            }
            params.includeItemsFromAllDrives = true;
            params.supportsAllDrives = true;
        }

        if (page_token) {
            params.pageToken = page_token;
        }

        let exclusion_str = '';
        if (this.authConfig.excluded_from_search && this.authConfig.excluded_from_search.length > 0) {
            exclusion_str = this.authConfig.excluded_from_search.map(id => ` and not '${id}' in parents`).join('');
        }

        params.q = `trashed = false AND mimeType != 'application/vnd.google-apps.shortcut' and mimeType != 'application/vnd.google-apps.document' and mimeType != 'application/vnd.google-apps.spreadsheet' and mimeType != 'application/vnd.google-apps.form' and mimeType != 'application/vnd.google-apps.site' AND name !='.password' AND (${name_search_str})${exclusion_str}`;
        params.fields = "nextPageToken, files(id, driveId, name, mimeType, size, modifiedTime, parents)";
        params.pageSize = this.authConfig.search_result_list_page_size;
        params.orderBy = 'folder, name, modifiedTime desc';

        let url = 'https://www.googleapis.com/drive/v3/files';
        url += '?' + enQuery(params);
        let requestOption = await this.requestOptions();

        try {
            let response;
            for (let i = 0; i < 3; i++) {
                response = await fetch(url, requestOption);
                if (response.ok) {
                    break;
                }
                await sleep(800 * (i + 1));
            }

            if (!response.ok) {
                console.error('Google Drive API error:', response.status, await response.text());
                return empty_result;
            }

            let res_obj = await response.json();

            return {
                nextPageToken: res_obj.nextPageToken || null,
                curPageIndex: page_index,
                data: res_obj
            };
        } catch (error) {
            console.error('Search error:', error);
            return empty_result;
        }
    }

    async findParentFilesRecursion(child_id, drive_index_no, contain_myself = true) {
        const gd = this;
        const gd_root_id = gd.root.id;
        const user_drive_real_root_id = authConfig.user_drive_real_root_id;
        const is_user_drive = gd.root_type === DriveFixedTerms.gd_root_type.user_drive;
        const target_top_id = is_user_drive ? user_drive_real_root_id : gd_root_id;
        const parent_files = [];
        let meet_top = false;
        async function addItsFirstParent(file_obj) {
            if (!file_obj || !file_obj.parents || file_obj.parents.length < 1) return;

            let p_ids = file_obj.parents;
            if (p_ids && p_ids.length > 0) {
                const first_p_id = p_ids[0];
                if (drive_list.includes(first_p_id)) {
                    meet_top = true;
                    drive_index_no = drive_list.indexOf(first_p_id);
                    return drive_index_no;
                }
                const p_file_obj = await gd.findItemById(first_p_id);
                if (p_file_obj && p_file_obj.id) {
                    parent_files.push(p_file_obj);
                    await addItsFirstParent(p_file_obj);
                }
            }
            return drive_index_no;
        }

        const child_obj = await gd.findItemById(child_id);
        if (contain_myself) {
            parent_files.push(child_obj);
        }
        const drive_id = await addItsFirstParent(child_obj);
        return meet_top ? [parent_files, drive_index_no] : null;
    }

    async findPathById(child_id) {
        let p_files, drive_index_no = 0;
        try {
            [p_files, drive_index_no] = await this.findParentFilesRecursion(child_id);
        } catch (error) {
            return null;
        }

        if (!p_files || p_files.length < 1) return '';

        let cache = [];
        p_files.forEach((value, idx) => {
            const is_folder = idx === 0 ? (p_files[idx].mimeType === DriveFixedTerms.folder_mime_type) : true;
            let path = '/' + p_files.slice(idx).map(it => encodeURIComponent(it.name)).reverse().join('/');
            if (is_folder) path += '/';
            cache.push({
                id: p_files[idx].id,
                path: path
            })
        });
        return [cache[0].path, drive_index_no];
    }

    async findItemById(id) {
        const is_user_drive = this.root_type === DriveFixedTerms.gd_root_type.user_drive;
        let url = `https://www.googleapis.com/drive/v3/files/${id}?fields=${DriveFixedTerms.default_file_fields}${is_user_drive ? '' : '&supportsAllDrives=true'}`;
        let requestOption = await this.requestOptions();
        let res = await fetch(url, requestOption);
        return await res.json()
    }

    async findPathId(path) {
        let c_path = '/';
        let c_id = this.paths[c_path];

        let arr = path.trim('/').split('/');
        for (let name of arr) {
            c_path += name + '/';

            if (typeof this.paths[c_path] == 'undefined') {
                let id = await this._findDirId(c_id, name);
                this.paths[c_path] = id;
            }

            c_id = this.paths[c_path];
            if (c_id == undefined || c_id == null) {
                break;
            }
        }
        return this.paths[path];
    }

    async _findDirId(parent, name) {
        name = decodeURIComponent(name).replace(/\'/g, "\\'");
        if (parent == undefined) {
            return null;
        }

        let url = 'https://www.googleapis.com/drive/v3/files';
        let params = {
            'includeItemsFromAllDrives': true,
            'supportsAllDrives': true
        };
        params.q = `'${parent}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${name}'  and trashed = false`;
        params.fields = "nextPageToken, files(id, name, mimeType)";
        url += '?' + enQuery(params);
        let requestOption = await this.requestOptions();
        let response;
        for (let i = 0; i < 3; i++) {
            response = await fetch(url, requestOption);
            if (response.ok) {
                break;
            }
            await sleep(800 * (i + 1));
        }
        let obj = await response.json();
        if (obj.files[0] == undefined) {
            return null;
        }
        return obj.files[0].id;
    }

    async fetch200(url, requestOption) {
        let response;
        for (let i = 0; i < 3; i++) {
            response = await fetch(url, requestOption);
            if (response.ok) {
                break;
            }
            await sleep(800 * (i + 1));
        }
        return response;
    }

    async requestOptions(headers = {}, method = 'GET') {
        const Token = await getAccessToken();
        headers['authorization'] = 'Bearer ' + Token;
        return {
            'method': method,
            'headers': headers
        };
    }
}

const drive = new googleDrive(authConfig, 0);

async function download(id, range = '', inline) {
    let url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
    const requestOption = await drive.requestOptions();
    requestOption.headers['Range'] = range;
    let file = await drive.findItemById(id);
    if (!file.name) {
        return new Response(`{"error":"Unable to Find this File, Try Again."}`, {
            status: 500,
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Origin": '*',
                "Cache-Control": "max-age=3600",
            }
        });
    }
    let res;
    for (let i = 0; i < 3; i++) {
        res = await fetch(url, requestOption);
        if (res.ok) {
            break;
        }
        sleep(800 * (i + 1));
    }
    const second_domain_for_dl = `${uiConfig.second_domain_for_dl}`
    if (second_domain_for_dl == 'true') {
        const res = await fetch(`${uiConfig.jsdelivr_cdn_src}@${uiConfig.version}/assets/disable_download.html`);
        return new Response(await res.text(), {
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        })
    } else if (res.ok) {
        const {
            headers
        } = res = new Response(res.body, res)
        headers.set("Content-Disposition", `attachment; filename="${file.name}"`);
        headers.set("Content-Length", file.size);
        authConfig.enable_cors_file_down && headers.append('Access-Control-Allow-Origin', '*');
        inline === true && headers.set('Content-Disposition', 'inline');
        return res;
    } else if (res.status == 404) {
        return new Response(not_found, {
            status: 404,
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        })
    } else if (res.status == 403) {
        const details = await res.text()
        return new Response(details, {
            status: 403,
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        })
    } else {
        const details = await res.text()
        return new Response(details, {})
    }
}


String.prototype.trim = function (char) {
    if (char) {
        return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
};


function decodeJwtToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request, event).catch(
        (err) => new Response("Report this page when asked at the time of support... ==> " + err.stack, { status: 500 })
    )
    );
});
