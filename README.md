# 📈 GrowwPulse — Real-Time Indian Stock Market & Trading OS (PWA)

<p align="center">
  <img src="public/favicon.svg" alt="GrowwPulse Logo" width="84" height="84" />
</p>

<p align="center">
  <strong>A 1:1 High-Fidelity Official Groww Explore Replica & Risk-Free Paper Trading OS for Indian Equities.</strong><br>
  Engineered with React 19, TypeScript, Tailwind CSS, live NSE/BSE real-time market feeds, mobile-native slide-up bottom sheets, and Progressive Web App (PWA) offline capabilities.
</p>

<p align="center">
  <a href="https://growwpulsepwa.netlify.app"><img src="https://img.shields.io/badge/Live_App-growwpulsepwa.netlify.app-00D09C?style=for-the-badge&logo=netlify&logoColor=black" alt="Netlify Live Demo"></a>
  <a href="https://github.com/Meet-Patel07/GrowwPulse-PWA"><img src="https://img.shields.io/badge/GitHub-GrowwPulse--PWA-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo"></a>
  <a href="https://groww.in/stocks/user/explore"><img src="https://img.shields.io/badge/Reference_UI-Groww_Explore-00D09C?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Groww Reference"></a>
  <img src="https://img.shields.io/badge/PWA-Installable-10E7B0?style=for-the-badge&logo=pwa&logoColor=black" alt="PWA Ready">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-Modern_Dark_UI-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

---

## 🌐 Live Deployment & Repository Links

