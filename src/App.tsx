import React, { useState, useEffect, useCallback } from 'react';
import { Stock, MarketIndex, Order, Holding, PriceAlert, OrderSide } from './types/market';
import { marketEngine } from './services/marketEngine';
import { storage } from './services/storage';
import { Header } from './components/Header';
import { ExploreView } from './components/ExploreView';
import { HoldingsView } from './components/HoldingsView';
import { WatchlistView } from './components/WatchlistView';
import { OrdersHistoryView } from './components/OrdersHistoryView';
import { SIPCalculatorModal } from './components/SIPCalculatorModal';
import { StockDetailModal } from './components/StockDetailModal';
import { OrderModal } from './components/OrderModal';
import { SearchModal } from './components/SearchModal';
import { AddFundsModal } from './components/AddFundsModal';
import { AlertsModal } from './components/AlertsModal';
import { BottomNav } from './components/BottomNav';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { Bell, CheckCircle2, TrendingUp, X } from 'lucide-react';
import { soundEffects } from './services/soundEffects';

export function App() {
  // Real-time market state
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLive, setIsLive] = useState<boolean>(true);

  // User state
  const [balance, setBalance] = useState<number>(() => storage.getBalance());
  const [holdings, setHoldings] = useState<Holding[]>(() => storage.getHoldings());
  const [orders, setOrders] = useState<Order[]>(() => storage.getOrders());
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => storage.getWatchlist());
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => storage.getAlerts());

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [orderModalData, setOrderModalData] = useState<{ stock: Stock; side: OrderSide } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [alertTargetStock, setAlertTargetStock] = useState<Stock | null>(null);

  // Live Toast for Triggered Alert
  const [toastAlert, setToastAlert] = useState<{ alert: PriceAlert; price: number } | null>(null);

  // 1. Subscribe to Real-Time Market Feed
  useEffect(() => {
    marketEngine.setAlerts(alerts);
    const unsubscribeMarket = marketEngine.subscribe(({ stocks: newStocks, indices: newIndices }) => {
      setStocks(newStocks);
      setIndices(newIndices);

      // Dynamically recalculate user portfolio values based on live ticking prices!
      setHoldings((prevHoldings) => {
        const updated = prevHoldings.map((h) => {
          const matchingStock = newStocks.find((s) => s.id === h.stockId);
          if (!matchingStock) return h;
          const currentPrice = matchingStock.currentPrice;
          const currentValue = Number((h.quantity * currentPrice).toFixed(2));
          const totalPnL = Number((currentValue - h.investedValue).toFixed(2));
          const percentPnL = Number(((totalPnL / h.investedValue) * 100).toFixed(2));
          const dayPnL = Number((h.quantity * matchingStock.change).toFixed(2));

          return {
            ...h,
            currentPrice,
            currentValue,
            totalPnL,
            percentPnL,
            dayPnL,
          };
        });
        storage.setHoldings(updated);
        return updated;
      });

      // Keep selectedStock up to date if currently open in detail modal
      setSelectedStock((prev) => {
        if (!prev) return null;
        return newStocks.find((s) => s.id === prev.id) || prev;
      });
    });

    const unsubscribeAlerts = marketEngine.onAlertTrigger((alert, currentPrice) => {
      setToastAlert({ alert, price: currentPrice });
      setAlerts((prev) => {
        const updated = prev.map((a) => (a.id === alert.id ? { ...a, triggered: true } : a));
        storage.setAlerts(updated);
        return updated;
      });
    });

    return () => {
      unsubscribeMarket();
      unsubscribeAlerts();
    };
  }, []);

  // Sync active alerts with market engine whenever alerts change
  useEffect(() => {
    marketEngine.setAlerts(alerts);
  }, [alerts]);

  // Keyboard shortcut for quick search (/ or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Watchlist Toggle
  const handleToggleWatchlist = useCallback((stockId: string) => {
    setWatchlistIds((prev) => {
      const exists = prev.includes(stockId);
      const next = exists ? prev.filter((id) => id !== stockId) : [...prev, stockId];
      storage.setWatchlist(next);
      return next;
    });
  }, []);

  // Add Virtual Funds
  const handleAddFunds = useCallback((amount: number) => {
    setBalance((prev) => {
      const next = prev + amount;
      storage.setBalance(next);
      return next;
    });
  }, []);

  // Reset Data
  const handleResetData = useCallback(() => {
    storage.resetAllData();
    setBalance(storage.getBalance());
    setHoldings(storage.getHoldings());
    setOrders(storage.getOrders());
    setWatchlistIds(storage.getWatchlist());
    setAlerts(storage.getAlerts());
    soundEffects.playClick();
  }, []);

  // Execute Order (Buy / Sell)
  const handleExecuteOrder = useCallback(
    (orderData: Omit<Order, 'id' | 'timestamp'>) => {
      const orderId = `ord-${Date.now()}`;
      const newOrder: Order = {
        ...orderData,
        id: orderId,
        timestamp: Date.now(),
      };

      // 1. Update Orders list
      const nextOrders = [newOrder, ...orders];
      setOrders(nextOrders);
      storage.setOrders(nextOrders);

      // 2. Update Holdings and Wallet Balance
      const totalAmount = newOrder.quantity * newOrder.executedPrice;

      if (newOrder.side === 'BUY') {
        const nextBalance = balance - totalAmount;
        setBalance(nextBalance);
        storage.setBalance(nextBalance);

        // Update Holdings
        setHoldings((prev) => {
          const existing = prev.find((h) => h.stockId === newOrder.stockId);
          let updated: Holding[];
          if (existing) {
            const nextQty = existing.quantity + newOrder.quantity;
            const nextInvested = existing.investedValue + totalAmount;
            const avgPrice = Number((nextInvested / nextQty).toFixed(2));
            const currentVal = Number((nextQty * newOrder.executedPrice).toFixed(2));
            const totalPnL = Number((currentVal - nextInvested).toFixed(2));
            const percentPnL = Number(((totalPnL / nextInvested) * 100).toFixed(2));

            updated = prev.map((h) =>
              h.stockId === newOrder.stockId
                ? {
                    ...h,
                    quantity: nextQty,
                    averageBuyPrice: avgPrice,
                    investedValue: nextInvested,
                    currentValue: currentVal,
                    totalPnL,
                    percentPnL,
                  }
                : h
            );
          } else {
            const matchingStock = stocks.find((s) => s.id === newOrder.stockId);
            const newHolding: Holding = {
              stockId: newOrder.stockId,
              symbol: newOrder.symbol,
              name: newOrder.name,
              quantity: newOrder.quantity,
              averageBuyPrice: newOrder.executedPrice,
              currentPrice: newOrder.executedPrice,
              investedValue: totalAmount,
              currentValue: totalAmount,
              totalPnL: 0,
              percentPnL: 0,
              dayPnL: 0,
              sector: matchingStock?.sector || 'Equities',
            };
            updated = [newHolding, ...prev];
          }
          storage.setHoldings(updated);
          return updated;
        });
      } else {
        // SELL
        const nextBalance = balance + totalAmount;
        setBalance(nextBalance);
        storage.setBalance(nextBalance);

        // Reduce holding
        setHoldings((prev) => {
          const existing = prev.find((h) => h.stockId === newOrder.stockId);
          if (!existing) return prev;
          let updated: Holding[];
          if (existing.quantity <= newOrder.quantity) {
            updated = prev.filter((h) => h.stockId !== newOrder.stockId);
          } else {
            const nextQty = existing.quantity - newOrder.quantity;
            const nextInvested = existing.averageBuyPrice * nextQty;
            const currentVal = Number((nextQty * newOrder.executedPrice).toFixed(2));
            const totalPnL = Number((currentVal - nextInvested).toFixed(2));
            const percentPnL = Number(((totalPnL / nextInvested) * 100).toFixed(2));

            updated = prev.map((h) =>
              h.stockId === newOrder.stockId
                ? {
                    ...h,
                    quantity: nextQty,
                    investedValue: nextInvested,
                    currentValue: currentVal,
                    totalPnL,
                    percentPnL,
                  }
                : h
            );
          }
          storage.setHoldings(updated);
          return updated;
        });
      }
    },
    [balance, orders, stocks]
  );

  // Add Alert
  const handleAddAlert = useCallback(
    (newAlertData: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => {
      const newAlert: PriceAlert = {
        ...newAlertData,
        id: `alt-${Date.now()}`,
        createdAt: Date.now(),
        triggered: false,
      };
      const updated = [newAlert, ...alerts];
      setAlerts(updated);
      storage.setAlerts(updated);
      setIsAlertsOpen(false);
    },
    [alerts]
  );

  // Delete Alert
  const handleDeleteAlert = useCallback((alertId: string) => {
    setAlerts((prev) => {
      const updated = prev.filter((a) => a.id !== alertId);
      storage.setAlerts(updated);
      return updated;
    });
  }, []);

  const unreadAlertsCount = alerts.filter((a) => a.triggered).length;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans pb-20 md:pb-8">
      
      {/* 1. Header */}
      <Header
        balance={balance}
        onOpenAddFunds={() => setIsAddFundsOpen(true)}
        onOpenAlerts={() => {
          setAlertTargetStock(null);
          setIsAlertsOpen(true);
        }}
        unreadAlertsCount={unreadAlertsCount}
        onSearchClick={() => setIsSearchOpen(true)}
        isLive={isLive}
        onToggleLive={() => setIsLive(marketEngine.toggleLive())}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* 2. Main Tab View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-7">
        {activeTab === 'explore' && (
          <ExploreView
            stocks={stocks}
            indices={indices}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectStock={setSelectedStock}
            onQuickBuy={(stock) => setOrderModalData({ stock, side: 'BUY' })}
          />
        )}

        {activeTab === 'holdings' && (
          <HoldingsView
            holdings={holdings}
            onSelectStockById={(stockId) => {
              const stk = stocks.find((s) => s.id === stockId);
              if (stk) setSelectedStock(stk);
            }}
            onSellHolding={(stockId) => {
              const stk = stocks.find((s) => s.id === stockId);
              if (stk) setOrderModalData({ stock: stk, side: 'SELL' });
            }}
            onExploreClick={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView
            allStocks={stocks}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectStock={setSelectedStock}
            onQuickBuy={(stock) => setOrderModalData({ stock, side: 'BUY' })}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersHistoryView
            orders={orders}
            onSelectStockById={(stockId) => {
              const stk = stocks.find((s) => s.id === stockId);
              if (stk) setSelectedStock(stk);
            }}
          />
        )}

        {activeTab === 'sip' && <SIPCalculatorModal />}
      </main>

      {/* 3. Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        holdingsCount={holdings.length}
      />

      {/* 4. PWA Install Prompt Banner */}
      <PWAInstallPrompt />

      {/* 5. Stock Detail Modal */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          isWatchlisted={watchlistIds.includes(selectedStock.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onOpenOrder={(stock, side) => {
            setSelectedStock(null);
            setOrderModalData({ stock, side });
          }}
          onOpenCreateAlert={(stock) => {
            setAlertTargetStock(stock);
            setIsAlertsOpen(true);
          }}
        />
      )}

      {/* 6. Buy / Sell Execution Modal */}
      {orderModalData && (
        <OrderModal
          stock={orderModalData.stock}
          initialSide={orderModalData.side}
          availableBalance={balance}
          userHoldingsQuantity={
            holdings.find((h) => h.stockId === orderModalData.stock.id)?.quantity || 0
          }
          onClose={() => setOrderModalData(null)}
          onExecuteOrder={handleExecuteOrder}
        />
      )}

      {/* 7. Quick Search Modal */}
      {isSearchOpen && (
        <SearchModal
          stocks={stocks}
          onClose={() => setIsSearchOpen(false)}
          onSelectStock={setSelectedStock}
          watchlistIds={watchlistIds}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {/* 8. Add Funds Modal */}
      {isAddFundsOpen && (
        <AddFundsModal
          currentBalance={balance}
          onClose={() => setIsAddFundsOpen(false)}
          onAddFunds={handleAddFunds}
          onResetData={handleResetData}
        />
      )}

      {/* 9. Alerts Modal */}
      {isAlertsOpen && (
        <AlertsModal
          alerts={alerts}
          allStocks={stocks}
          preselectedStock={alertTargetStock}
          onClose={() => setIsAlertsOpen(false)}
          onAddAlert={handleAddAlert}
          onDeleteAlert={handleDeleteAlert}
        />
      )}

      {/* 10. Floating Real-Time Alert Toast */}
      {toastAlert && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-[#151922] border-2 border-emerald-400 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-400/20 text-[#00D09C] rounded-xl">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-white">PRICE ALERT TRIGGERED!</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  <strong>{toastAlert.alert.symbol}</strong> hit target ₹{toastAlert.alert.targetPrice.toFixed(2)} (Now: ₹{toastAlert.price.toFixed(2)})
                </div>
              </div>
            </div>
            <button
              onClick={() => setToastAlert(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
export default App;
