import React from 'react';
import { Fixture, ThemeConfig } from '../types';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface FixtureListProps {
  fixtures: Fixture[];
  theme: ThemeConfig;
  onAnalyze: (fixture: Fixture) => void;
}

const FixtureList: React.FC<FixtureListProps> = ({ fixtures, theme, onAnalyze }) => {
  return (
    <div className="animate-fade-in-up">
      <h2 className={`text-2xl font-bold mb-6 flex items-center ${theme.accentColor}`}>
        <Calendar className="w-6 h-6 mr-2" />
        Upcoming Fixtures
      </h2>
      <div className="space-y-4">
        {fixtures.map((match, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-gray-300 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{match.competition}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${match.venue === 'Home' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {match.venue}
                    </span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                    vs {match.opponent}
                </div>
                <div className="flex items-center text-gray-500 text-sm mt-2 space-x-4">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {match.date}</span>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {match.time}</span>
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {match.venue === 'Home' ? 'Home Stadium' : 'Away'}</span>
                </div>
            </div>
            
            <button 
                onClick={() => onAnalyze(match)}
                className={`w-full md:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${theme.primaryColor} text-white opacity-90 hover:opacity-100 active:scale-95 shadow-lg shadow-red-200`}
            >
                AI Analysis
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixtureList;
