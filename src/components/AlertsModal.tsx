import React, { useState } from 'react';
import { X, Bell, Plus, CheckCircle2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { PriceAlert, Stock } from '../types/market';
import { soundEffects } from '../services/soundEffects';

interface AlertsModalProps {
  alerts: PriceAlert[];
  allStocks: Stock[];
  preselectedStock?: Stock | null;
  onClose: () => void;
  onAddAlert: (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlert: (alertId: string) => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  alerts,
  allStocks,
  preselectedStock,
  onClose,
  onAddAlert,
  onDeleteAlert,
}) => {
  const [selectedStockId, setSelectedStockId] = useState<string>(
    preselectedStock ? preselectedStock.id : (allStocks[0]?.id || '')
  );
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [targetPrice, setTargetPrice] = useState<number>(
    preselectedStock ? Math.round(preselectedStock.currentPrice * 1.02) : 1000
  );

  const selectedStock = allStocks.find(s => s.id === selectedStockId) || allStocks[0];

  const handleStockChange = (stockId: string) => {
    setSelectedStockId(stockId);
    const stk = allStocks.find(s => s.id === stockId);
    if (stk) {
      setTargetPrice(Math.round(stk.currentPrice * (condition === 'ABOVE' ? 1.02 : 0.98)));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock || targetPrice <= 0) return;

    soundEffects.playClick();
    onAddAlert({
      stockId: selectedStock.id,
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      targetPrice,
      condition,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-lg bg-[#121620] border-t sm:border border-[#202736] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6">
        
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden -mt-2 mb-3 flex justify-center">
          <div className="w-12 h-1.5 bg-[#2E374A] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#202736]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Price Target Triggers</h3>
              <p className="text-xs text-slate-400">Real-time alerts when stocks cross levels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#202736] rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form to create new Alert */}
        <form onSubmit={handleCreate} className="mt-4 p-4 bg-[#0B0E14] rounded-2xl border border-[#202736] space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-[#00D09C]" />
            <span>Create Alert Trigger</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Select Stock</label>
              <select
                value={selectedStockId}
                onChange={(e) => handleStockChange(e.target.value)}
                className="w-full bg-[#121620] border border-[#202736] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#00D09C]"
              >
                {allStocks.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.symbol} (₹{s.currentPrice.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Condition</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setCondition('ABOVE')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                    condition === 'ABOVE'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-[#121620] border-[#202736] text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Crosses &gt;</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('BELOW')}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1 transition-all ${
                    condition === 'BELOW'
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                      : 'bg-[#121620] border-[#202736] text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Falls &lt;</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">₹</span>
              <input
                type="number"
                step="0.5"
                value={targetPrice || ''}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                placeholder="Target Price"
                className="w-full pl-8 pr-3 py-2 bg-[#121620] border border-[#202736] focus:border-[#00D09C] rounded-xl text-white font-mono text-sm font-bold"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00D09C] hover:bg-[#10E7B0] text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95"
            >
              Set Alert
            </button>
          </div>
        </form>

        {/* Active Alerts List */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Configured Alerts ({alerts.length})
          </span>

          {alerts.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No price triggers set yet. Pick a stock above to track its breakout levels.
            </div>
          ) : (
            alerts.map((al) => (
              <div
                key={al.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  al.triggered
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-[#0B0E14] border-[#202736]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl border ${
                      al.triggered
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-[#182030] border-[#2B354D] text-slate-400'
                    }`}
                  >
                    {al.triggered ? <CheckCircle2 className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">{al.symbol}</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {al.condition === 'ABOVE' ? 'Above' : 'Below'} ₹{al.targetPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {al.triggered ? 'Triggered live in market!' : 'Watching tick by tick...'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onDeleteAlert(al.id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
