import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Flame, Newspaper, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { Stock, MarketIndex, MarketNews } from '../types/market';
import { MarketIndices } from './MarketIndices';
import { StockCard } from './StockCard';
import { MOCK_NEWS } from '../data/mockStocks';
import { soundEffects } from '../services/soundEffects';

interface ExploreViewProps {
  stocks: Stock[];
  indices: MarketIndex[];
  watchlistIds: string[];
  onToggleWatchlist: (stockId: string) => void;
  onSelectStock: (stock: Stock) => void;
  onQuickBuy: (stock: Stock) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  stocks,
  indices,
  watchlistIds,
  onToggleWatchlist,
  onSelectStock,
  onQuickBuy,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [marketMoverTab, setMarketMoverTab] = useState<'GAINERS' | 'LOSERS'>('GAINERS');

  const sectors = [
    'ALL',
    'Banking & Finance',
    'Information Tech',
    'Automobiles',
    'Energy & Power',
    'FMCG & Retail',
    'Consumer Internet',
    'Metals & Mining',
    'Pharma & Health',
    'Infrastructure',
    'Telecom & Defense',
    'Chemicals & Paints',
  ];

  // Filtered by sector
  const filteredStocks = selectedSector === 'ALL'
    ? stocks
    : stocks.filter(s => s.sector.includes(selectedSector));

  // Top Gainers & Losers
  const topGainers = [...stocks].sort((a, b) => b.percentChange - a.percentChange).slice(0, 4);
  const topLosers = [...stocks].sort((a, b) => a.percentChange - b.percentChange).slice(0, 4);

  return (
    <div className="space-y-7">
      
      {/* 1. Market Benchmark Indices */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse"></span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Market Indices</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">Live NSE/BSE Feeds</span>
        </div>
        <MarketIndices indices={indices} />
      </div>

      {/* 2. Top Movers (Gainers vs Losers) */}
      <div className="bg-[#151922] border border-[#232936] rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#232936]">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">Market Movers</h3>
          </div>

          <div className="flex items-center gap-1 bg-[#0B0E14] p-1 rounded-xl border border-[#232936]">
            <button
              onClick={() => {
                soundEffects.playClick();
                setMarketMoverTab('GAINERS');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                marketMoverTab === 'GAINERS'
                  ? 'bg-[#00D09C] text-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Top Gainers</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setMarketMoverTab('LOSERS');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                marketMoverTab === 'LOSERS'
                  ? 'bg-[#EB5757] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Top Losers</span>
            </button>
          </div>
        </div>

        {/* 4 Mover Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {(marketMoverTab === 'GAINERS' ? topGainers : topLosers).map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              isWatchlisted={watchlistIds.includes(stock.id)}
              onToggleWatchlist={onToggleWatchlist}
              onSelectStock={onSelectStock}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </div>
      </div>

      {/* 3. Explore All Stocks with Sector Filters */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white">Discover Equities</h3>
            <p className="text-xs text-slate-400">Large-cap & high-growth leaders on National Stock Exchange</p>
          </div>

          {/* Sector Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedSector(sec);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSector === sec
                    ? 'bg-[#232936] text-white border border-slate-500 shadow-sm'
                    : 'bg-[#151922] text-slate-400 hover:text-slate-200 border border-[#232936]'
                }`}
              >
                {sec === 'ALL' ? 'All Sectors' : sec}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              isWatchlisted={watchlistIds.includes(stock.id)}
              onToggleWatchlist={onToggleWatchlist}
              onSelectStock={onSelectStock}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </div>
      </div>

      {/* 4. Real-time Market News Stream (Groww Style) */}
      <div className="bg-[#151922] border border-[#232936] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#00D09C]" />
            <h3 className="text-base font-extrabold text-white">Market Intelligence & News Wire</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Live updates</span>
        </div>

        <div className="space-y-3">
          {MOCK_NEWS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-[#0B0E14] hover:bg-[#1A202C] border border-[#232936] rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#232936] text-slate-300">
                    {item.category}
                  </span>
                  {item.relatedSymbol && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#00D09C]/15 text-[#00D09C]">
                      ${item.relatedSymbol}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500">{item.timeAgo}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {item.headline}
                </h4>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center text-xs text-slate-400 group-hover:text-[#00D09C] transition-colors">
                <span className="font-medium text-[11px]">{item.source}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