- 🚀 **Live Production Application (Netlify)**: [https://growwpulsepwa.netlify.app](https://growwpulsepwa.netlify.app)
- 💻 **Official GitHub Repository**: [https://github.com/Meet-Patel07/GrowwPulse-PWA](https://github.com/Meet-Patel07/GrowwPulse-PWA)
- 🎯 **Official UI & Feature Reference**: [https://groww.in/stocks/user/explore](https://groww.in/stocks/user/explore)
- 👨‍💻 **Architect & Developer**: [Meet Patel (@Meet-Patel07)](https://github.com/Meet-Patel07)

---

## ✨ What is GrowwPulse?

**GrowwPulse** is a cutting-edge, production-ready stock market trading simulation platform built to match the official **Groww Explore Page** (`groww.in/stocks/user/explore`) with **1:1 visual fidelity and interactive functionality**. 

It empowers beginners, retail investors, and seasoned traders to practice real-world Indian equity trading (NSE/BSE) using **₹5,00,000 in virtual capital** with zero financial risk.

---

## 🌟 Key Features & 1:1 Groww Explore UI Replication

### 1. 🧭 Groww Official Navigation Header
- **Groww Branding**: Sleek Groww green leaf emblem with real-time pulsing connectivity dot.
- **Product Sub-Navigation**: Quick tabs for `Stocks`, `Mutual Funds` (SIP Calculator), and `Groww Pay / UPI`.
- **Search Groww Bar**: Search modal triggered via click or keyboard shortcut (`Ctrl + K` / `⌘K`).
- **Terminal Mode Shortcut**: Pro-trader terminal button for quick analysis.
- **Virtual Cash Chip**: Shows live paper balance (`₹5,00,000`) with quick `+ Add` funds trigger.
- **User Profile Circle**: Personalized avatar (`M` for Meet) with online status indicator.

### 2. 📊 Live Benchmark Indices Banner
- Real-time live quotes for **NIFTY 50**, **SENSEX**, **BANK NIFTY**, and **NIFTY IT**.
- Dynamic price updates, points change, percentage moves, and color-coded SVG sparkline curves.
- Groww-style quick-action links on each card: **Option Chain** and **Charts**.
- Smooth horizontal touch-scroll on mobile devices with zero visible scrollbar.

### 3. ⚡ Groww Quick Product Feature Row
Signature circular product icons matching Groww's explore dashboard:
- **F&O**: Futures & Options terminal.
- **IPO**: Active & upcoming IPOs badge (`3 Open`).
- **Intraday**: High momentum momentum stocks with 5x leverage margin.
- **All Stocks**: Complete NSE equity universe screener.
- **ETFs**: Exchange Traded Funds (Nifty BeES, Gold BeES).
- **MTF**: Pay Later Margin Trading Facility with 4x buying power.

### 4. 🔥 "Most Bought on Groww" Carousel
- Live cards spotlighting the most heavily traded companies in the last 24 hours (e.g., Tata Motors, Reliance, Infosys, HDFC Bank).
- Branded company avatar initials, live tick prices, and 1D percentage gain/loss tags.

### 5. 📈 Top Movers by Market Cap
- **Market Cap Filters**: One-click toggles between `Large Cap`, `Mid Cap`, and `Small Cap`.
- **Gainers vs Losers Switcher**: Toggle between `Top Gainers` (Green) and `Top Losers` (Crimson Red).
- Dynamic sorting automatically reflects the highest intraday movers in the selected category.

### 6. 🏢 Top Sectors Overview
- Real-time sectoral indices performance:
  - **Banking & Finance** (*BANK NIFTY*)
  - **Information Tech** (*NIFTY IT*)
  - **Automobiles** (*NIFTY AUTO*)
  - **Energy & Power** (*NIFTY ENERGY*)
  - **FMCG & Retail** (*NIFTY FMCG*)
  - **Pharma & Healthcare** (*NIFTY PHARMA*)
- Clicking any sector instantly filters the equity universe below.

### 7. 📋 Screener with Grid vs Table List View
- **Dual View Mode**: Switch seamlessly between modern **Card Grid View** and official **Groww Table List View** (Company, Sector, Market Price, 1D Change, Quick Buy).
- **Sort Options**: Sort by `Most Popular`, `Highest Gainers`, `Price: High to Low`, and `Price: Low to High`.
- **Micro-Tick Flash Animations**: Subtle green flash on price uptick, red flash on downtick.

### 8. 📱 Native Mobile PWA & Slide-up Bottom Sheets
- **Slide-up Bottom Sheets**: On mobile devices, modals (Stock Details, Order Execution, Add Funds, Alerts) slide up smoothly from the bottom just like native iOS/Android apps.
- **Top Drag Handle Pill**: Tactile rounded drag handle (`w-12 h-1.5`) for intuitive mobile ergonomics.
- **Quick Quantity Chips**: Order window includes instant quantity selectors (`+1`, `+5`, `+10`, `+25`, `+50`, `+100`).
- **Safe-Area Inset Support**: Full compatibility with phone notches and navigation home bars (`pb-safe`).
- **Mobile Bottom Navigation Bar**: Groww-styled bottom menu (`Explore`, `Holdings`, `Watchlist`, `Orders`, `SIP Calc`) with glowing active indicators.

### 9. 💼 Complete Paper Trading & Live Portfolio Engine
- **Starter Capital**: ₹5,00,000 in virtual funds with instant refill and reset capability.
- **Order Types**: **Market Orders** (executed at live price) and **Limit Orders** (executed at user-specified trigger).
- **Product Types**: **Delivery (CNC)** for long-term holding and **Intraday (MIS with 5x leverage)**.
- **Live Dynamic Portfolio Valuation**: Watch your invested capital, current valuation, and total P&L update in real-time as stock prices tick.
- **Celebration Effects**: Confetti bursts and Web Audio API synthesized chimes upon successful order execution.

### 10. 🔬 Level-5 Market Depth (Order Book)
- Live **Buyers vs Sellers % Bar** (e.g., 58% Buy vs 42% Sell).
- 5-level Bid vs Ask breakdown showing real-time quantities, order counts, and prices.

### 11. 🧮 Groww SIP & Wealth Calculator
- Interactive sliders for monthly investment amount, expected annual return rate, and time horizon (years).
- Dual-arc SVG donut chart visualizing Total Invested vs Estimated Wealth Gains.

### 12. 🔔 Real-Time Price Target Alerts
- Set custom breakout triggers (e.g., *Notify when RELIANCE crosses ₹3,000*).
- Real-time in-app notification toasts and audio chimes when breakout levels are achieved.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | TypeScript, Hooks, Concurrent Rendering |
| **Bundler & Tooling** | **Vite 8** | Sub-second HMR, optimized production chunks |
| **Styling & Design System** | **Tailwind CSS 3** | OLED Dark Palette (`#0B0E14`), Glassmorphism, Micro-Animations |
| **Icons** | **Lucide React** | Clean, accessible vector icons |
| **Audio Synthesizer** | **Web Audio API** | 100% procedural oscillator sound generation (zero MP3 files) |
| **Visual Effects** | **Canvas Confetti** | Order execution celebrations |
| **PWA & Offline** | **Vite Plugin PWA & Workbox** | Service worker caching, Web App Manifest, Install Prompt |
| **Hosting & CI/CD** | **Netlify** | Automatic builds on every git commit to `main` |

---

## 🚀 Getting Started Locally

### 1. Clone the repository:
```bash
git clone https://github.com/Meet-Patel07/GrowwPulse-PWA.git
cd GrowwPulse-PWA
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Run development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production:
```bash
npm run build
```
Generates the optimized production build in the `dist` folder.

---

## 🌐 Netlify CI/CD Deployment

This repository is pre-configured for automated Netlify deployment:
- `netlify.toml`: Automates production build (`npm run build`), publish directory (`dist`), and security headers.
- `public/_redirects`: Provides SPA fallback routing (`/* /index.html 200`).

Every commit pushed to the `main` branch automatically triggers a fresh build and live deployment on [https://growwpulsepwa.netlify.app](https://growwpulsepwa.netlify.app).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/Meet-Patel07">Meet Patel</a>
</p>
