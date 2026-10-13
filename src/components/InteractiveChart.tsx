import React, { useState, useRef, useMemo } from 'react';
import { CandleData, TimeFrame, ChartType } from '../types/market';
import { TrendingUp, BarChart2, LineChart as LineIcon } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface InteractiveChartProps {
  candles: CandleData[];
  timeframe: TimeFrame;
  onTimeframeChange: (tf: TimeFrame) => void;
  currentPrice: number;
  prevClose: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  candles,
  timeframe,
  onTimeframeChange,
  currentPrice,
  prevClose,
}) => {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const TIMEFRAMES: TimeFrame[] = ['1D', '1W', '1M', '1Y', '5Y', 'ALL'];

  const { minPrice, maxPrice, priceRange, isPositiveTrend } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return { minPrice: 0, maxPrice: 100, priceRange: 100, isPositiveTrend: true };
    }
    const lows = candles.map(c => c.low);
    const highs = candles.map(c => c.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const buffer = (max - min) * 0.08 || 1;
    const isUp = (candles[candles.length - 1]?.close || 0) >= (candles[0]?.open || 0);

    return {
      minPrice: min - buffer,
      maxPrice: max + buffer,
      priceRange: max - min + buffer * 2,
      isPositiveTrend: isUp,
    };
  }, [candles]);

  const chartColor = isPositiveTrend ? '#00D09C' : '#EB5757';

  // Mouse move handler for crosshairs
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !candles || candles.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const index = Math.min(
      candles.length - 1,
      Math.max(0, Math.floor((x / rect.width) * candles.length))
    );
    setHoveredCandle(candles[index]);
    setHoverPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
    setHoverPosition(null);
  };

  // SVG Area path generator
  const areaPath = useMemo(() => {
    if (!candles || candles.length === 0) return { linePath: '', fullArea: '' };
    const width = 1000;
    const height = 400;

    const points = candles.map((c, i) => {
      const x = (i / (candles.length - 1)) * width;
      const y = height - ((c.close - minPrice) / priceRange) * height;
      return `${x},${y}`;
    });

    const linePath = `M ${points.join(' L ')}`;
    const fullArea = `${linePath} L ${width},${height} L 0,${height} Z`;
    return { linePath, fullArea };
  }, [candles, minPrice, priceRange]);

  const displayCandle = hoveredCandle || candles[candles.length - 1];

  return (
    <div className="w-full bg-[#151922] border border-[#232936] rounded-3xl p-4 sm:p-6 select-none shadow-xl">
      
      {/* Top Chart Header: Active Price, Date/Time, OHLC Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232936]">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-numbers text-2xl sm:text-3xl font-extrabold text-white">
              ₹{((displayCandle?.close || currentPrice)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs sm:text-sm font-bold ${isPositiveTrend ? 'text-[#00D09C]' : 'text-[#EB5757]'}`}>
              {displayCandle ? (
                <>
                  {displayCandle.close >= prevClose ? '+' : ''}
                  {(displayCandle.close - prevClose).toFixed(2)} (
                  {(((displayCandle.close - prevClose) / prevClose) * 100).toFixed(2)}%)
                </>
              ) : null}
            </span>
          </div>

          {/* Time & OHLC Bar */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-400">
            <span>Time: <strong className="text-slate-200">{displayCandle?.time || '--'}</strong></span>
            <span>O: <strong className="text-slate-200">₹{displayCandle?.open?.toFixed(2)}</strong></span>
            <span>H: <strong className="text-emerald-400">₹{displayCandle?.high?.toFixed(2)}</strong></span>
            <span>L: <strong className="text-red-400">₹{displayCandle?.low?.toFixed(2)}</strong></span>
            <span>Vol: <strong className="text-slate-200">{(displayCandle?.volume || 0).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Chart Style Switcher (Area vs Candlestick) */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#0B0E14] p-1 rounded-xl border border-[#232936]">
          <button
            onClick={() => {
              soundEffects.playClick();
              setChartType('area');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'area'
                ? 'bg-[#232936] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineIcon className="w-3.5 h-3.5 text-[#00D09C]" />
            <span className="hidden xs:inline">Line</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setChartType('candle');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'candle'
                ? 'bg-[#232936] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Candles</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Chart Canvas Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[260px] sm:h-[340px] mt-4 cursor-crosshair overflow-hidden"
      >
        {/* Horizontal grid lines with price markers */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-dashed border-slate-400 w-full flex justify-end">
            <span className="text-[10px] text-slate-400 pr-1 -mt-3.5 font-mono">₹{maxPrice.toFixed(1)}</span>
          </div>
          <div className="border-b border-dashed border-slate-400 w-full flex justify-end">
            <span className="text-[10px] text-slate-400 pr-1 -mt-3.5 font-mono">₹{((maxPrice + minPrice) / 2).toFixed(1)}</span>
          </div>
          <div className="border-b border-dashed border-slate-400 w-full flex justify-end">
            <span className="text-[10px] text-slate-400 pr-1 -mt-3.5 font-mono">₹{minPrice.toFixed(1)}</span>
          </div>
        </div>

        {/* Render Chart */}
        {chartType === 'area' ? (
          <svg
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity="0.35" />
                <stop offset="100%" stopColor={chartColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Fill Area */}
            <path d={areaPath.fullArea} fill="url(#areaGradient)" />

            {/* Stroke Line */}
            <path
              d={areaPath.linePath}
              fill="none"
              stroke={chartColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          /* Candlestick Visualization */
          <svg
            viewBox={`0 0 ${candles.length * 14} 400`}
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {candles.map((c, i) => {
              const x = i * 14 + 7;
              const isGreen = c.close >= c.open;
              const color = isGreen ? '#00D09C' : '#EB5757';

              const yHigh = 400 - ((c.high - minPrice) / priceRange) * 400;
              const yLow = 400 - ((c.low - minPrice) / priceRange) * 400;
              const yOpen = 400 - ((c.open - minPrice) / priceRange) * 400;
              const yClose = 400 - ((c.close - minPrice) / priceRange) * 400;

              const candleTop = Math.min(yOpen, yClose);
              const candleHeight = Math.max(3, Math.abs(yOpen - yClose));

              return (
                <g key={i}>
                  {/* Wick line */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.5"
                  />
                  {/* Candle body */}
                  <rect
                    x={x - 4.5}
                    y={candleTop}
                    width="9"
                    height={candleHeight}
                    fill={color}
                    rx="1.5"
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Crosshair Overlay on Hover */}
        {hoverPosition && (
          <>
            {/* Vertical crosshair line */}
            <div
              className="absolute top-0 bottom-0 border-l border-dashed border-slate-400/80 pointer-events-none"
              style={{ left: `${hoverPosition.x}px` }}
            />
            {/* Horizontal crosshair line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-slate-400/80 pointer-events-none"
              style={{ top: `${hoverPosition.y}px` }}
            />
            {/* Floating Price Tooltip */}
            <div
              className="absolute pointer-events-none px-2 py-1 bg-[#0B0E14] border border-[#00D09C] rounded text-[11px] font-mono text-white shadow-xl -translate-y-1/2"
              style={{
                left: `${Math.min(hoverPosition.x + 12, (containerRef.current?.clientWidth || 300) - 80)}px`,
                top: `${hoverPosition.y}px`,
              }}
            >
              ₹{hoveredCandle?.close.toFixed(2)}
            </div>
          </>
        )}
      </div>

      {/* Timeframe Selector Buttons (1D, 1W, 1M, 1Y, 5Y, ALL) */}
      <div className="flex items-center justify-between gap-1 mt-4 pt-3 border-t border-[#232936]">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar w-full justify-between sm:justify-start">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => {
                soundEffects.playClick();
                onTimeframeChange(tf);
              }}
              className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                timeframe === tf
                  ? 'bg-[#00D09C] text-black shadow-md shadow-[#00D09C]/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E2433]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center text-[11px] text-slate-500 font-medium">
          Live streaming ticks • Auto-refresh
        </div>
      </div>

    </div>
  );
};
