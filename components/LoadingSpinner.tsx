
import React from 'react';

const LoadingSpinner: React.FC = () => {
    const messages = [
        "Analisando jogadas...",
        "Avaliando táticas...",
        "Consultando estatísticas...",
        "Revisando o desempenho dos jogadores...",
        "Quase lá, preparando o relatório final..."
    ];
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 3000);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-4 my-8">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
            <p className="text-lg text-yellow-300/80 font-semibold">{message}</p>
        </div>
    );
};

export default LoadingSpinner;