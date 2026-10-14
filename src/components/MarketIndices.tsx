import React from 'react';
import { TrendingUp, TrendingDown, BarChart2, Layers } from 'lucide-react';
import { MarketIndex } from '../types/market';
import { soundEffects } from '../services/soundEffects';

interface MarketIndicesProps {
  indices: MarketIndex[];
  onSelectIndex?: (index: MarketIndex) => void;
}

export const MarketIndices: React.FC<MarketIndicesProps> = ({ indices, onSelectIndex }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-3 px-3 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-3 min-w-max pb-1">
        {indices.map((idx) => {
          const isPositive = idx.change >= 0;
          return (
            <div
              key={idx.symbol}
              onClick={() => {
                soundEffects.playClick();
                onSelectIndex?.(idx);
              }}
              className="flex flex-col justify-between p-3.5 bg-[#121620] hover:bg-[#181E2B] border border-[#202736] hover:border-[#2E384D] rounded-2xl cursor-pointer transition-all duration-200 min-w-[215px] sm:min-w-[240px] group shadow-sm hover:shadow-lg relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div 
                className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity ${
                  isPositive ? 'bg-[#00D09C]' : 'bg-[#EB5757]'
                } opacity-0 group-hover:opacity-100`}
              />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-200 group-hover:text-white transition-colors">
                      {idx.symbol}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1D2433] text-slate-400">
                      NSE
                    </span>
                  </div>
                  
                  <div className="mt-1.5 font-mono-numbers text-base sm:text-lg font-bold text-white tracking-tight">
                    {idx.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div
                      className={`flex items-center text-xs font-bold ${
                        isPositive ? 'text-[#00D09C]' : 'text-[#EB5757]'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {idx.change.toFixed(2)}
                      </span>
                      <span className="ml-1 text-[11px] font-medium">
                        ({isPositive ? '+' : ''}
                        {idx.percentChange.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mini Sparkline SVG */}
                <div className="w-16 h-9 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity mt-1">
                  <svg viewBox="0 0 70 30" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id={`grad-${idx.symbol}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isPositive ? '#00D09C' : '#EB5757'} stopOpacity="0.35" />
                        <stop offset="100%" stopColor={isPositive ? '#00D09C' : '#EB5757'} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const min = Math.min(...idx.sparkline);
                      const max = Math.max(...idx.sparkline);
                      const range = max - min || 1;
                      const points = idx.sparkline
                        .map((val, i) => {
                          const x = (i / (idx.sparkline.length - 1)) * 68 + 1;
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
              </div>

              {/* Groww Quick Action Footer: Option Chain & Charts */}
              <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#1C2330] text-[10px] text-slate-400">
                <span className="flex items-center gap-1 hover:text-[#00D09C] transition-colors">
                  <Layers className="w-3 h-3 text-[#00D09C]" />
                  Option Chain
                </span>
                <span className="flex items-center gap-1 hover:text-white transition-colors">
                  <BarChart2 className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                  Charts
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
