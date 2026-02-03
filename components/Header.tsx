
import React from 'react';

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20V16" />
    </svg>
);

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <header className="relative text-center p-4 md:p-6 border-b border-yellow-900/50">
            <div className="flex justify-center items-center gap-4 mb-2">
                <ChartBarIcon />
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                    PROTATICA
                </h1>
            </div>
            <p className="text-md md:text-lg text-yellow-200/70">
                Análise Tática Esportiva de Alta Performance
            </p>
             <button
                onClick={onLogout}
                className="absolute top-4 right-4 bg-transparent border border-yellow-700/50 text-yellow-300/80 px-4 py-2 rounded-lg hover:bg-yellow-900/40 hover:text-yellow-200 transition-colors text-sm font-semibold"
                aria-label="Sair da plataforma"
            >
                Sair
            </button>
        </header>
    );
};

export default Header;
