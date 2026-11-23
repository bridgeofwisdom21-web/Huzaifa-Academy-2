# 🎬 Huzaifa Academy - Official Web App & Promotional Platform

A modern, high-conversion promotional web application built for the YouTube channel **[Huzaifa Academy (@HuzaifaAcademy-z6m)](https://www.youtube.com/@HuzaifaAcademy-z6m)**.

Designed with a cinematic **Cosmic Dark** aesthetic inspired by streaming platforms, this web app showcases all 14 official documentaries, provides in-app video playback, live search, multi-category filtering, and prominent subscription prompts to grow the channel.

---

## 🌟 Channel Overview
- **Channel Name:** Huzaifa Academy
- **Handle:** `@HuzaifaAcademy-z6m`
- **Channel URL:** [https://www.youtube.com/@HuzaifaAcademy-z6m](https://www.youtube.com/@HuzaifaAcademy-z6m)
- **Direct Subscribe Link:** [Subscribe with One Click](https://www.youtube.com/@HuzaifaAcademy-z6m?sub_confirmation=1)
- **Genre:** Educational Documentaries in Urdu covering Ancient Mysteries, Space Missions, Catastrophes, Dinosaurs, and Nature.

---

## 🚀 Key Web App Features

### 1. 🌓 Dual Theme Mode (Cinematic Dark & Premium Light)
- Seamless one-click switch between **Cosmic Dark** and **Crisp Light** modes.
- Desktop navbar button and mobile drawer switch with automatic icon rotation (`fa-sun` / `fa-moon`).
- Theme preference is remembered across visits via `localStorage`.

### 2. 🎥 In-App Cinema Video Player Modal
- Watch any documentary directly within the web app without leaving the page.
- Clean 16:9 responsive YouTube embed (`youtube-nocookie.com`) with autoplay and dark backdrop blur.
- Includes full documentary synopsis, duration, category badges, tags, and direct YouTube watch action.

### 2. 🔍 Real-Time Search & Instant Filtering
- Filter documentaries instantly as you type by title, synopsis, or topic tags (e.g. *Pyramid*, *Stonehenge*, *Titanic*, *Dinosaurs*, *MH370*, *Chernobyl*).

### 3. 🏷️ Category Filter Pills
- **All Documentaries (14)**
- **🏛️ Ancient Mysteries (4)** — Stonehenge, Great Pyramid of Giza, Noah's Ark, Prehistoric Dinosaurs.
- **🌊 Disasters & Vanishings (4)** — Titanic, Chernobyl Nuclear Disaster, MH370 Mystery, Mary Celeste Ghost Ship.
- **🔬 Science & Nature (3)** — Eyeless Cave Animals, Antarctica Melting Truth, Disease X Global Pandemic.
- **🚀 Space & Engineering (3)** — Apollo 11 Lunar Alarm, Burj Khalifa vs Jeddah Tower, Sacred White Shrouds.

### 4. 📊 Multi-Attribute Sorting
- Latest Releases First
- Most Popular (by View Count)
- Longest Duration (Deep Dive)
- Shortest Duration (Quick Watch)
- Alphabetical (A to Z)

### 5. 🎲 "Mystery Roulette" Interactive Widget
- An interactive recommendation engine that randomly picks an intriguing documentary with sound & animation for indecisive viewers.

### 6. 🔖 Local "Watch Later" Bookmark System
- Viewers can save any documentary to their personalized watch list stored in their browser's `localStorage`.

### 7. 🔗 One-Click Sharing
- Native Web Share API integration with automatic fallback to clipboard copy and toast notifications.

### 8. 🔔 High-Impact Promotional CTAs
- Sticky glowing YouTube Subscribe button in the header.
- Hero spotlight card showcasing the latest premiere.
- Full-width community conversion banner with email alert sign-up.

---

## 📁 File Structure

```text
huzaifa-academy-web/
├── index.html          # Semantic, responsive single-page web app
├── styles.css          # Glassmorphic, cinematic dark-theme CSS design system
├── app.js              # State management, cinema modal, filter & search engine
├── videos-data.js      # Clean, maintainable video catalog with all 14 videos
├── Start-Server.ps1    # Zero-dependency local PowerShell web server
└── README.md           # Documentation & instructions
```

---

## ⚡ How to Run

### Method 1: Direct File Opening (Easiest)
Simply double-click `index.html` in Windows File Explorer or open it in Google Chrome, Microsoft Edge, or any modern browser.

### Method 2: Local HTTP Server (Recommended)
Open PowerShell in the project directory and run:
```powershell
.\Start-Server.ps1
```
This starts a lightweight server at `http://localhost:8080/` and automatically opens your browser.

---

## ➕ How to Add New Videos in the Future

When Huzaifa Academy releases a new video on YouTube, simply open `videos-data.js` and add an object to the `VIDEOS_DATA` array:

```javascript
{
  id: "YOUR_YOUTUBE_VIDEO_ID",
  title: "Your New Documentary Title",
  category: "ancient", // "ancient" | "disaster" | "science" | "engineering"
  categoryLabel: "Ancient Mystery",
  duration: "10:15",
  durationSec: 615,
  views: 100,
  viewsFormatted: "100+ views",
  timeAgo: "Just now",
  badge: "NEW RELEASE",
  isFeatured: true,
  thumbnail: "https://i.ytimg.com/vi/YOUR_YOUTUBE_VIDEO_ID/hqdefault.jpg",
  thumbnailHd: "https://i.ytimg.com/vi/YOUR_YOUTUBE_VIDEO_ID/hq720.jpg",
  synopsis: "Brief description of the mystery or topic covered in the video...",
  tags: ["Tag1", "Tag2", "Urdu Documentary"],
  language: "Urdu / Hindi",
  quality: "1080p Full HD"
}
```

The web app will automatically calculate counts, display badges, and update the catalog!
