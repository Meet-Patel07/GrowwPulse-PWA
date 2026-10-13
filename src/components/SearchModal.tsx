import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, Star, ArrowRight } from 'lucide-react';
import { Stock } from '../types/market';
import { soundEffects } from '../services/soundEffects';

interface SearchModalProps {
  stocks: Stock[];
  onClose: () => void;
  onSelectStock: (stock: Stock) => void;
  watchlistIds: string[];
  onToggleWatchlist: (stockId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  stocks,
  onClose,
  onSelectStock,
  watchlistIds,
  onToggleWatchlist,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filtered = stocks.filter(s => 
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.sector.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#151922] border border-[#232936] rounded-3xl shadow-2xl overflow-hidden mt-6 sm:mt-12 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-[#232936] bg-[#0B0E14]">
          <Search className="w-5 h-5 text-[#00D09C]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by stock name, symbol (e.g. RELIANCE, ZOMATO)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-[#232936] rounded-xl text-xs font-semibold px-2.5"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="px-5 py-3 border-b border-[#232936] bg-[#121620]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Popular Stocks
            </span>
            <div className="flex flex-wrap gap-2">
              {['RELIANCE', 'TATAMOTORS', 'ZOMATO', 'TCS', 'HDFCBANK', 'INFY'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => {
                    soundEffects.playClick();
                    setQuery(sym);
                  }}
                  className="px-3 py-1 bg-[#1A202C] hover:bg-[#232936] border border-[#232936] rounded-xl text-xs text-slate-300 font-medium transition-all"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 divide-y divide-[#232936]/60">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No stocks found matching "{query}"
            </div>
          ) : (
            filtered.map((stock) => {
              const isPositive = stock.change >= 0;
              const isWatchlisted = watchlistIds.includes(stock.id);

              return (
                <div
                  key={stock.id}
                  onClick={() => {
                    soundEffects.playClick();
                    onSelectStock(stock);
                    onClose();
                  }}
                  className="group flex items-center justify-between p-3.5 hover:bg-[#1C2230] rounded-2xl cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEffects.playClick();
                        onToggleWatchlist(stock.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isWatchlisted
                          ? 'bg-amber-400/15 border-amber-400/40 text-amber-400'
                          : 'border-transparent text-slate-600 hover:text-slate-300'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white group-hover:text-[#00D09C] transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#232936] text-slate-400">
                          {stock.sector}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">
                        {stock.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-white">
                      ₹{stock.currentPrice.toFixed(2)}
                    </div>
                    <div className={`text-xs font-semibold flex items-center justify-end ${
                      isPositive ? 'text-[#00D09C]' : 'text-[#EB5757]'
                    }`}>
                      {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.percentChange.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
