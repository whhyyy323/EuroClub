import React from 'react';
import { Player, ThemeConfig } from '../types';
import { User, Shield } from 'lucide-react';

interface SquadListProps {
  players: Player[];
  theme: ThemeConfig;
}

const SquadList: React.FC<SquadListProps> = ({ players, theme }) => {
  const getPositionColor = (pos: string) => {
    if (pos.includes('Goal')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (pos.includes('Def')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (pos.includes('Mid')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className={`text-2xl font-bold mb-6 flex items-center ${theme.accentColor}`}>
        <Shield className="w-6 h-6 mr-2" />
        Current Squad
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <div 
            key={player.number + player.name}
            className="group relative overflow-hidden bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${theme.primaryColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="flex items-start justify-between">
                <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border mb-2 ${getPositionColor(player.position)}`}>
                        {player.position}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{player.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{player.nationality}</p>
                </div>
                <div className="text-3xl font-black text-gray-100 group-hover:text-gray-200 transition-colors">
                    {player.number}
                </div>
            </div>
            
            <div className="mt-4 flex justify-end">
                <User className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SquadList;
