import React, { useState } from 'react';
import { Star, TrendingUp, TrendingDown, ArrowUpDown, Search, Filter } from 'lucide-react';
import { Stock } from '../types/market';
import { StockCard } from './StockCard';
import { soundEffects } from '../services/soundEffects';

interface WatchlistViewProps {
  allStocks: Stock[];
  watchlistIds: string[];
  onToggleWatchlist: (stockId: string) => void;
  onSelectStock: (stock: Stock) => void;
  onQuickBuy: (stock: Stock) => void;
}

type SortOption = 'DEFAULT' | 'GAINERS' | 'LOSERS' | 'PRICE_HIGH' | 'PRICE_LOW';

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  allStocks,
  watchlistIds,
  onToggleWatchlist,
  onSelectStock,
  onQuickBuy,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('DEFAULT');

  const watchlistedStocks = allStocks.filter(s => watchlistIds.includes(s.id));

  // Filter and sort
  const displayedStocks = watchlistedStocks
    .filter(s => 
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'GAINERS') return b.percentChange - a.percentChange;
      if (sortBy === 'LOSERS') return a.percentChange - b.percentChange;
      if (sortBy === 'PRICE_HIGH') return b.currentPrice - a.currentPrice;
      if (sortBy === 'PRICE_LOW') return a.currentPrice - b.currentPrice;
      return 0;
    });

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-xl font-extrabold text-white">My Watchlist</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#232936] text-slate-300 font-semibold font-mono">
              {watchlistedStocks.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time live prices for your hand-picked priority stocks
          </p>
        </div>

        {/* Filter and Sort Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search in watchlist */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#151922] border border-[#232936] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D09C]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-[#151922] p-1 rounded-xl border border-[#232936]">
            {[
              { id: 'DEFAULT', label: 'All' },
              { id: 'GAINERS', label: 'Top Gainers' },
              { id: 'LOSERS', label: 'Top Losers' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSortBy(tab.id as SortOption);
                }}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  sortBy === tab.id
                    ? 'bg-[#232936] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stocks Grid */}
      {displayedStocks.length === 0 ? (
        <div className="p-12 text-center bg-[#151922] border border-[#232936] rounded-3xl space-y-3">
          <Star className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Star stocks in the Explore tab to monitor their live real-time price movements here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedStocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              isWatchlisted={true}
              onToggleWatchlist={onToggleWatchlist}
              onSelectStock={onSelectStock}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </div>
      )}

    </div>
  );
};
