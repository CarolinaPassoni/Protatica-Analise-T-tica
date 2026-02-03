
import React, { useState } from 'react';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Senha definida pelo administrador (sem dica de senha)
        if (password.trim() === 'CamilaM*') {
            onLoginSuccess();
        } else {
            setError('Senha inválida.');
        }
    };

    return (
        <div className="min-h-screen font-sans flex items-center justify-center p-4 bg-white relative overflow-hidden">
            {/* Camada de Marca d'Água */}
            <div 
                className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none"
                style={{
                    backgroundImage: "url('https://files.catbox.moe/lfylnw.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(20%)'
                }}
            />

            <div className="w-full max-w-md relative z-10">
                <form onSubmit={handleLogin} className="bg-[#2a0101] backdrop-blur-md rounded-xl shadow-2xl border border-yellow-900/20 overflow-hidden p-8 space-y-6">
                    <div className="text-center flex flex-col items-center">
                        <img 
                            src="https://files.catbox.moe/o6n9e6.png" 
                            alt="PROTATICA Logo" 
                            className="h-48 w-auto mb-4 object-contain drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                        />
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-2 uppercase tracking-wider">
                           PROTATICA ANALISES ESPORTIVAS
                        </h1>
                        <p className="text-yellow-200/70 mt-1">
                            Acesse a plataforma de inteligência tática.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-yellow-300/80 mb-2">
                            Senha de Acesso
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError('');
                            }}
                            className="w-full bg-black/50 border border-yellow-800/60 rounded-md px-4 py-3 text-lg placeholder-gray-400 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                         {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-[#4a0404] font-bold py-3 px-6 rounded-md text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Entrar
                    </button>
                </form>
                {/* Sem dica de senha */}
            </div>
        </div>
    );
};

export default Login;
