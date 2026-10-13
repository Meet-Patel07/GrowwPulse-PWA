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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#151922] border border-[#232936] rounded-3xl shadow-2xl p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
          <div className="flex items-center gap-2">
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
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#232936] rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Hero */}
        <div className="my-5 p-4 bg-[#0B0E14] rounded-2xl border border-[#232936] text-center">
          <span className="text-xs text-slate-400 uppercase font-semibold">Available Paper Balance</span>
          <div className="font-mono text-3xl font-black text-white mt-1">
            ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Ready for real-time stock executions</p>
        </div>

        {/* Quick Deposit Amount Chips */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Add Paper Funds
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[25000, 50000, 100000, 500000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleDeposit(amt)}
                className="p-3 bg-[#1C2230] hover:bg-[#252E40] border border-[#232936] hover:border-[#00D09C]/50 rounded-2xl text-left transition-all group"
              >
                <div className="font-mono text-sm font-bold text-white group-hover:text-[#00D09C]">
                  + ₹{amt.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Instant Deposit</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Form */}
        <div className="mt-4">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Custom Amount (₹)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1000"
              step="5000"
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="flex-1 px-4 py-2.5 bg-[#0B0E14] border border-[#232936] focus:border-[#00D09C] rounded-xl text-white font-mono text-sm font-bold"
            />
            <button
              onClick={() => handleDeposit(customAmount)}
              className="px-5 py-2.5 bg-[#00D09C] hover:bg-[#10E7B0] text-black font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              Add Cash
            </button>
          </div>
        </div>

        {/* Reset All Data Section */}
        <div className="mt-6 pt-4 border-t border-[#232936]">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Portfolio & History to Factory Default</span>
            </button>
          ) : (
            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-2xl space-y-2 text-center">
              <p className="text-xs text-red-300 font-medium">Are you sure? This will reset all holdings and orders.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-1.5 bg-[#232936] text-xs font-semibold text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onResetData();
                    onClose();
                  }}
                  className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-xs font-bold text-white rounded-xl"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
