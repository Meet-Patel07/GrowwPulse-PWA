import React from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Stock } from '../types/market';
import { soundEffects } from '../services/soundEffects';

interface StockCardProps {
  stock: Stock;
  isWatchlisted: boolean;
  onToggleWatchlist: (stockId: string) => void;
  onSelectStock: (stock: Stock) => void;
  onQuickBuy?: (stock: Stock) => void;
}

// Generate consistent avatar color from stock symbol
const getAvatarGradient = (symbol: string) => {
  const colors = [
    'from-blue-600/30 to-indigo-600/20 text-blue-400 border-blue-500/30',
    'from-emerald-600/30 to-teal-600/20 text-emerald-400 border-emerald-500/30',
    'from-amber-600/30 to-orange-600/20 text-amber-400 border-amber-500/30',
    'from-purple-600/30 to-pink-600/20 text-purple-400 border-purple-500/30',
    'from-rose-600/30 to-red-600/20 text-rose-400 border-rose-500/30',
    'from-cyan-600/30 to-sky-600/20 text-cyan-400 border-cyan-500/30',
  ];
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  isWatchlisted,
  onToggleWatchlist,
  onSelectStock,
  onQuickBuy,
}) => {
  const isPositive = stock.change >= 0;
  const avatarStyle = getAvatarGradient(stock.symbol);

  return (
    <div
      onClick={() => {
        soundEffects.playClick();
        onSelectStock(stock);
      }}
      className="group relative flex flex-col justify-between p-4 bg-[#121620] hover:bg-[#181E2B] border border-[#202736] hover:border-[#2F3A50] rounded-2xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-xl hover:-translate-y-0.5"
    >
      {/* Top Header: Company Avatar, Symbol, Sector, Star */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Groww-style Logo/Avatar Circle */}
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${avatarStyle} border flex items-center justify-center font-extrabold text-sm shrink-0 shadow-inner`}>
            {stock.symbol.slice(0, 2)}
          </div>

          <div className="min-w-0">
            <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-[#00D09C] transition-colors truncate leading-tight">
              {stock.symbol}
            </h4>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 leading-tight">
              {stock.name}
            </p>
          </div>
        </div>

        {/* Watchlist Star Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundEffects.playClick();
            onToggleWatchlist(stock.id);
          }}
          className={`p-1.5 rounded-xl border transition-all shrink-0 ${
            isWatchlisted
              ? 'bg-amber-400/15 border-amber-400/40 text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-[#1E2535]'
          }`}
          title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Middle Section: Sparkline Curve */}
      <div className="my-3.5 h-8 w-full flex items-center">
        <svg viewBox="0 0 100 28" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`grad-stock-${stock.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? '#00D09C' : '#EB5757'} stopOpacity="0.25" />
              <stop offset="100%" stopColor={isPositive ? '#00D09C' : '#EB5757'} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {(() => {
            const min = Math.min(...stock.sparkline);
            const max = Math.max(...stock.sparkline);
            const range = max - min || 1;
            const points = stock.sparkline
              .map((val, i) => {
                const x = (i / (stock.sparkline.length - 1)) * 98 + 1;
                const y = 26 - ((val - min) / range) * 22;
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polyline
                fill="none"
                stroke={isPositive ? '#00D09C' : '#EB5757'}
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            );
          })()}
        </svg>
      </div>

      {/* Bottom Section: Real-time Price and Actions */}
      <div className="flex items-end justify-between gap-2 pt-2 border-t border-[#1C2330]">
        <div>
          <div
            className={`font-mono-numbers text-base sm:text-lg font-bold text-white transition-all rounded ${
              stock.lastTickDirection === 'up'
                ? 'flash-up text-[#00D09C]'
                : stock.lastTickDirection === 'down'
                ? 'flash-down text-[#EB5757]'
                : ''
            }`}
          >
            ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div
            className={`flex items-center text-xs font-semibold mt-0.5 ${
              isPositive ? 'text-[#00D09C]' : 'text-[#EB5757]'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 shrink-0 inline" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-0.5 shrink-0 inline" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {stock.change.toFixed(2)}
            </span>
            <span className="ml-1 text-[11px] font-medium">
              ({isPositive ? '+' : ''}
              {stock.percentChange.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Quick Trade CTA Button */}
        {onQuickBuy && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.playClick();
              onQuickBuy(stock);
            }}
            className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-bold text-black bg-[#00D09C] hover:bg-[#10E7B0] rounded-xl shadow-md shadow-[#00D09C]/15 transition-all active:scale-95"
          >
            Buy
          </button>
        )}
      </div>
    </div>
  );
};
