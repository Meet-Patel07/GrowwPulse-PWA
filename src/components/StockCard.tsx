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

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  isWatchlisted,
  onToggleWatchlist,
  onSelectStock,
  onQuickBuy,
}) => {
  const isPositive = stock.change >= 0;

  return (
    <div
      onClick={() => onSelectStock(stock)}
      className="group relative flex flex-col justify-between p-4 bg-[#151922] hover:bg-[#1B212D] border border-[#232936] hover:border-[#333D50] rounded-2xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg"
    >
      {/* Top Header: Symbol, Name, Star */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-white group-hover:text-[#00D09C] transition-colors truncate">
              {stock.symbol}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#232936] text-slate-400 font-medium whitespace-nowrap">
              {stock.sector.split(' ')[0]}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {stock.name}
          </p>
        </div>

        {/* Watchlist Star Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundEffects.playClick();
            onToggleWatchlist(stock.id);
          }}
          className={`p-1.5 rounded-lg border transition-all ${
            isWatchlisted
              ? 'bg-amber-400/15 border-amber-400/40 text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-[#232936]'
          }`}
          title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Middle Section: Sparkline */}
      <div className="my-3 h-9 w-full flex items-center">
        <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
          {(() => {
            const min = Math.min(...stock.sparkline);
            const max = Math.max(...stock.sparkline);
            const range = max - min || 1;
            const points = stock.sparkline
              .map((val, i) => {
                const x = (i / (stock.sparkline.length - 1)) * 98 + 1;
                const y = 28 - ((val - min) / range) * 24;
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polyline
                fill="none"
                stroke={isPositive ? '#00D09C' : '#EB5757'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            );
          })()}
        </svg>
      </div>

      {/* Bottom Section: Real-time Price and Actions */}
      <div className="flex items-end justify-between gap-2 pt-2 border-t border-[#232936]/60">
        <div>
          <div
            className={`font-mono-numbers text-base sm:text-lg font-bold text-white transition-all px-1 -mx-1 rounded ${
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
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-0.5 inline" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {stock.change.toFixed(2)}
            </span>
            <span className="ml-1 text-[11px]">
              ({isPositive ? '+' : ''}
              {stock.percentChange.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Quick Buy CTA */}
        {onQuickBuy && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.playClick();
              onQuickBuy(stock);
            }}
            className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-bold text-black bg-[#00D09C] hover:bg-[#10E7B0] rounded-xl shadow-md shadow-[#00D09C]/15 transition-all"
          >
            Trade
          </button>
        )}
      </div>
    </div>
  );
};
