import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Wallet, 
  Bell, 
  Volume2, 
  VolumeX, 
  Radio, 
  Plus, 
  Terminal,
  User,
  Command,
  TrendingUp,
  Sparkles,
  ChevronDown
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
  const [activeSegment, setActiveSegment] = useState<'stocks' | 'mutual_funds' | 'pay'>('stocks');

  const handleToggleMute = () => {
    const next = !isMuted;
    soundEffects.setMuted(next);
    setIsMuted(next);
    if (!next) soundEffects.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E1118]/95 backdrop-blur-xl border-b border-[#1E232F] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Left: Groww Branding & Product Segments */}
          <div className="flex items-center gap-5 sm:gap-8">
            {/* Groww Logo */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer group select-none" 
              onClick={() => {
                soundEffects.playClick();
                onSelectTab('explore');
              }}
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#00D09C] shadow-lg shadow-[#00D09C]/20 group-hover:scale-105 transition-transform">
                {/* Groww-style slanted dual leaf / geometric chart icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-black fill-current">
                  <path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H7.41l4.3-4.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-5 5A1 1 0 0 0 5 16v1a1 1 0 0 0-1 1zm12.71-9.71a1 1 0 0 0 1.41 0l3.59-3.59V7a1 1 0 1 0 2 0V2a1 1 0 0 0-1-1h-5a1 1 0 1 0 0 2h2.29l-3.29 3.29a1 1 0 0 0 0 1.42z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-[#00D09C]' : 'bg-amber-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLive ? 'bg-[#00D09C]' : 'bg-amber-400'}`}></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#00D09C] transition-colors">
                    Groww<span className="text-[#00D09C]">Pulse</span>
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-bold bg-[#00D09C]/10 text-[#00D09C] border border-[#00D09C]/30 rounded">
                    PWA
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links (Groww Tabs: Explore, Holdings, Watchlist, Orders, SIP) */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: 'explore', label: 'Explore' },
                { id: 'holdings', label: 'Holdings' },
                { id: 'watchlist', label: 'Watchlist' },
                { id: 'orders', label: 'Orders' },
                { id: 'sip', label: 'SIP Calc' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEffects.playClick();
                    onSelectTab(item.id);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-[#1E232F] text-[#00D09C] border border-[#2B3242]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#151922]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Middle: Groww Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => {
                soundEffects.playClick();
                onSearchClick();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs bg-[#151922] hover:bg-[#1B212E] text-slate-400 hover:text-slate-200 rounded-xl border border-[#232936] hover:border-[#00D09C]/40 transition-all shadow-inner group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-[#00D09C] transition-colors" />
                <span className="truncate">Search Groww (e.g. Tata Motors, Reliance...)</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#0B0E14] border border-[#232936] rounded shadow-sm">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons: Live Feed Toggle, Terminal, Sound, Alerts, Wallet & User Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Mobile Search Icon */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onSearchClick();
              }}
              className="md:hidden p-2 text-slate-400 hover:text-white bg-[#151922] hover:bg-[#1E232F] rounded-xl border border-[#232936] transition-all"
              title="Search stocks"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Groww Terminal Shortcut Button (Desktop) */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onSelectTab('explore');
              }}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#232936] bg-[#151922] hover:bg-[#1B212E] text-xs font-semibold text-slate-300 hover:text-white transition-all"
              title="Pro Terminal Mode"
            >
              <Terminal className="w-3.5 h-3.5 text-[#00D09C]" />
              <span>Terminal</span>
            </button>

            {/* Live Feed Status Pill */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onToggleLive();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isLive
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 border-amber-800/60 text-amber-400 hover:bg-amber-900/50'
              }`}
              title={isLive ? "Live real-time feed streaming. Click to pause." : "Market ticks paused. Click to resume."}
            >
              <Radio className={`w-3.5 h-3.5 ${isLive ? 'animate-pulse text-[#00D09C]' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">{isRealApiConnected ? 'NSE LIVE' : isLive ? 'LIVE' : 'PAUSED'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-all ${
                isMuted
                  ? 'text-slate-500 bg-[#151922] border-[#232936] hover:text-slate-300'
                  : 'text-[#00D09C] bg-[#00D09C]/10 border-[#00D09C]/30 hover:bg-[#00D09C]/20'
              }`}
              title={isMuted ? "Sound is muted. Click to enable audio feedback." : "Sound effects enabled."}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Alerts Bell */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenAlerts();
              }}
              className="relative p-2 text-slate-300 hover:text-white bg-[#151922] hover:bg-[#1B212E] rounded-xl border border-[#232936] transition-all"
              title="Price Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-md">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Groww Wallet Balance & Add Funds */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenAddFunds();
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-[#151922] hover:bg-[#1B212E] text-white rounded-xl border border-[#232936] hover:border-[#00D09C]/50 transition-all shadow-sm"
              title="Virtual Wallet Balance"
            >
              <Wallet className="w-3.5 h-3.5 text-[#00D09C]" />
              <div className="text-left">
                <span className="font-mono-numbers text-xs sm:text-sm font-bold text-slate-100">
                  ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="hidden xs:flex items-center text-[10px] font-bold text-[#00D09C] bg-[#00D09C]/10 px-1.5 py-0.5 rounded ml-1">
                <Plus className="w-2.5 h-2.5 mr-0.5" /> Add
              </div>
            </button>

            {/* User Profile Avatar (Groww Signature "M") */}
            <div 
              onClick={() => {
                soundEffects.playClick();
                onOpenAddFunds();
              }}
              className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1.5px] cursor-pointer hover:scale-105 transition-transform"
              title="User Account: Meet Patel"
            >
              <div className="w-full h-full rounded-full bg-[#0E1118] flex items-center justify-center font-bold text-xs text-emerald-400">
                M
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#00D09C] ring-2 ring-[#0E1118]"></span>
            </div>

          </div>
        </div>

        {/* Secondary Sub-Navbar (Groww Products: Stocks | Mutual Funds | Pay) */}
        <div className="flex items-center gap-6 border-t border-[#1A1F2B] overflow-x-auto no-scrollbar">
          {[
            { id: 'stocks', label: 'Stocks' },
            { id: 'mutual_funds', label: 'Mutual Funds' },
            { id: 'pay', label: 'Groww Pay / UPI' },
          ].map((seg) => (
            <button
              key={seg.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveSegment(seg.id as any);
                if (seg.id === 'stocks') onSelectTab('explore');
                else if (seg.id === 'mutual_funds') onSelectTab('sip');
                else onOpenAddFunds();
              }}
              className={`py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeSegment === seg.id
                  ? 'border-[#00D09C] text-[#00D09C]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {seg.label}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};
