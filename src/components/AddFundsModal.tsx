import React, { useState } from 'react';
import { X, Wallet, Plus, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../services/soundEffects';

interface AddFundsModalProps {
  currentBalance: number;
  onClose: () => void;
  onAddFunds: (amount: number) => void;
  onResetData: () => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  currentBalance,
  onClose,
  onAddFunds,
  onResetData,
}) => {
  const [customAmount, setCustomAmount] = useState<number>(50000);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleDeposit = (amount: number) => {
    soundEffects.playBuy();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#00D09C', '#10E7B0', '#FFFFFF']
    });
    onAddFunds(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-md bg-[#121620] border-t sm:border border-[#202736] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6">
        
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden -mt-2 mb-3 flex justify-center">
          <div className="w-12 h-1.5 bg-[#2E374A] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#202736]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00D09C]/10 border border-[#00D09C]/30 text-[#00D09C]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Paper Trading Wallet</h3>
              <p className="text-xs text-slate-400">Risk-free virtual market funds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#202736] rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Hero */}
        <div className="my-5 p-4 bg-[#0B0E14] rounded-2xl border border-[#202736] text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold">Available Paper Balance</span>
          <div className="font-mono text-3xl font-black text-white mt-1">
            ₹{currentBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center justify-center gap-1 mt-1 text-[11px] text-[#00D09C] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Capital Ready for Trading</span>
          </div>
        </div>

        {/* Quick Add Chips */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Add Funds
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[25000, 50000, 100000, 200000, 500000, 1000000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleDeposit(amt)}
                className="py-2.5 px-2 bg-[#0B0E14] hover:bg-[#181E2B] border border-[#202736] hover:border-[#00D09C]/50 rounded-xl text-xs font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-[#00D09C]" />
                <span>₹{(amt / 1000).toFixed(0)}k</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Form */}
        <div className="mt-4">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Custom Amount
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">₹</span>
              <input
                type="number"
                step="5000"
                value={customAmount || ''}
                onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2 bg-[#0B0E14] border border-[#202736] focus:border-[#00D09C] rounded-xl text-white font-mono text-sm font-bold"
              />
            </div>
            <button
              onClick={() => handleDeposit(customAmount)}
              className="px-4 py-2 bg-[#00D09C] hover:bg-[#10E7B0] text-black text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95"
            >
              Deposit
            </button>
          </div>
        </div>

        {/* Reset All Trading Simulation Data */}
        <div className="mt-6 pt-4 border-t border-[#202736] flex items-center justify-between">
          <div className="text-left">
            <div className="text-xs font-bold text-slate-300">Reset Simulator</div>
            <div className="text-[10px] text-slate-500">Restore default ₹5 Lakh & clear orders</div>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 bg-[#0B0E14] hover:bg-red-500/10 border border-[#202736] hover:border-red-500/30 rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                  onClose();
                }}
                className="px-3 py-1 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
