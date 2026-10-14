import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Zap, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Stock, OrderSide, OrderType, ProductType, Order } from '../types/market';
import { soundEffects } from '../services/soundEffects';

interface OrderModalProps {
  stock: Stock;
  initialSide: OrderSide;
  availableBalance: number;
  userHoldingsQuantity: number;
  onClose: () => void;
  onExecuteOrder: (order: Omit<Order, 'id' | 'timestamp'>) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  stock,
  initialSide,
  availableBalance,
  userHoldingsQuantity,
  onClose,
  onExecuteOrder,
}) => {
  const [side, setSide] = useState<OrderSide>(initialSide);
  const [productType, setProductType] = useState<ProductType>('DELIVERY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<number>(stock.currentPrice);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const execPrice = orderType === 'MARKET' ? stock.currentPrice : limitPrice;
  const leverageMultiplier = productType === 'INTRADAY' ? 0.2 : 1; // 5x leverage for intraday
  const requiredAmount = Number((quantity * execPrice * leverageMultiplier).toFixed(2));
  
  const hasEnoughFunds = side === 'BUY' ? availableBalance >= requiredAmount : true;
  const hasEnoughShares = side === 'SELL' ? userHoldingsQuantity >= quantity : true;
  const canExecute = quantity > 0 && execPrice > 0 && (side === 'BUY' ? hasEnoughFunds : hasEnoughShares);

  const handleExecute = () => {
    if (!canExecute) return;

    if (side === 'BUY') {
      soundEffects.playBuy();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00D09C', '#10E7B0', '#FFFFFF', '#FFD700']
      });
    } else {
      soundEffects.playSell();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#EB5757', '#FF6B6B', '#FFFFFF']
      });
    }

    onExecuteOrder({
      stockId: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      side,
      orderType,
      productType,
      quantity,
      price: execPrice,
      executedPrice: execPrice,
      status: 'EXECUTED',
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-md bg-[#121620] border-t sm:border border-[#202736] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6">
        
        {/* Mobile Drag Indicator Pill */}
        <div className="sm:hidden -mt-2 mb-3 flex justify-center">
          <div className="w-12 h-1.5 bg-[#2E374A] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#202736]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1C2333] border border-[#2B354D] flex items-center justify-center font-bold text-xs text-white">
              {stock.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">{stock.symbol}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  side === 'BUY' ? 'bg-[#00D09C]/15 text-[#00D09C]' : 'bg-[#EB5757]/15 text-[#EB5757]'
                }`}>
                  {side}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">NSE • Live: ₹{stock.currentPrice.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#232936] rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side Toggle: BUY vs SELL */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-[#0B0E14] rounded-2xl border border-[#202736]">
          <button
            onClick={() => {
              soundEffects.playClick();
              setSide('BUY');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              side === 'BUY'
                ? 'bg-[#00D09C] text-black shadow-md shadow-[#00D09C]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BUY
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setSide('SELL');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              side === 'SELL'
                ? 'bg-[#EB5757] text-white shadow-md shadow-[#EB5757]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SELL
          </button>
        </div>

        {/* Product Type (Delivery vs Intraday) */}
        <div className="mt-4">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Product Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setProductType('DELIVERY');
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                productType === 'DELIVERY'
                  ? 'bg-[#00D09C]/10 border-[#00D09C]/40 text-white shadow-sm'
                  : 'bg-[#0B0E14] border-[#202736] text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold text-white">Delivery (CNC)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Cash & Carry • Hold forever</div>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setProductType('INTRADAY');
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                productType === 'INTRADAY'
                  ? 'bg-amber-400/10 border-amber-400/40 text-white shadow-sm'
                  : 'bg-[#0B0E14] border-[#202736] text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Intraday (MIS)</span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-400/15 px-1.5 py-0.2 rounded">5x Margin</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Auto-square off at 3:15 PM</div>
            </button>
          </div>
        </div>

        {/* Quantity Input with quick increments */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quantity (Shares)
            </label>
            {side === 'SELL' && (
              <span className="text-xs text-slate-400">
                You own: <strong className="text-white font-mono">{userHoldingsQuantity}</strong>
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={quantity || ''}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-2.5 bg-[#0B0E14] border border-[#202736] focus:border-[#00D09C] focus:outline-none rounded-xl text-white font-mono text-base font-bold"
            />
            <span className="absolute right-3.5 top-3 text-xs text-slate-500 font-semibold">Qty</span>
          </div>

          {/* Quick Quantity Chips */}
          <div className="flex items-center gap-1.5 mt-2">
            {[1, 5, 10, 25, 50, 100].map((num) => (
              <button
                key={num}
                onClick={() => {
                  soundEffects.playClick();
                  setQuantity(num);
                }}
                className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                  quantity === num
                    ? 'bg-[#222A3B] border-slate-500 text-white'
                    : 'bg-[#0B0E14] border-[#202736] text-slate-400 hover:text-white'
                }`}
              >
                +{num}
              </button>
            ))}
          </div>
        </div>

        {/* Order Type (Market vs Limit) */}
        <div className="mt-4">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Price Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                setOrderType('MARKET');
              }}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                orderType === 'MARKET'
                  ? 'bg-[#222A3B] border-slate-500 text-white'
                  : 'bg-[#0B0E14] border-[#202736] text-slate-400 hover:text-white'
              }`}
            >
              Market (At Live Price)
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setOrderType('LIMIT');
              }}
              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                orderType === 'LIMIT'
                  ? 'bg-[#222A3B] border-slate-500 text-white'
                  : 'bg-[#0B0E14] border-[#202736] text-slate-400 hover:text-white'
              }`}
            >
              Limit (Set Desired Price)
            </button>
          </div>

          {orderType === 'LIMIT' && (
            <div className="mt-2 relative">
              <input
                type="number"
                step="0.05"
                value={limitPrice}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-[#0B0E14] border border-[#202736] focus:border-[#00D09C] rounded-xl text-white font-mono text-sm"
                placeholder="Limit Price"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-500 font-semibold">₹</span>
            </div>
          )}
        </div>

        {/* Calculation Summary & Balance Verification */}
        <div className="mt-4 p-3.5 bg-[#0B0E14] rounded-2xl border border-[#202736] space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Execution Price</span>
            <span className="font-mono text-white">₹{execPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Required Margin</span>
            <span className="font-mono text-white font-bold">₹{requiredAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#202736]">
            <span className="text-slate-400">Available Paper Cash</span>
            <span className={`font-mono font-bold ${hasEnoughFunds ? 'text-[#00D09C]' : 'text-red-400'}`}>
              ₹{availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Validation Messages */}
          {side === 'BUY' && !hasEnoughFunds && (
            <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-semibold pt-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Insufficient virtual cash. Add funds to proceed.</span>
            </div>
          )}
          {side === 'SELL' && !hasEnoughShares && (
            <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-semibold pt-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>You do not own enough shares to sell.</span>
            </div>
          )}
        </div>

        {/* Execute Button */}
        <button
          disabled={!canExecute || isSuccess}
          onClick={handleExecute}
          className={`w-full mt-4 py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
            isSuccess
              ? 'bg-[#00D09C] text-black shadow-lg shadow-[#00D09C]/30'
              : canExecute
              ? side === 'BUY'
                ? 'bg-[#00D09C] hover:bg-[#10E7B0] text-black shadow-lg shadow-[#00D09C]/25 active:scale-95'
                : 'bg-[#EB5757] hover:bg-[#FF6B6B] text-white shadow-lg shadow-[#EB5757]/25 active:scale-95'
              : 'bg-[#202736] text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-black animate-bounce" />
              <span>ORDER EXECUTED!</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>PLACE {side} ORDER • ₹{requiredAmount.toLocaleString('en-IN')}</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
