# 📈 GrowwPulse — Real-Time Stock Market & Trading OS (PWA)

<p align="center">
  <img src="public/favicon.svg" alt="GrowwPulse Logo" width="80" height="80" />
</p>

<p align="center">
  <strong>A Next-Gen, Real-Time Indian Stock Market & Paper Trading Ecosystem inspired by Groww and Zerodha Kite.</strong><br>
  Built as a Progressive Web App (PWA) with live stochastic exchange simulation, Web Audio synthesizer, and instant Netlify deployment.
</p>

<p align="center">
  <a href="https://growwpulsepwa.netlify.app"><img src="https://img.shields.io/badge/Live_Demo-growwpulsepwa.netlify.app-00D09C?style=for-the-badge&logo=netlify&logoColor=black" alt="Netlify Live Demo"></a>
  <a href="https://github.com/Meet-Patel07/GrowwPulse-PWA"><img src="https://img.shields.io/badge/GitHub-GrowwPulse--PWA-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo"></a>
  <img src="https://img.shields.io/badge/PWA-Installable-10E7B0?style=for-the-badge&logo=pwa&logoColor=black" alt="PWA Ready">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

---

## 🌐 Live URLs & Links

- 🚀 **Live App (Netlify)**: [https://growwpulsepwa.netlify.app](https://growwpulsepwa.netlify.app)
- 💻 **GitHub Repository**: [https://github.com/Meet-Patel07/GrowwPulse-PWA](https://github.com/Meet-Patel07/GrowwPulse-PWA)
- 👨‍💻 **Developer**: [Meet Patel (@Meet-Patel07)](https://github.com/Meet-Patel07)

---

## 🌟 Key Features

### 1. ⚡ Live Real-Time Market Feed Engine
- **Stochastic Brownian Motion Engine**: Simulates realistic NSE/BSE tick-by-tick market fluctuations every ~1.6 seconds.
- **Micro-Tick Flash Cues**: Glowing green flash on price upticks and crimson red flash on downticks.
- **Benchmark Indices**: Live NIFTY 50, SENSEX, BANK NIFTY, and NIFTY IT with fluctuating points, percentage changes, and sparklines.
- **Live Stream Controls**: 1-click toggle to pause or resume live stream data anytime.

### 2. 📊 Interactive Charts (Area & Candlestick Modes)
- **Dual Mode Switching**: Toggle seamlessly between **Area Line Chart** (smooth gradient glow) and **Candlestick Chart** (Green/Red bodies with High/Low wicks).
- **Multi-Timeframe Analysis**: `1D`, `1W`, `1M`, `1Y`, `5Y`, and `ALL`.
- **Interactive Crosshairs & Hover Tooltip**: Hover or touch to inspect candle details (Open, High, Low, Close, Volume, and Time).

### 3. 💼 Risk-Free Paper Trading & Portfolio Management
- **₹5,00,000 Starter Virtual Capital**: Practice trading top Indian equities without risking capital.
- **Flexible Order Types**: Execute **Market Orders** (instant) or **Limit Orders** (desired target price).
- **Product Types**: **Delivery (CNC)** for long-term investments and **Intraday (MIS with 5x leverage)** for day trading.
- **Dynamic Live Portfolio Valuation**: Real-time portfolio P&L updates continuously as stock prices tick.
- **Celebration Effects**: Confetti burst animations and procedural audio chimes on successful order execution.

### 4. 🔬 Level-5 Market Depth (Order Book)
- Live **Buyers vs Sellers % Bar** (e.g. 58% Buy vs 42% Sell).
- 5-level Bid vs Ask order depth breakdown displaying real-time quantities, order counts, and prices.

### 5. 🧮 Groww-Style SIP & Wealth Calculator
- Interactive sliders for monthly investment amount, expected return rate, and time horizon.
- Compound Interest & Future Value calculation models.
- **Dual-Arc Visual SVG Donut Chart** showing the exact ratio of Invested Capital vs Capital Gains.

### 6. 🔔 Real-Time Price Target Alerts
- Set custom price triggers (e.g., *Notify when RELIANCE crosses ₹3,000*).
- Real-time in-app floating toast alerts and audio bell chime when targets are achieved.

### 7. 📱 Progressive Web App (PWA) Superpowers
- **Installable Native-Like App**: Prompts users to install GrowwPulse to their home screen on Android, iOS, or Desktop.
- **Offline Capable**: Workbox and Service Worker precache static assets for lightning-fast loads.
- **Mobile-First UX**: Sleek bottom navigation bar, touch-friendly controls, and safe-area inset support.

### 8. 🔊 Web Audio API Procedural Synthesizer
- Zero external MP3 downloads; sounds generated in real-time via the browser's native audio oscillator.
- Uplifting major-triad Buy chime, crisp Sell tone, and tactile click feedback.
- Mute/Unmute sound toggle directly in the header.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 3 (Custom OLED Dark Theme & Glassmorphism)
- **Icons**: Lucide React
- **Animations**: Canvas Confetti & CSS Micro-Interactions
- **PWA & Offline**: Vite Plugin PWA & Workbox
- **Audio**: Web Audio API Procedural Synthesizer
- **Hosting**: Netlify CI/CD

---

## 🚀 Local Development Setup

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

---

## 🌐 Continuous Deployment (Netlify)

This project includes zero-config deployment configurations:
- `netlify.toml`: Defines the build command (`npm run build`), publish directory (`dist`), and headers.
- `public/_redirects`: Handles Single Page Application (SPA) routing for clean URLs.

Every time you push commits to GitHub `main`, Netlify automatically re-builds and deploys the latest version!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<p align="center">
  Made with ❤️ by <a href="https://github.com/Meet-Patel07">Meet Patel</a>
</p>
