import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Briefcase, Plus, PieChart } from 'lucide-react';
import { Holding, Stock } from '../types/market';
import { soundEffects } from '../services/soundEffects';

interface HoldingsViewProps {
  holdings: Holding[];
  onSelectStockById: (stockId: string) => void;
  onSellHolding: (stockId: string) => void;
  onExploreClick: () => void;
}

export const HoldingsView: React.FC<HoldingsViewProps> = ({
  holdings,
  onSelectStockById,
  onSellHolding,
  onExploreClick,
}) => {
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalReturns = totalCurrent - totalInvested;
  const totalReturnPercent = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  const totalDayPnL = holdings.reduce((sum, h) => sum + h.dayPnL, 0);

  const isTotalProfit = totalReturns >= 0;
  const isDayProfit = totalDayPnL >= 0;

  return (
    <div className="space-y-6">
      
      {/* Portfolio Performance Summary Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#151922] via-[#1A202C] to-[#121620] border border-[#232936] rounded-3xl p-5 sm:p-7 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#00D09C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#232936]/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Briefcase className="w-4 h-4 text-[#00D09C]" />
                <span>My Portfolio Valuation</span>
              </div>
              <div className="font-mono-numbers text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
                ₹{totalCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Total Returns Badge */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-[11px] text-slate-400">Total Returns</div>
                <div className={`font-mono text-sm sm:text-base font-bold flex items-center ${
                  isTotalProfit ? 'text-[#00D09C]' : 'text-[#EB5757]'
                }`}>
                  {isTotalProfit ? <TrendingUp className="w-4 h-4 mr-1 inline" /> : <TrendingDown className="w-4 h-4 mr-1 inline" />}
                  {isTotalProfit ? '+' : ''}₹{Math.abs(totalReturns).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs ml-1 font-semibold">({isTotalProfit ? '+' : ''}{totalReturnPercent.toFixed(2)}%)</span>
                </div>
              </div>

              <div className="p-3 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="text-[11px] text-slate-400">1-Day Returns</div>
                <div className={`font-mono text-sm sm:text-base font-bold flex items-center ${
                  isDayProfit ? 'text-[#00D09C]' : 'text-[#EB5757]'
                }`}>
                  {isDayProfit ? '+' : ''}₹{Math.abs(totalDayPnL).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Invested Amount & Holdings count */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div>
              <span className="text-slate-400">Total Invested</span>
              <div className="font-mono text-base font-bold text-slate-200 mt-0.5">
                ₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Active Companies</span>
              <div className="font-mono text-base font-bold text-slate-200 mt-0.5">
                {holdings.length} {holdings.length === 1 ? 'Stock' : 'Stocks'}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400">Portfolio Status</span>
              <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse"></span>
                <span>Live Real-Time P&L</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Holdings List Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-lg font-extrabold text-white">Your Stock Holdings</h2>
          <p className="text-xs text-slate-400">Real-time valuation based on live exchange ticks</p>
        </div>
      </div>

      {/* Holdings List or Empty State */}
      {holdings.length === 0 ? (
        <div className="p-12 text-center bg-[#151922] border border-[#232936] rounded-3xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#00D09C]/10 flex items-center justify-center text-[#00D09C]">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Holdings in Portfolio</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              You haven't bought any stocks yet. Use your virtual paper cash to place your first trade risk-free!
            </p>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onExploreClick();
            }}
            className="px-6 py-2.5 text-xs font-bold text-black bg-[#00D09C] hover:bg-[#10E7B0] rounded-xl shadow-md transition-all"
          >
            Explore & Trade Stocks
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {holdings.map((holding) => {
            const isProfit = holding.totalPnL >= 0;
            return (
              <div
                key={holding.stockId}
                onClick={() => onSelectStockById(holding.stockId)}
                className="group p-4 bg-[#151922] hover:bg-[#1B212D] border border-[#232936] hover:border-[#333D50] rounded-2xl cursor-pointer transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Stock Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-white group-hover:text-[#00D09C] transition-colors">
                      {holding.symbol}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#232936] text-slate-300 font-semibold">
                      {holding.quantity} shares
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#00D09C]/10 text-[#00D09C]">
                      {holding.sector}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                    <span>Avg: ₹{holding.averageBuyPrice.toFixed(2)}</span>
                    <span>•</span>
                    <span>LTP: <strong className="text-slate-200">₹{holding.currentPrice.toFixed(2)}</strong></span>
                  </div>
                </div>

                {/* Values & P&L */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#232936]">
                  <div>
                    <div className="text-[11px] text-slate-400 text-left sm:text-right">Current Value</div>
                    <div className="font-mono text-sm sm:text-base font-bold text-white">
                      ₹{holding.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="text-right min-w-[110px]">
                    <div className="text-[11px] text-slate-400">Total P&L</div>
                    <div className={`font-mono text-sm sm:text-base font-bold flex items-center justify-end ${
                      isProfit ? 'text-[#00D09C]' : 'text-[#EB5757]'
                    }`}>
                      {isProfit ? '+' : ''}₹{holding.totalPnL.toFixed(2)}
                      <span className="text-[11px] ml-1 font-semibold">({isProfit ? '+' : ''}{holding.percentPnL.toFixed(2)}%)</span>
                    </div>
                  </div>

                  {/* Quick Sell CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEffects.playClick();
                      onSellHolding(holding.stockId);
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-[#EB5757] hover:text-white bg-[#EB5757]/10 hover:bg-[#EB5757] border border-[#EB5757]/30 rounded-xl transition-all"
                  >
                    Sell
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
