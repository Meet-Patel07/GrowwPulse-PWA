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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#151922] border border-[#232936] rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Live Price Target Alerts</h3>
              <p className="text-xs text-slate-400">Get real-time audio and visual triggers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#232936] rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          
          {/* Create Alert Form */}
          <form onSubmit={handleCreate} className="p-4 bg-[#0B0E14] rounded-2xl border border-[#232936] space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#00D09C]" />
              <span>Set New Price Target</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Select Stock</label>
                <select
                  value={selectedStockId}
                  onChange={(e) => handleStockChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#151922] border border-[#232936] rounded-xl text-xs text-white focus:outline-none focus:border-[#00D09C]"
                >
                  {allStocks.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.symbol} (₹{s.currentPrice.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Trigger Condition</label>
                <div className="grid grid-cols-2 gap-1 bg-[#151922] p-1 rounded-xl border border-[#232936]">
                  <button
                    type="button"
                    onClick={() => setCondition('ABOVE')}
                    className={`py-1 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                      condition === 'ABOVE'
                        ? 'bg-[#00D09C] text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ArrowUp className="w-3 h-3" /> Crosses Above
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition('BELOW')}
                    className={`py-1 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                      condition === 'BELOW'
                        ? 'bg-[#EB5757] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ArrowDown className="w-3 h-3" /> Drops Below
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Target Price (₹) • Current LTP: ₹{selectedStock?.currentPrice.toFixed(2)}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3.5 py-2 bg-[#151922] border border-[#232936] rounded-xl text-sm font-mono font-bold text-white focus:border-[#00D09C] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00D09C] hover:bg-[#10E7B0] text-black font-extrabold text-xs rounded-xl shadow-md transition-all"
                >
                  Save Alert
                </button>
              </div>
            </div>
          </form>

          {/* Active Alerts List */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Active Triggers ({alerts.length})
            </span>
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-[#0B0E14] rounded-2xl border border-[#232936]">
                No price alerts set. Create one above to track price breakouts!
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 bg-[#0B0E14] border border-[#232936] rounded-2xl"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${
                        alert.triggered
                          ? 'bg-emerald-400/10 text-emerald-400'
                          : 'bg-amber-400/10 text-amber-400'
                      }`}>
                        {alert.triggered ? <CheckCircle2 className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-white">{alert.symbol}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            alert.condition === 'ABOVE' ? 'bg-[#00D09C]/15 text-[#00D09C]' : 'bg-[#EB5757]/15 text-[#EB5757]'
                          }`}>
                            {alert.condition === 'ABOVE' ? '≥' : '≤'} ₹{alert.targetPrice}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {alert.triggered ? 'TRIGGERED! Target achieved.' : 'Monitoring real-time stream...'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteAlert(alert.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
