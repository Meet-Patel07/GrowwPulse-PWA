import React from 'react';
import { Compass, Briefcase, Star, History, Calculator } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  holdingsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  holdingsCount,
}) => {
  const tabs = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'holdings', label: 'Holdings', icon: Briefcase, badge: holdingsCount },
    { id: 'watchlist', label: 'Watchlist', icon: Star },
    { id: 'orders', label: 'Orders', icon: History },
    { id: 'sip', label: 'SIP Calc', icon: Calculator },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0E14]/95 backdrop-blur-xl border-t border-[#232936] pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEffects.playClick();
                onSelectTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? 'text-[#00D09C]' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#00D09C] text-[8px] font-extrabold text-black">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 bg-[#00D09C] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
