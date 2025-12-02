import React, { useState, useEffect, useCallback } from 'react';
import { TEAMS } from './constants';
import { TeamId, TeamData, Fixture } from './types';
import NavBar from './components/NavBar';
import SquadList from './components/SquadList';
import FixtureList from './components/FixtureList';
import AnalysisModal from './components/AnalysisModal';
import { fetchTeamDataFromGemini } from './services/geminiService';
import { RefreshCcw, AlertCircle, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [currentTeamId, setCurrentTeamId] = useState<TeamId>(TeamId.MAN_UTD);
  const [teamDataCache, setTeamDataCache] = useState<Record<string, TeamData>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

  const theme = TEAMS[currentTeamId];

  const loadTeamData = useCallback(async (teamId: TeamId, forceRefresh = false) => {
    const teamConfig = TEAMS[teamId];
    
    // Check cache first
    if (!forceRefresh && teamDataCache[teamId]) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchTeamDataFromGemini(teamConfig.name);
      setTeamDataCache(prev => ({
        ...prev,
        [teamId]: data
      }));
    } catch (err) {
      setError("Unable to load team data. The AI service might be busy or key is missing.");
    } finally {
      setLoading(false);
    }
  }, [teamDataCache]);

  // Load data when team changes
  useEffect(() => {
    loadTeamData(currentTeamId);
  }, [currentTeamId, loadTeamData]);

  const currentData = teamDataCache[currentTeamId];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NavBar 
        currentTeam={currentTeamId} 
        onSelectTeam={setCurrentTeamId} 
      />

      {/* Hero Section */}
      <div className={`relative w-full h-56 md:h-72 overflow-hidden transition-colors duration-500 bg-gradient-to-r ${theme.gradient}`}>
        <div className="absolute inset-0 bg-black/20" /> {/* Texture overlay */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-50 to-transparent" /> {/* Blend to content */}
        
        <div className="relative max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="animate-fade-in-down z-10">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg">
              {theme.name}
            </h1>
            <p className="text-white/80 mt-2 font-medium text-lg flex items-center gap-2">
              <span>Season 24/25 Live Hub</span>
              {!loading && (
                 <button 
                    onClick={() => loadTeamData(currentTeamId, true)}
                    className="ml-4 p-1.5 bg-white/10 rounded-full hover:bg-white/30 transition-colors"
                    title="Refresh Live Data"
                 >
                    <RefreshCcw className="w-4 h-4 text-white" />
                 </button>
              )}
            </p>
          </div>
          
          <div className="hidden md:block mr-8 animate-fade-in-up">
            <img 
                src={theme.logoPlaceholder} 
                alt={`${theme.name} Logo`} 
                className="w-40 h-40 object-contain drop-shadow-2xl opacity-90"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center shadow-sm">
                <AlertCircle className="w-5 h-5 mr-3" />
                {error}
            </div>
        )}

        {loading && !currentData ? (
          <div className="space-y-8 animate-pulse">
             <div className="bg-white h-64 rounded-xl shadow-sm"></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white h-40 rounded-xl"></div>
                <div className="bg-white h-40 rounded-xl"></div>
                <div className="bg-white h-40 rounded-xl"></div>
             </div>
          </div>
        ) : currentData ? (
          <div className="space-y-12">
            
            {/* Fixtures Section */}
            <section>
                <FixtureList 
                    fixtures={currentData.fixtures} 
                    theme={theme} 
                    onAnalyze={(fix) => setSelectedFixture(fix)}
                />
            </section>

            {/* Squad Section */}
            <section>
                <SquadList players={currentData.squad} theme={theme} />
            </section>

            {/* Sources / Grounding Data */}
            {currentData.sources && currentData.sources.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Data Sources (Real-time Grounding)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {currentData.sources.map((source, idx) => (
                            <a 
                                key={idx}
                                href={source.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition-colors truncate max-w-[200px]"
                            >
                                {source.title || new URL(source.uri).hostname}
                            </a>
                        ))}
                    </div>
                </div>
            )}
            
          </div>
        ) : null}
      </main>

      {/* Analysis Modal */}
      {selectedFixture && (
        <AnalysisModal 
            fixture={selectedFixture}
            teamName={theme.name}
            theme={theme}
            onClose={() => setSelectedFixture(null)}
        />
      )}
      
      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-gray-400 text-sm border-t border-gray-200">
        <p>© 2024 EuroTriad Hub. Powered by Google Gemini with Search Grounding.</p>
      </footer>
    </div>
  );
};

export default App;