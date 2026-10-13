# 📈 GrowwPulse — Real-Time Stock Market & Trading OS (PWA)

A cutting-edge, real-time Indian Stock Market application and paper trading ecosystem inspired by **Groww** and **Zerodha Kite**, engineered as a full **Progressive Web App (PWA)** ready for 1-click Netlify deployment.

---

## 🌟 Key Features

### 1. ⚡ Live Real-Time Market Feed Engine
- **Live Exchange Tickers**: High-precision stochastic Brownian motion simulating NSE/BSE real-time market ticks every ~1.6 seconds.
- **Micro-Tick Flash Animations**: Glowing green flash on price uptick, red flash on price downtick.
- **Benchmark Indices**: NIFTY 50, SENSEX, BANK NIFTY, and NIFTY IT with live fluctuating points, percentages, and sparklines.
- **Live Stream Control**: Toggle live feed streaming or pause anytime.

### 2. 📊 Interactive Charts (Area & Candlestick)
- Dual mode switcher: **Area Line Chart** (smooth gradient glow) & **Candlestick Chart** (Green/Red bodies with High/Low wicks).
- Timeframes: **1D, 1W, 1M, 1Y, 5Y, ALL**.
- Interactive Crosshair: Hover/touch inspects exact candle price, high, low, open, close, and volume.

### 3. 💼 Risk-Free Paper Trading & Portfolio Management
- **₹5,00,000 Starter Virtual Capital**: Practice trading real-world equities without risking capital.
- **Order Types**: Market Orders & Limit Orders.
- **Product Types**: Delivery (CNC - Long term) & Intraday (MIS - 5x Leverage margin).
- **Live Dynamic Portfolio Valuation**: Watch portfolio P&L fluctuate in real-time as stock prices tick!
- **Celebration Effects**: Confetti bursts & procedural Web Audio chimes on order execution.

### 4. 🔬 Level-5 Market Depth (Order Book)
- Live Bid vs Ask order depth bar showing real-time buyers vs sellers percentage (e.g. 58% Buy vs 42% Sell).
- 5-level bid/ask order book breakdown with order counts, volume, and prices.

### 5. 🧮 Groww SIP & Lumpsum Wealth Calculator
- Interactive sliders for monthly investment, expected return rate, and time horizon.
- Compound Interest & Future Value formulas.
- Dynamic dual-arc SVG donut chart visualizing Invested vs Gains.

### 6. 🔔 Real-Time Price Target Alerts
- Set custom price triggers (e.g. *Notify when RELIANCE crosses ₹3,000*).
- Real-time in-app notification toasts and audio chimes when breakout targets are achieved.

### 7. 📱 Progressive Web App (PWA) Superpowers
- **Installable**: Adds directly to phone home screen or desktop application menu.
- **Offline Capable**: Service worker caching allows viewing watchlist and offline functionality.
- **Mobile-First UX**: Sleek bottom navigation bar, touch-optimized, safe-area inset support.

### 8. 🔊 Web Audio API Procedural Synthesizer
- Zero external MP3 downloads; sounds generated directly via browser audio oscillators.
- Uplifting ascending Buy chime, crisp Sell tone, and subtle tactile clicks.
- 1-click sound toggle to mute/unmute.

---

## 🚀 Getting Started

### Run Locally:
```bash
npm install
npm run dev
```

### Build for Production:
```bash
npm run build
```

---

## 🌐 Deploying to Netlify (Live in 60 Seconds)

### Method 1: Netlify Drop (Drag & Drop)
1. Run `npm run build` — this generates the optimized production bundle inside the `dist` folder.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist` folder into the upload box.
4. Your PWA will be live instantly with a free HTTPS URL!

### Method 2: Git Repository Deploy
1. Push this folder to GitHub / GitLab.
2. Connect your repo in Netlify:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Netlify will automatically build and deploy every commit using the included `netlify.toml`.
