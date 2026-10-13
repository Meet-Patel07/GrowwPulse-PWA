import React, { useState, useMemo } from 'react';
import { Calculator, Sparkles, TrendingUp, DollarSign, PieChart as PieIcon, ArrowRight } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export const SIPCalculatorModal: React.FC = () => {
  const [calcType, setCalcType] = useState<'SIP' | 'LUMPSUM'>('SIP');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(10000);
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(100000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(13.5);
  const [years, setYears] = useState<number>(10);

  const { investedAmount, estReturns, totalValue, investedPercent, returnPercent } = useMemo(() => {
    const rate = expectedReturnRate / 100;
    const n = years;

    let invested = 0;
    let maturity = 0;

    if (calcType === 'SIP') {
      const p = monthlyAmount;
      const i = rate / 12;
      const totalMonths = n * 12;
      invested = p * totalMonths;
      // Future Value of SIP formula: P * [((1 + i)^n - 1) / i] * (1 + i)
      maturity = p * ((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i);
    } else {
      invested = lumpsumAmount;
      // Compound Interest formula: P * (1 + r)^n
      maturity = invested * Math.pow(1 + rate, n);
    }

    const returns = maturity - invested;
    const invPct = Math.round((invested / maturity) * 100);
    const retPct = 100 - invPct;

    return {
      investedAmount: Math.round(invested),
      estReturns: Math.round(returns),
      totalValue: Math.round(maturity),
      investedPercent: invPct,
      returnPercent: retPct,
    };
  }, [calcType, monthlyAmount, lumpsumAmount, expectedReturnRate, years]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#00D09C]" />
          <h2 className="text-xl font-extrabold text-white">Groww Wealth & SIP Calculator</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#00D09C]/10 text-[#00D09C] border border-[#00D09C]/25 font-semibold">
            PRO COMPOUNDING
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Simulate power of compounding for daily & monthly wealth creation
        </p>
      </div>

      {/* Main Grid: Controls vs Visual Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-7 bg-[#151922] border border-[#232936] rounded-3xl p-5 sm:p-7 space-y-6">
          
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#0B0E14] rounded-2xl border border-[#232936]">
            <button
              onClick={() => {
                soundEffects.playClick();
                setCalcType('SIP');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                calcType === 'SIP'
                  ? 'bg-[#00D09C] text-black shadow-md shadow-[#00D09C]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SIP (Monthly)
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setCalcType('LUMPSUM');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                calcType === 'LUMPSUM'
                  ? 'bg-[#00D09C] text-black shadow-md shadow-[#00D09C]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lumpsum (One-Time)
            </button>
          </div>

          {/* Amount Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300">
                {calcType === 'SIP' ? 'Monthly Investment' : 'Total Investment'}
              </label>
              <div className="px-3 py-1 bg-[#0B0E14] border border-[#232936] rounded-xl font-mono text-sm font-bold text-[#00D09C]">
                ₹{calcType === 'SIP' ? monthlyAmount.toLocaleString('en-IN') : lumpsumAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <input
              type="range"
              min={calcType === 'SIP' ? 500 : 5000}
              max={calcType === 'SIP' ? 100000 : 2000000}
              step={calcType === 'SIP' ? 500 : 5000}
              value={calcType === 'SIP' ? monthlyAmount : lumpsumAmount}
              onChange={(e) => {
                if (calcType === 'SIP') setMonthlyAmount(Number(e.target.value));
                else setLumpsumAmount(Number(e.target.value));
              }}
              className="w-full accent-[#00D09C] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>₹{calcType === 'SIP' ? '500' : '5,000'}</span>
              <span>₹{calcType === 'SIP' ? '1,00,000' : '20,00,000'}</span>
            </div>
          </div>

          {/* Expected Return Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Expected Annual Return Rate (p.a)
              </label>
              <div className="px-3 py-1 bg-[#0B0E14] border border-[#232936] rounded-xl font-mono text-sm font-bold text-white">
                {expectedReturnRate}%
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="0.5"
              value={expectedReturnRate}
              onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
              className="w-full accent-[#00D09C] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>5% (Debt)</span>
              <span>12-15% (Nifty 50)</span>
              <span>25%+ (Mid/Small Cap)</span>
            </div>
          </div>

          {/* Time Horizon */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Investment Time Horizon
              </label>
              <div className="px-3 py-1 bg-[#0B0E14] border border-[#232936] rounded-xl font-mono text-sm font-bold text-white">
                {years} {years === 1 ? 'Year' : 'Years'}
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-[#00D09C] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>35 Years</span>
            </div>
          </div>

        </div>

        {/* Right Column: Visual Donut & Compounding Output */}
        <div className="lg:col-span-5 bg-[#151922] border border-[#232936] rounded-3xl p-5 sm:p-7 flex flex-col justify-between">
          
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Projected Maturity Wealth
            </span>
            <div className="font-mono-numbers text-3xl sm:text-4xl font-black text-white mt-1">
              ₹{totalValue.toLocaleString('en-IN')}
            </div>

            {/* Donut Ratio SVG */}
            <div className="my-6 flex items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#232936"
                    strokeWidth="12"
                  />
                  {/* Invested Amount Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#5367FF"
                    strokeWidth="12"
                    strokeDasharray={`${(investedPercent / 100) * 251.2} 251.2`}
                  />
                  {/* Estimated Return Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#00D09C"
                    strokeWidth="12"
                    strokeDasharray={`${(returnPercent / 100) * 251.2} 251.2`}
                    strokeDashoffset={`-${(investedPercent / 100) * 251.2}`}
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Gains Share</span>
                  <span className="text-2xl font-black text-[#00D09C] font-mono">{returnPercent}%</span>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#5367FF]"></span>
                  <span className="text-xs text-slate-300">Invested Amount</span>
                </div>
                <span className="font-mono text-sm font-bold text-white">
                  ₹{investedAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#00D09C]"></span>
                  <span className="text-xs text-slate-300">Est. Returns (Profit)</span>
                </div>
                <span className="font-mono text-sm font-bold text-[#00D09C]">
                  +₹{estReturns.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#232936] text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Compounding frequency: Monthly • Standard CAGR projections</span>
          </div>

        </div>

      </div>

    </div>
  );
};
