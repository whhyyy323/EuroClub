import React, { useEffect, useState } from 'react';
import { Fixture, ThemeConfig } from '../types';
import { fetchTacticalAnalysis } from '../services/geminiService';
import { Bot, X } from 'lucide-react';

interface AnalysisModalProps {
  fixture: Fixture | null;
  teamName: string;
  theme: ThemeConfig;
  onClose: () => void;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ fixture, teamName, theme, onClose }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fixture) {
      setContent('');
      setLoading(true);
      
      const streamAnalysis = async () => {
        try {
            const stream = await fetchTacticalAnalysis(teamName, fixture.opponent);
            const reader = stream.getReader();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                setContent(prev => prev + value);
                setLoading(false);
            }
        } catch (err) {
            setContent("Failed to generate analysis. Please try again later.");
            setLoading(false);
        }
      };

      streamAnalysis();
    }
  }, [fixture, teamName]);

  if (!fixture) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl flex flex-col">
        
        <div className={`p-6 ${theme.gradient} text-white shrink-0`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium opacity-90 flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        Tactical Insight
                    </h3>
                    <h2 className="text-2xl font-bold mt-1">
                        {teamName} vs {fixture.opponent}
                    </h2>
                </div>
                <button 
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>

        <div className="p-6 md:p-8 text-gray-700 leading-relaxed text-lg">
            {loading && !content && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${theme.accentColor.replace('text', 'border')}`}></div>
                    <p className="text-sm text-gray-400 animate-pulse">Consulting tactical database...</p>
                </div>
            )}
            
            <div className="markdown-prose">
                 {content.split('\n').map((paragraph, idx) => (
                    paragraph ? <p key={idx} className="mb-4">{paragraph}</p> : null
                 ))}
            </div>
            
            {!loading && content && (
                 <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
                    AI-generated analysis based on available data.
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
