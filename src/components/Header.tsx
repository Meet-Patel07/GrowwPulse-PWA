import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  Wallet, 
  Bell, 
  Volume2, 
  VolumeX, 
  Radio, 
  Plus, 
  RotateCcw,
  Sparkles,
  Command
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface HeaderProps {
  balance: number;
  onOpenAddFunds: () => void;
  onOpenAlerts: () => void;
  unreadAlertsCount: number;
  onSearchClick: () => void;
  isLive: boolean;
  isRealApiConnected?: boolean;
  onToggleLive: () => void;
  onSelectTab: (tab: string) => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  balance,
  onOpenAddFunds,
  onOpenAlerts,
  unreadAlertsCount,
  onSearchClick,
  isLive,
  isRealApiConnected = false,
  onToggleLive,
  onSelectTab,
  activeTab,
}) => {
  const [isMuted, setIsMuted] = useState(soundEffects.getMuted());
  const [marketStatus, setMarketStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');

  useEffect(() => {
    // Current IST check or standard market hours indicator
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay();
    if (day === 0 || day === 6 || hours < 9 || hours >= 16) {
      setMarketStatus('OPEN'); // In paper trading / demo app mode, market simulator stays active
    }
  }, []);

  const handleToggleMute = () => {
    const next = !isMuted;
    soundEffects.setMuted(next);
    setIsMuted(next);
    if (!next) soundEffects.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0E14]/90 backdrop-blur-xl border-b border-[#232936] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('explore')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D09C]/20 to-[#00D09C]/5 border border-[#00D09C]/40 shadow-lg shadow-[#00D09C]/10">
              <TrendingUp className="w-6 h-6 text-[#00D09C]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-[#00D09C]' : 'bg-amber-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLive ? 'bg-[#00D09C]' : 'bg-amber-400'}`}></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  Groww<span className="text-[#00D09C]">Pulse</span>
                </span>
                <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold bg-[#00D09C]/10 text-[#00D09C] border border-[#00D09C]/25 rounded">
                  PWA
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D09C] animate-pulse"></span>
                <span className="text-emerald-400 font-semibold">{isRealApiConnected ? 'NSE / BSE LIVE API' : 'NSE / BSE LIVE'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-medium">Real-Time Quotes</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#151922] p-1 rounded-xl border border-[#232936]">
            {[
              { id: 'explore', label: 'Explore' },
              { id: 'holdings', label: 'Holdings' },
              { id: 'watchlist', label: 'Watchlist' },
              { id: 'orders', label: 'Orders' },
              { id: 'sip', label: 'SIP Calculator' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundEffects.playClick();
                  onSelectTab(item.id);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-[#00D09C] text-black shadow-md shadow-[#00D09C]/20'
                    : 'text-slate-300 hover:text-white hover:bg-[#1E2433]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search Trigger Button */}
          <div className="flex-1 max-w-xs hidden lg:block">
            <button
              onClick={() => {
                soundEffects.playClick();
                onSearchClick();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs bg-[#151922] hover:bg-[#1C2230] text-slate-400 hover:text-slate-200 rounded-xl border border-[#232936] transition-all group"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00D09C] transition-colors" />
                <span>Search stocks, indices, companies...</span>
              </span>
              <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#0B0E14] border border-[#232936] rounded">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons: Live Toggle, Sound, Alerts, Wallet */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Mobile Search Icon */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onSearchClick();
              }}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-[#151922] rounded-xl border border-transparent hover:border-[#232936] transition-all"
              title="Search stocks"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Live Ticker Pause / Resume Toggle */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onToggleLive();
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isLive
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 border-amber-800/60 text-amber-400 hover:bg-amber-900/50'
              }`}
              title={isLive ? "Live updates active. Click to pause." : "Live updates paused. Click to resume."}
            >
              <Radio className={`w-3.5 h-3.5 ${isLive ? 'animate-pulse text-[#00D09C]' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">{isLive ? 'LIVE' : 'PAUSED'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-all ${
                isMuted
                  ? 'text-slate-500 bg-[#151922] border-[#232936] hover:text-slate-300'
                  : 'text-[#00D09C] bg-[#00D09C]/10 border-[#00D09C]/30 hover:bg-[#00D09C]/20'
              }`}
              title={isMuted ? "Sound is muted. Click to enable audio feedback." : "Audio feedback enabled."}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Alerts Bell */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenAlerts();
              }}
              className="relative p-2 text-slate-300 hover:text-white bg-[#151922] hover:bg-[#1C2230] rounded-xl border border-[#232936] transition-all"
              title="Price Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-md">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Virtual Cash / Wallet Badge */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenAddFunds();
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-[#151922] to-[#1C2230] hover:from-[#1A202C] hover:to-[#222B3D] text-white rounded-xl border border-[#232936] hover:border-[#00D09C]/50 transition-all shadow-sm"
              title="Virtual Trading Wallet"
            >
              <Wallet className="w-3.5 h-3.5 text-[#00D09C]" />
              <div className="text-left">
                <span className="hidden xs:block text-[9px] text-slate-400 uppercase font-medium leading-none">Paper Balance</span>
                <span className="font-mono-numbers text-xs sm:text-sm font-bold text-slate-100">
                  ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <Plus className="w-3.5 h-3.5 text-[#00D09C] hidden sm:block" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
