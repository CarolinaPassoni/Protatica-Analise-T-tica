
import React, { useState } from 'react';
import Header from './components/Header';
import UrlInputForm, { AnalysisRequest } from './components/UrlInputForm';
import LoadingSpinner from './components/LoadingSpinner';
import AnalysisDisplay from './components/AnalysisDisplay';
import Login from './components/Login';
import { analyzeFootballMatch } from './services/geminiService';
import type { Analysis } from './types';

const App: React.FC = () => {
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const handleAnalysisRequest = async (request: AnalysisRequest) => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await analyzeFootballMatch(request);
            setAnalysis(result);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Ocorreu um erro inesperado.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-[#4a0404] font-sans print:bg-white print:text-black">
            <main className="max-w-5xl mx-auto p-4 print:max-w-full print:p-0">
                <div className="bg-[#2a0101]/60 backdrop-blur-md rounded-xl shadow-2xl border border-yellow-900/50 overflow-hidden print:bg-transparent print:shadow-none print:border-none print:rounded-none">
                    
                    <div className="print:hidden">
                        <Header onLogout={handleLogout} />
                        <UrlInputForm onSubmit={handleAnalysisRequest} isLoading={isLoading} />
                    </div>
                    
                    <div className="px-4 pb-4 print:px-0 print:pb-0">
                        {isLoading && <LoadingSpinner />}
                        {error && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-center print:hidden">
                                <strong className="font-bold">Erro: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {analysis && <AnalysisDisplay analysis={analysis} />}
                    </div>
                </div>
</main>
        </div>
    );
};

export default App;
