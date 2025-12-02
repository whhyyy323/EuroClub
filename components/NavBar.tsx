import React from 'react';
import { TEAMS } from '../constants';
import { TeamId } from '../types';

interface NavBarProps {
  currentTeam: TeamId;
  onSelectTeam: (id: TeamId) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentTeam, onSelectTeam }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
            <span className="font-bold text-xl tracking-tight text-slate-800 flex items-center gap-2">
              EuroTriad
            </span>
            <div className="flex space-x-2 md:space-x-4">
              {(Object.keys(TEAMS) as TeamId[]).map((teamId) => {
                const team = TEAMS[teamId];
                const isSelected = currentTeam === teamId;
                
                return (
                  <button
                    key={teamId}
                    onClick={() => onSelectTeam(teamId)}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                      ${isSelected 
                        ? `${team.primaryColor} text-white shadow-md transform scale-105` 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                    `}
                  >
                    <img 
                      src={team.logoPlaceholder} 
                      alt={team.name} 
                      className={`w-5 h-5 object-contain ${isSelected ? 'brightness-0 invert' : ''}`}
                    />
                    <span className="hidden md:inline">
                      {team.name.split(' ').slice(0, 1).join('')}
                    </span>
                  </button>
                );
              })}
            </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;