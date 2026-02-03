import React, { useState } from 'react';

export type AnalysisMode = 'web' | 'video';
export type AnalysisRequest = { type: 'url'; url: string; mode: AnalysisMode } | { type: 'file'; file: File };

interface UrlInputFormProps {
    onSubmit: (request: AnalysisRequest) => void;
    isLoading: boolean;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({ onSubmit, isLoading }) => {
    const [url, setUrl] = useState('');
    const mode: AnalysisMode = 'video';
    const [inputMethod, setInputMethod] = useState<'url' | 'file'>('url');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const MAX_FILE_SIZE_GB = 2;
            if (selectedFile.size > MAX_FILE_SIZE_GB * 1024 * 1024 * 1024) {
                alert(`O arquivo é muito grande (${(selectedFile.size / 1024 / 1024 / 1024).toFixed(2)}GB). O tamanho máximo é ${MAX_FILE_SIZE_GB}GB.`);
                setFile(null);
                e.target.value = ''; // Limpa o input
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        if (inputMethod === 'url' && url.trim()) {
            onSubmit({ type: 'url', url, mode });
        } else if (inputMethod === 'file' && file) {
            onSubmit({ type: 'file', file });
        }
    };

    const TabButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            disabled={isLoading}
            className={`px-4 py-2 text-lg font-semibold border-b-4 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded-t-md ${
                active 
                ? 'border-yellow-500 text-yellow-200' 
                : 'border-transparent text-yellow-200/50 hover:text-yellow-200/80 hover:border-yellow-800/60'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex justify-center border-b border-yellow-900/50 mb-4" role="tablist">
                    <TabButton active={inputMethod === 'url'} onClick={() => setInputMethod('url')}>Analisar por URL</TabButton>
                    <TabButton active={inputMethod === 'file'} onClick={() => setInputMethod('file')}>Analisar por Arquivo</TabButton>
                </div>

                {inputMethod === 'url' && (
                    <div role="tabpanel">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full bg-black/30 border border-yellow-800/60 rounded-md px-4 py-3 text-lg placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all disabled:opacity-50"
                            required
                            disabled={isLoading}
                            aria-label="URL do vídeo do YouTube"
                        /></div>
                )}

                {inputMethod === 'file' && (
                    <div role="tabpanel" className="flex flex-col items-center gap-3">
                        <label htmlFor="file-upload" className="w-full text-center cursor-pointer bg-black/30 border-2 border-dashed border-yellow-800/60 rounded-md px-4 py-6 text-lg text-yellow-200/70 hover:border-yellow-600 hover:text-yellow-200 transition-colors">
                            {file ? `Arquivo selecionado: ${file.name}` : 'Clique para carregar um vídeo'}
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo,video/x-flv"
                            className="sr-only"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-yellow-400/60">(máx 2GB). Para vídeos longos, a análise será feita a partir de uma amostragem de quadros para otimizar o desempenho.</p>
                    </div>
                )}

                <button
                    type="submit"
                    className="mt-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-[#4a0404] font-bold py-3 px-6 rounded-md text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    disabled={isLoading || (inputMethod === 'url' && !url.trim()) || (inputMethod === 'file' && !file)}
                >
                    {isLoading ? 'Analisando...' : 'Analisar Partida'}
                </button>
            </form>
        </div>
    );
};

export default UrlInputForm;