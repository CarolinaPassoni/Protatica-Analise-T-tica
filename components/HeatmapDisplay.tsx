import React from 'react';
import type { MapaDeCalor } from '../types';

interface HeatmapDisplayProps {
    data: { timeA: MapaDeCalor; timeB: MapaDeCalor };
    timeA: string;
    timeB: string;
}

const parsePercent = (str: string) => parseFloat(str?.replace('%', '')) || 0;

const TeamHeatmap: React.FC<{ teamName: string; teamData: MapaDeCalor; color: string }> = ({ teamName, teamData, color }) => (
    <div>
        <h6 className="text-center font-bold text-lg mb-2 text-yellow-200">{teamName}</h6>
        <div className="flex w-full h-16 rounded-lg overflow-hidden border-2 border-yellow-800/50">
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: color, opacity: parsePercent(teamData.tercoDefensivo) / 100 }}>
                <span className="font-bold text-white mix-blend-difference text-shadow-sm">{teamData.tercoDefensivo}</span>
            </div>
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: color, opacity: parsePercent(teamData.tercoMedio) / 100 }}>
                <span className="font-bold text-white mix-blend-difference text-shadow-sm">{teamData.tercoMedio}</span>
            </div>
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: color, opacity: parsePercent(teamData.tercoOfensivo) / 100 }}>
                <span className="font-bold text-white mix-blend-difference text-shadow-sm">{teamData.tercoOfensivo}</span>
            </div>
        </div>
        <div className="flex w-full text-xs text-center text-yellow-300/70 mt-1">
            <div className="flex-1">Defensivo</div>
            <div className="flex-1">Médio</div>
            <div className="flex-1">Ofensivo</div>
        </div>
    </div>
);


const HeatmapDisplay: React.FC<HeatmapDisplayProps> = ({ data, timeA, timeB }) => {
    return (
        <div className="space-y-6">
           <TeamHeatmap teamName={timeA} teamData={data.timeA} color="#facc15" />
           <TeamHeatmap teamName={timeB} teamData={data.timeB} color="#b91c1c" />
        </div>
    );
};

export default HeatmapDisplay;
