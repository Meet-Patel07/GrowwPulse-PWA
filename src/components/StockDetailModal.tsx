import React, { useState } from 'react';
import { 
  X, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Share2
} from 'lucide-react';
import { Stock, TimeFrame, OrderSide } from '../types/market';
import { InteractiveChart } from './InteractiveChart';
import { soundEffects } from '../services/soundEffects';

interface StockDetailModalProps {
  stock: Stock;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (stockId: string) => void;
  onOpenOrder: (stock: Stock, side: OrderSide) => void;
  onOpenCreateAlert: (stock: Stock) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onOpenOrder,
  onOpenCreateAlert,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('1D');
  const isPositive = stock.change >= 0;

  // Calculate position in today's range
  const todayRange = stock.fundamentals.todayHigh - stock.fundamentals.todayLow || 1;
  const todayPosPercent = Math.min(
    100,
    Math.max(0, ((stock.currentPrice - stock.fundamentals.todayLow) / todayRange) * 100)
  );

  // Calculate position in 52-week range
  const yearRange = stock.fundamentals.yearHigh - stock.fundamentals.yearLow || 1;
  const yearPosPercent = Math.min(
    100,
    Math.max(0, ((stock.currentPrice - stock.fundamentals.yearLow) / yearRange) * 100)
  );

  const candles = stock.candles[selectedTimeframe] || stock.candles['1D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0B0E14] border border-[#232936] rounded-3xl shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Navbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-[#151922]/95 backdrop-blur-md border-b border-[#232936]">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">{stock.symbol}</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#232936] text-slate-300 font-semibold">
                  NSE
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#00D09C]/10 text-[#00D09C] border border-[#00D09C]/30 font-semibold">
                  {stock.sector}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{stock.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Create Alert */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenCreateAlert(stock);
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-[#232936] rounded-xl border border-[#232936] transition-all"
              title="Set Price Alert"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Watchlist Star */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onToggleWatchlist(stock.id);
              }}
              className={`p-2 rounded-xl border transition-all ${
                isWatchlisted
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#232936] border-[#232936]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-[#232936] rounded-xl border border-[#232936] transition-all ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Chart Section */}
          <InteractiveChart
            candles={candles}
            timeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            currentPrice={stock.currentPrice}
            prevClose={stock.fundamentals.prevClose}
          />

          {/* Performance Sliders (Today's Low/High & 52-Week Range) */}
          <div className="bg-[#151922] border border-[#232936] rounded-3xl p-5 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00D09C]" />
              Performance & Trading Ranges
            </h3>

            {/* Today's Range Slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                <span>Today's Low: <strong className="text-white font-mono">₹{stock.fundamentals.todayLow.toFixed(2)}</strong></span>
                <span className="font-semibold text-slate-300">Today's Range</span>
                <span>Today's High: <strong className="text-white font-mono">₹{stock.fundamentals.todayHigh.toFixed(2)}</strong></span>
              </div>
              <div className="relative w-full h-2.5 bg-[#232936] rounded-full overflow-visible mt-2">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-[#00D09C] rounded-full"
                  style={{ width: '100%' }}
                />
                {/* Pointer indicator */}
                <div
                  className="absolute -top-1 w-4 h-4 bg-white border-2 border-[#0B0E14] rounded-full shadow -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${todayPosPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                <span>L: ₹{stock.fundamentals.todayLow}</span>
                <span className="text-[#00D09C] font-semibold">Current: ₹{stock.currentPrice}</span>
                <span>H: ₹{stock.fundamentals.todayHigh}</span>
              </div>
            </div>

            {/* 52-Week Range Slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                <span>52W Low: <strong className="text-white font-mono">₹{stock.fundamentals.yearLow.toFixed(2)}</strong></span>
                <span className="font-semibold text-slate-300">52 Week Range</span>
                <span>52W High: <strong className="text-white font-mono">₹{stock.fundamentals.yearHigh.toFixed(2)}</strong></span>
              </div>
              <div className="relative w-full h-2.5 bg-[#232936] rounded-full overflow-visible mt-2">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-[#00D09C] rounded-full"
                  style={{ width: '100%' }}
                />
                <div
                  className="absolute -top-1 w-4 h-4 bg-white border-2 border-[#0B0E14] rounded-full shadow -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${yearPosPercent}%` }}
                />
              </div>
            </div>

            {/* Open / Close / Volume Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#232936]">
              <div className="p-3 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-[11px] text-slate-400">Open Price</div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">₹{stock.fundamentals.openPrice.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-[11px] text-slate-400">Prev. Close</div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">₹{stock.fundamentals.prevClose.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-[11px] text-slate-400">Total Volume</div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">{stock.fundamentals.volume.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-[11px] text-slate-400">Market Cap</div>
                <div className="font-mono text-sm font-bold text-white mt-0.5">{stock.fundamentals.marketCap}</div>
              </div>
            </div>
          </div>

          {/* Market Depth / Order Book (Groww Style) */}
          <div className="bg-[#151922] border border-[#232936] rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00D09C]" />
                Live Market Depth (Order Book)
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Level 5 Market Depth</span>
            </div>

