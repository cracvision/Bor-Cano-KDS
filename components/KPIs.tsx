import React, { useMemo } from 'react';
import { Order, OrderStatus } from '../types';
import { CloseIcon, ChartIcon } from './icons';

interface KPIsProps {
    orders: Order[];
    onClose: () => void;
}

const KPIWidget: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-gray-800 p-4 rounded-lg text-center shadow-lg border border-gray-700">
        <p className="text-sm text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-bold text-violet-400 my-2">{value}</p>
        <p className="text-xs text-gray-500">{description}</p>
    </div>
);


const KPIs: React.FC<KPIsProps> = ({ orders, onClose }) => {
    const metrics = useMemo(() => {
        // Note: This component receives already filtered active orders,
        // so ARCHIVED and CANCELED are excluded by default.
        const inQueue = orders.filter(o => [OrderStatus.NEW, OrderStatus.ACK, OrderStatus.IN_PREP].includes(o.status)).length;
        const ready = orders.filter(o => o.status === OrderStatus.READY).length;
        const servedToday = orders.filter(o => o.status === OrderStatus.SERVED).length;
        const highPriority = orders.filter(o => o.priority === 'high' && o.status !== OrderStatus.SERVED).length;

        const prepTimes = orders
            .filter(o => o.status === OrderStatus.READY || o.status === OrderStatus.SERVED)
            .map(o => {
                const prepStart = o.status_history.find(h => h.status === OrderStatus.IN_PREP)?.at;
                const prepEnd = o.status_history.find(h => h.status === OrderStatus.READY)?.at;
                if (prepStart && prepEnd) {
                    return (new Date(prepEnd).getTime() - new Date(prepStart).getTime()) / 1000 / 60; // in minutes
                }
                return null;
            })
            .filter((t): t is number => t !== null);

        const avgPrepTime = prepTimes.length > 0 ? (prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length).toFixed(1) : 'N/A';
        
        return { inQueue, ready, servedToday, highPriority, avgPrepTime };
    }, [orders]);

    return (
        <div className="absolute bottom-24 right-6 mb-4 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl z-30 w-full max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <ChartIcon className="w-6 h-6 text-violet-400" />
                    <h3 className="text-xl font-bold text-white">Métricas del Turno</h3>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
                    <CloseIcon className="w-5 h-5 text-gray-400" />
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <KPIWidget title="En Cola" value={metrics.inQueue} description="Órdenes activas en cocina." />
                <KPIWidget title="Listas" value={metrics.ready} description="Esperando para ser servidas." />
                <KPIWidget title="Prioridad Alta" value={metrics.highPriority} description="Órdenes urgentes activas." />
                <KPIWidget title="T. Prep. Prom." value={`${metrics.avgPrepTime} min`} description="Tiempo promedio en preparación." />
            </div>
        </div>
    );
};

export default KPIs;
