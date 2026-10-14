import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Newspaper, 
  Sparkles, 
  Filter, 
  ChevronRight,
  Zap,
  Building2,
  PieChart,
  Layers,
  Award,
  ArrowUpRight,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react';
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
  const [marketCapFilter, setMarketCapFilter] = useState<'LARGE' | 'MID' | 'SMALL'>('LARGE');
  const [marketMoverTab, setMarketMoverTab] = useState<'GAINERS' | 'LOSERS'>('GAINERS');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_HIGH' | 'PRICE_LOW' | 'CHANGE'>('POPULAR');
  const [activeFeatureModal, setActiveFeatureModal] = useState<string | null>(null);

  const sectors = [
    'ALL',
    'Banking & Finance',
    'Information Tech',
    'Automobiles',
    'Energy & Power',
    'FMCG & Retail',
    'Pharma & Health',
    'Metals & Mining',
  ];

  // Groww Quick Feature Circles definition
  const quickFeatures = [
    { id: 'fno', label: 'F&O', badge: 'Terminal', icon: Zap, color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30' },
    { id: 'ipo', label: 'IPO', badge: '3 Open', icon: Award, color: 'from-emerald-500/20 to-teal-500/10 text-[#00D09C] border-emerald-500/30' },
    { id: 'intraday', label: 'Intraday', badge: '5x Margin', icon: Flame, color: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30' },
    { id: 'screener', label: 'All Stocks', badge: `${stocks.length}+ Live`, icon: LayoutGrid, color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30' },
    { id: 'etf', label: 'ETFs', badge: 'Nifty BeES', icon: Layers, color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30' },
    { id: 'mtf', label: 'MTF (Pay Later)', badge: '4x Buying', icon: PieChart, color: 'from-cyan-500/20 to-sky-500/10 text-cyan-400 border-cyan-500/30' },
  ];

  // Most Bought on Groww: Pick 4 signature high-volume stocks
  const mostBoughtStocks = useMemo(() => {
    const popularSymbols = ['TATAMOTORS', 'RELIANCE', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN'];
    const found = stocks.filter(s => popularSymbols.includes(s.symbol));
    return found.length >= 4 ? found.slice(0, 4) : stocks.slice(0, 4);
  }, [stocks]);

  // Sector breakdown cards with estimated returns
  const topSectors = [
    { name: 'Banking & Finance', indexName: 'BANK NIFTY', returnVal: '+0.85%', count: '12 Stocks', positive: true },
    { name: 'Information Tech', indexName: 'NIFTY IT', returnVal: '+1.42%', count: '8 Stocks', positive: true },
    { name: 'Automobiles', indexName: 'NIFTY AUTO', returnVal: '-0.34%', count: '6 Stocks', positive: false },
    { name: 'Energy & Power', indexName: 'NIFTY ENERGY', returnVal: '+0.62%', count: '7 Stocks', positive: true },
    { name: 'FMCG & Retail', indexName: 'NIFTY FMCG', returnVal: '+0.28%', count: '5 Stocks', positive: true },
    { name: 'Pharma & Health', indexName: 'NIFTY PHARMA', returnVal: '-0.15%', count: '4 Stocks', positive: false },
  ];

  // Top Movers filtered by Market Cap & Gainers/Losers
  const marketMovers = useMemo(() => {
    let pool = [...stocks];
    if (marketCapFilter === 'LARGE') {
      // Top 15 market cap stocks
      pool = pool.slice(0, 16);
    } else if (marketCapFilter === 'MID') {
      // Middle stocks
      pool = pool.slice(12, 28);
    } else {
      // Small cap stocks
      pool = pool.slice(20);
    }

    if (marketMoverTab === 'GAINERS') {
      return pool.sort((a, b) => b.percentChange - a.percentChange).slice(0, 4);
    } else {
      return pool.sort((a, b) => a.percentChange - b.percentChange).slice(0, 4);
    }
  }, [stocks, marketCapFilter, marketMoverTab]);

  // Filtered and sorted Discover Stocks list
  const filteredStocks = useMemo(() => {
    let list = selectedSector === 'ALL'
      ? [...stocks]
      : stocks.filter(s => s.sector.toLowerCase().includes(selectedSector.toLowerCase()) || selectedSector.toLowerCase().includes(s.sector.toLowerCase()));

    if (sortBy === 'PRICE_HIGH') {
      list.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sortBy === 'PRICE_LOW') {
      list.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === 'CHANGE') {
      list.sort((a, b) => b.percentChange - a.percentChange);
    }
    return list;
  }, [stocks, selectedSector, sortBy]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Market Benchmark Indices (Groww Top Bar) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse"></span>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
              Markets Today
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>NSE / BSE Real-Time</span>
          </div>
        </div>
        <MarketIndices indices={indices} />
      </div>

      {/* 2. Groww Quick Feature Row (F&O, IPO, Intraday, Screener, ETFs, MTF) */}
      <div className="bg-[#121620] border border-[#202736] rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.id}
                onClick={() => {
                  soundEffects.playClick();
                  setActiveFeatureModal(feat.label);
                }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0B0E14] hover:bg-[#181E2B] border border-[#1F2533] hover:border-[#2D364A] transition-all group relative overflow-hidden"
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${feat.color} border flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors text-center">
                  {feat.label}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 mt-0.5 whitespace-nowrap">
                  {feat.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Most Bought on Groww (Signature Feature) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span>Most Bought on Groww</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#00D09C]/10 text-[#00D09C] border border-[#00D09C]/30 rounded-full">
                Trending
              </span>
            </h3>
            <p className="text-xs text-slate-400">High trade volume equities in the last 24 hours</p>
          </div>
          <button 
            onClick={() => {
              soundEffects.playClick();
              setSelectedSector('ALL');
            }}
            className="text-xs font-bold text-[#00D09C] hover:underline flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Cards Carousel / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {mostBoughtStocks.map((stock) => (
            <StockCard
              key={`most-bought-${stock.id}`}
              stock={stock}
              isWatchlisted={watchlistIds.includes(stock.id)}
              onToggleWatchlist={onToggleWatchlist}
              onSelectStock={onSelectStock}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </div>
      </div>

      {/* 4. Top Movers by Market Cap (Large, Mid, Small Cap + Gainers/Losers) */}
      <div className="bg-[#121620] border border-[#202736] rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#202736]">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-extrabold text-white">Top Movers</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Ranked by intraday percentage move</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Market Cap Filter Pills: Large, Mid, Small */}
            <div className="flex items-center p-1 bg-[#0B0E14] rounded-xl border border-[#202736]">
              {(['LARGE', 'MID', 'SMALL'] as const).map((cap) => (
                <button
                  key={cap}
                  onClick={() => {
                    soundEffects.playClick();
                    setMarketCapFilter(cap);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    marketCapFilter === cap
                      ? 'bg-[#222A3B] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cap === 'LARGE' ? 'Large Cap' : cap === 'MID' ? 'Mid Cap' : 'Small Cap'}
                </button>
              ))}
            </div>

            {/* Top Gainers vs Top Losers Switcher */}
            <div className="flex items-center p-1 bg-[#0B0E14] rounded-xl border border-[#202736]">
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
        </div>

        {/* 4 Mover Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
          {marketMovers.map((stock) => (
            <StockCard
              key={`mover-${stock.id}`}
              stock={stock}
              isWatchlisted={watchlistIds.includes(stock.id)}
              onToggleWatchlist={onToggleWatchlist}
              onSelectStock={onSelectStock}
              onQuickBuy={onQuickBuy}
            />
          ))}
        </div>
      </div>

      {/* 5. Top Sectors Overview (Groww Signature Feature) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#00D09C]" />
              <span>Top Sectors</span>
            </h3>
            <p className="text-xs text-slate-400">Sectoral indices performance & equities</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {topSectors.map((sector) => (
            <div
              key={sector.name}
              onClick={() => {
                soundEffects.playClick();
                setSelectedSector(sector.name);
              }}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedSector === sector.name
                  ? 'bg-[#182030] border-[#00D09C] shadow-lg shadow-[#00D09C]/10'
                  : 'bg-[#121620] hover:bg-[#181E2B] border-[#202736] hover:border-[#2D364A]'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-400 truncate">{sector.indexName}</div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white truncate mt-0.5">{sector.name.split(' ')[0]}</h4>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1F2533]">
                <span className={`text-xs font-bold ${sector.positive ? 'text-[#00D09C]' : 'text-[#EB5757]'}`}>
                  {sector.returnVal}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{sector.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Discover Equities & Screener Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">All Stocks / Screener</h3>
            <p className="text-xs text-slate-400">Browse all {filteredStocks.length} NSE equities with live tick feeds</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => {
                soundEffects.playClick();
                setSortBy(e.target.value as any);
              }}
              className="bg-[#121620] border border-[#202736] text-xs font-semibold text-slate-300 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-[#2F3A50]"
            >
              <option value="POPULAR">Most Popular</option>
              <option value="CHANGE">Highest Gainers</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="PRICE_LOW">Price: Low to High</option>
            </select>

            {/* Grid vs List View Mode Switcher */}
            <div className="flex items-center p-1 bg-[#121620] border border-[#202736] rounded-xl">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setViewMode('GRID');
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'GRID' ? 'bg-[#222A3B] text-[#00D09C]' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setViewMode('LIST');
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'LIST' ? 'bg-[#222A3B] text-[#00D09C]' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Groww Table List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sector Pills Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => {
                soundEffects.playClick();
                setSelectedSector(sec);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSector === sec
                  ? 'bg-[#00D09C] text-black shadow-sm'
                  : 'bg-[#121620] hover:bg-[#181E2B] text-slate-400 hover:text-slate-200 border border-[#202736]'
              }`}
            >
              {sec === 'ALL' ? 'All Sectors' : sec}
            </button>
          ))}
        </div>

        {/* View Mode: Grid or Groww Table List */}
        {viewMode === 'GRID' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredStocks.map((stock) => (
              <StockCard
                key={`discover-${stock.id}`}
                stock={stock}
                isWatchlisted={watchlistIds.includes(stock.id)}
                onToggleWatchlist={onToggleWatchlist}
                onSelectStock={onSelectStock}
                onQuickBuy={onQuickBuy}
              />
            ))}
          </div>
        ) : (
          /* Groww List / Table View */
          <div className="bg-[#121620] border border-[#202736] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#0B0E14] border-b border-[#202736] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4 text-right">Market Price</th>
                    <th className="py-3 px-4 text-right">1D Change</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B2230]">
                  {filteredStocks.map((stock) => {
                    const isPositive = stock.change >= 0;
                    return (
                      <tr
                        key={`table-${stock.id}`}
                        onClick={() => {
                          soundEffects.playClick();
                          onSelectStock(stock);
                        }}
                        className="hover:bg-[#181E2B] transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-[#1C2333] border border-[#2B354D] flex items-center justify-center font-bold text-xs text-white">
                              {stock.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-extrabold text-white group-hover:text-[#00D09C] transition-colors">
                                {stock.symbol}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">
                                {stock.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {stock.sector}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono-numbers font-bold text-white text-sm">
                          ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-flex items-center font-bold text-xs ${
                              isPositive ? 'text-[#00D09C]' : 'text-[#EB5757]'
                            }`}
                          >
                            {isPositive ? '+' : ''}
                            {stock.change.toFixed(2)} ({isPositive ? '+' : ''}
                            {stock.percentChange.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              soundEffects.playClick();
                              onQuickBuy(stock);
                            }}
                            className="px-3 py-1 text-xs font-bold text-black bg-[#00D09C] hover:bg-[#10E7B0] rounded-lg shadow-sm"
                          >
                            Buy
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 7. Real-Time Market Intelligence & News Wire (Groww Style) */}
      <div className="bg-[#121620] border border-[#202736] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#202736]">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#00D09C]" />
            <h3 className="text-base font-extrabold text-white">News & Market Insights</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Live Feed
          </span>
        </div>

        <div className="space-y-3">
          {MOCK_NEWS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-[#0B0E14] hover:bg-[#181E2B] border border-[#1F2533] hover:border-[#2E374C] rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1C2333] text-slate-300">
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

      {/* Feature Info Modal (F&O, IPO, Intraday, ETFs, MTF) */}
      {activeFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121620] border border-[#202736] rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#202736]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00D09C]" />
                <h3 className="font-extrabold text-lg text-white">{activeFeatureModal} Feature</h3>
              </div>
              <button
                onClick={() => setActiveFeatureModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="py-4 text-sm text-slate-300 leading-relaxed space-y-3">
              <p>
                GrowwPulse provides real-time virtual trading execution for <strong>{activeFeatureModal}</strong> with 0 financial risk.
              </p>
              <div className="p-3 bg-[#0B0E14] border border-[#1F2533] rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#00D09C] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High-Speed NSE Live Execution
                </div>
                <p className="text-slate-400">
                  You can trade equities and intraday positions right now using your virtual capital of ₹5,00,000.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveFeatureModal(null)}
              className="w-full py-2.5 bg-[#00D09C] hover:bg-[#10E7B0] text-black font-extrabold rounded-xl transition-all shadow-md"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
