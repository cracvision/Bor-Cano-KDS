import React from 'react';
import { ArchiveQueryResult, Order, OrderStatus } from '../../types';
import { STATUS_CONFIG } from '../../constants';

interface ArchiveResultsProps {
    result: ArchiveQueryResult;
    loading: boolean;
    onSelectOrder: (order: Order) => void;
}

const ArchiveResults: React.FC<ArchiveResultsProps> = ({ result, loading, onSelectOrder }) => {
    
    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full text-gray-400">Cargando...</div>;
    }

    if (!result.items || result.items.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-400">No se encontraron órdenes con los filtros aplicados.</div>;
    }

    return (
        <div className="p-4">
            <div className="text-sm text-gray-400 mb-2">Mostrando {result.items.length} de {result.total} órdenes</div>
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                {/* Header */}
                <div className="grid grid-cols-6 gap-4 p-4 font-bold text-gray-400 border-b border-gray-700 text-sm uppercase">
                    <div>ID Orden</div>
                    <div>Fecha Creación</div>
                    <div>Fuente</div>
                    <div>Prioridad</div>
                    <div>Mesa/Cliente</div>
                    <div>Estado Final</div>
                </div>
                {/* Body */}
                <div className="divide-y divide-gray-700">
                    {result.items.map(order => (
                        <div 
                            key={order.order_id} 
                            onClick={() => onSelectOrder(order)}
                            className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                            <div className="font-semibold text-white">{order.order_id}</div>
                            <div className="text-gray-300">{formatDate(order.created_at)}</div>
                            <div className="text-gray-300 capitalize">{order.source}</div>
                            <div className={`font-semibold ${order.priority === 'high' ? 'text-violet-400' : 'text-gray-300'}`}>
                                {order.priority === 'high' ? 'Alta' : 'Normal'}
                            </div>
                            <div className="text-gray-300">{order.table_number || order.customer_name}</div>
                            <div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${STATUS_CONFIG[order.status].color}`}>
                                    {STATUS_CONFIG[order.status].title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Simple pagination info, can be expanded later */}
            {result.nextPageToken && (
                 <div className="text-center mt-4 text-gray-500">
                     Más resultados disponibles.
                 </div>
            )}
        </div>
    );
};

export default ArchiveResults;
