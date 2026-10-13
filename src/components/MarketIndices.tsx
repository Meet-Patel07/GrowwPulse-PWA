import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MarketIndex } from '../types/market';

interface MarketIndicesProps {
  indices: MarketIndex[];
  onSelectIndex?: (index: MarketIndex) => void;
}

export const MarketIndices: React.FC<MarketIndicesProps> = ({ indices, onSelectIndex }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-3 px-3 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-3 min-w-max">
        {indices.map((idx) => {
          const isPositive = idx.change >= 0;
          return (
            <div
              key={idx.symbol}
              onClick={() => onSelectIndex?.(idx)}
              className="flex items-center justify-between p-3.5 bg-[#151922] hover:bg-[#1B212D] border border-[#232936] hover:border-[#323B4E] rounded-2xl cursor-pointer transition-all duration-200 min-w-[210px] sm:min-w-[230px] group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                    {idx.symbol}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">INDEX</span>
                </div>
                <div className="mt-1 font-mono-numbers text-base sm:text-lg font-bold text-white tracking-tight">
                  {idx.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div
                    className={`flex items-center text-xs font-semibold ${
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
                    <span className="ml-1 text-[11px]">
                      ({isPositive ? '+' : ''}
                      {idx.percentChange.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini Sparkline SVG */}
              <div className="w-16 h-8 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 70 30" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id={`grad-${idx.symbol}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isPositive ? '#00D09C' : '#EB5757'} stopOpacity="0.4" />
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
                      <>
                        <polyline
                          fill="none"
                          stroke={isPositive ? '#00D09C' : '#EB5757'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
