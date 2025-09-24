import React from 'react';
import { Order, OrderStatus } from '../types';
import { STATUS_CONFIG, KDS_COLUMNS } from '../constants';
import { CloseIcon, HighPriorityIcon, AllergyIcon } from './icons';
import useElapsedTime from '../hooks/useElapsedTime';

interface OrderDetailModalProps {
    order: Order;
    onClose: () => void;
    onUpdateStatus: (newStatus: OrderStatus) => void;
    readOnly?: boolean;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onUpdateStatus, readOnly = false }) => {
    const totalTime = useElapsedTime(order.created_at);
    
    const nextStatus = STATUS_CONFIG[order.status]?.nextStatus;

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-700 m-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700 flex-shrink-0">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Orden {order.order_id}</h2>
                        <p className="text-gray-400">
                            {order.table_number ? `Mesa ${order.table_number}` : order.customer_name}
                        </p>
                    </div>
                     <div className="text-right">
                        <span className={`px-4 py-2 text-sm font-bold rounded-full ${STATUS_CONFIG[order.status].color}`}>
                            {STATUS_CONFIG[order.status].title}
                        </span>
                        <p className="text-gray-300 mt-2">Tiempo total: <span className="font-semibold text-white">{totalTime}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <CloseIcon className="w-7 h-7 text-gray-400"/>
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6 flex-grow overflow-y-auto">
                    {(order.priority === 'high' || order.allergies.length > 0 || order.notes) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {order.priority === 'high' && (
                                <div className="bg-violet-900/50 border border-violet-700 p-4 rounded-lg flex items-center gap-3">
                                    <HighPriorityIcon className="w-6 h-6 text-violet-300"/>
                                    <div>
                                        <h4 className="font-bold text-violet-200">Prioridad Alta</h4>
                                        <p className="text-sm text-violet-300">Atender con urgencia.</p>
                                    </div>
                                </div>
                            )}
                             {order.allergies.length > 0 && (
                                <div className="bg-yellow-900/50 border border-yellow-700 p-4 rounded-lg flex items-center gap-3">
                                    <AllergyIcon className="w-6 h-6 text-yellow-300"/>
                                    <div>
                                        <h4 className="font-bold text-yellow-200">Alerta de Alergias</h4>
                                        <p className="text-sm text-yellow-300">{order.allergies.join(', ')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                     {order.notes && (
                        <div className="bg-blue-900/50 border border-blue-700 p-4 rounded-lg mb-6">
                            <h4 className="font-bold text-blue-200 mb-1">Notas del Cliente</h4>
                            <p className="text-blue-300">{order.notes}</p>
                        </div>
                    )}
                    
                    <h3 className="text-xl font-semibold text-gray-200 mb-3">Productos</h3>
                    <ul className="space-y-3">
                        {order.items.map((item, index) => (
                            <li key={index} className="bg-gray-900 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-lg font-bold text-white">
                                            <span className="bg-violet-600 text-white rounded-full w-7 h-7 inline-flex items-center justify-center mr-3">{item.qty}</span>
                                            {item.name}
                                        </p>
                                        {item.notes && <p className="text-sm text-gray-400 pl-10">Nota: {item.notes}</p>}
                                    </div>
                                </div>
                                {item.modifiers && item.modifiers.length > 0 && (
                                    <div className="pl-10 mt-2">
                                        {item.modifiers.map((mod, modIndex) => (
                                            <span key={modIndex} className="inline-block bg-gray-700 text-gray-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{mod.name}: {mod.value}</span>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer / Actions */}
                {!readOnly && (
                    <div className="flex justify-between items-center p-6 border-t border-gray-700 bg-gray-800/50 rounded-b-2xl flex-shrink-0">
                        <button 
                            onClick={() => {
                                if (window.confirm('¿Estás seguro que quieres cancelar esta orden?')) {
                                    onUpdateStatus(OrderStatus.CANCELED);
                                }
                            }}
                            className="px-6 py-3 rounded-lg text-white font-semibold bg-red-700 hover:bg-red-600 transition-colors">
                            Cancelar Orden
                        </button>
                        {nextStatus && KDS_COLUMNS.includes(nextStatus) && (
                            <button 
                                onClick={() => onUpdateStatus(nextStatus)}
                                className="px-10 py-4 rounded-lg text-white text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg transform hover:scale-105">
                                {`Mover a ${STATUS_CONFIG[nextStatus].title}`}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailModal;
