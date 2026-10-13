import React from 'react';
import { CheckCircle2, Clock, ArrowDownRight, ArrowUpRight, History } from 'lucide-react';
import { Order } from '../types/market';

interface OrdersHistoryViewProps {
  orders: Order[];
  onSelectStockById: (stockId: string) => void;
}

export const OrdersHistoryView: React.FC<OrdersHistoryViewProps> = ({
  orders,
  onSelectStockById,
}) => {
  const sortedOrders = [...orders].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#00D09C]" />
          <h2 className="text-xl font-extrabold text-white">Order Book & Trade History</h2>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Complete paper trading audit trail with execution prices and timestamps
        </p>
      </div>

      {/* Orders List */}
      {sortedOrders.length === 0 ? (
        <div className="p-12 text-center bg-[#151922] border border-[#232936] rounded-3xl space-y-3">
          <Clock className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Place your first market or limit trade to view your transaction receipts here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {sortedOrders.map((order) => {
            const isBuy = order.side === 'BUY';
            const totalValue = order.quantity * order.executedPrice;
            const dateStr = new Date(order.timestamp).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                onClick={() => onSelectStockById(order.stockId)}
                className="group p-4 bg-[#151922] hover:bg-[#1B212D] border border-[#232936] hover:border-[#333D50] rounded-2xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left: Side Badge & Stock Name */}
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
                    isBuy
                      ? 'bg-[#00D09C]/10 border-[#00D09C]/30 text-[#00D09C]'
                      : 'bg-[#EB5757]/10 border-[#EB5757]/30 text-[#EB5757]'
                  }`}>
                    {isBuy ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-white group-hover:text-[#00D09C] transition-colors">
                        {order.symbol}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isBuy ? 'bg-[#00D09C]/15 text-[#00D09C]' : 'bg-[#EB5757]/15 text-[#EB5757]'
                      }`}>
                        {order.side}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#232936] text-slate-400">
                        {order.productType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {order.quantity} shares @ ₹{order.executedPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Right: Total Value, Timestamp, Status */}
                <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#232936]">
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-slate-400">Traded Value</div>
                    <div className="font-mono text-sm sm:text-base font-bold text-white">
                      ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-[11px] text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>EXECUTED</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      {dateStr}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