            {/* Buyer vs Seller Progress Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#00D09C]">Buyers: {stock.marketDepth.buyPercentage}%</span>
                <span className="text-[#EB5757]">Sellers: {stock.marketDepth.sellPercentage}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#232936]">
                <div
                  className="h-full bg-[#00D09C] transition-all duration-300"
                  style={{ width: `${stock.marketDepth.buyPercentage}%` }}
                />
                <div
                  className="h-full bg-[#EB5757] transition-all duration-300"
                  style={{ width: `${stock.marketDepth.sellPercentage}%` }}
                />
              </div>
            </div>

            {/* Depth Tables (Bids vs Asks) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Bids (Buy Orders) */}
              <div className="bg-[#0B0E14] rounded-2xl p-3 border border-[#232936]">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 border-b border-[#232936] pb-1.5 mb-1.5">
                  <span>Orders</span>
                  <span>Qty</span>
                  <span className="text-[#00D09C]">Bid Price</span>
                </div>
                {stock.marketDepth.bids.map((b, i) => (
                  <div key={i} className="flex justify-between text-xs font-mono py-1 border-b border-[#1E2433] last:border-0">
                    <span className="text-slate-500">{b.orders}</span>
                    <span className="text-slate-300">{b.quantity.toLocaleString()}</span>
                    <span className="text-[#00D09C] font-semibold">₹{b.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-bold pt-2 text-[#00D09C] border-t border-[#232936] mt-1">
                  <span>Total Bids</span>
                  <span>{stock.marketDepth.buyTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Asks (Sell Orders) */}
              <div className="bg-[#0B0E14] rounded-2xl p-3 border border-[#232936]">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 border-b border-[#232936] pb-1.5 mb-1.5">
                  <span className="text-[#EB5757]">Ask Price</span>
                  <span>Qty</span>
                  <span>Orders</span>
                </div>
                {stock.marketDepth.asks.map((a, i) => (
                  <div key={i} className="flex justify-between text-xs font-mono py-1 border-b border-[#1E2433] last:border-0">
                    <span className="text-[#EB5757] font-semibold">₹{a.price.toFixed(2)}</span>
                    <span className="text-slate-300">{a.quantity.toLocaleString()}</span>
                    <span className="text-slate-500">{a.orders}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-bold pt-2 text-[#EB5757] border-t border-[#232936] mt-1">
                  <span>Total Asks</span>
                  <span>{stock.marketDepth.sellTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fundamentals & Key Ratios */}
          <div className="bg-[#151922] border border-[#232936] rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00D09C]" />
              Fundamentals & Key Financial Ratios
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-xs text-slate-400">P/E Ratio</div>
                <div className="font-mono text-base font-bold text-white mt-1">{stock.fundamentals.peRatio}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ind. PE: {stock.fundamentals.industryPE}</div>
              </div>
              <div className="p-3.5 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-xs text-slate-400">P/B Ratio</div>
                <div className="font-mono text-base font-bold text-white mt-1">{stock.fundamentals.pbRatio}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Price to Book</div>
              </div>
              <div className="p-3.5 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-xs text-slate-400">Return on Equity (ROE)</div>
                <div className="font-mono text-base font-bold text-emerald-400 mt-1">{stock.fundamentals.roe}%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Healthy Returns</div>
              </div>
              <div className="p-3.5 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-xs text-slate-400">Debt to Equity</div>
                <div className="font-mono text-base font-bold text-white mt-1">{stock.fundamentals.debtToEquity}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Leverage metric</div>
              </div>
              <div className="p-3.5 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-xs text-slate-400">Dividend Yield</div>
                <div className="font-mono text-base font-bold text-white mt-1">{stock.fundamentals.divYield}%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Annual dividend</div>
              </div>
              <div className="p-3.5 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-xs text-slate-400">Market Dominance</div>
                <div className="font-mono text-base font-bold text-[#00D09C] mt-1">Tier 1 Leader</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{stock.sector}</div>
              </div>
            </div>
          </div>

          {/* About Company */}
          <div className="bg-[#151922] border border-[#232936] rounded-3xl p-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              About {stock.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {stock.description}
            </p>
          </div>

        </div>

        {/* Sticky Action Footer (BUY & SELL Buttons) */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between gap-3 px-5 py-4 bg-[#151922]/95 backdrop-blur-md border-t border-[#232936]">
          <div className="hidden xs:block">
            <div className="text-[11px] text-slate-400 font-medium">Market Price</div>
            <div className="font-mono text-base font-bold text-white">
              ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full xs:w-auto">
            {/* SELL Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenOrder(stock, 'SELL');
              }}
              className="flex-1 xs:flex-none px-6 sm:px-8 py-3 text-sm font-bold text-white bg-[#EB5757] hover:bg-[#FF6B6B] rounded-2xl shadow-lg shadow-[#EB5757]/20 transition-all active:scale-95"
            >
              SELL
            </button>

            {/* BUY Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenOrder(stock, 'BUY');
              }}
              className="flex-1 xs:flex-none px-8 sm:px-12 py-3 text-sm font-extrabold text-black bg-[#00D09C] hover:bg-[#10E7B0] rounded-2xl shadow-lg shadow-[#00D09C]/25 transition-all active:scale-95"
            >
              BUY
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
