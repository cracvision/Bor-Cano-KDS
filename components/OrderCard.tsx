
import React from 'react';
import { Order, OrderStatus, OrderPriority, OrderSource } from '../types';
import { SLA_THRESHOLDS } from '../constants';
import useElapsedTime from '../hooks/useElapsedTime';
import { HighPriorityIcon, AllergyIcon, NotesIcon, WhatsappIcon, WebIcon, VoiceIcon } from './icons';

interface OrderCardProps {
    order: Order;
    onSelectOrder: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onSelectOrder }) => {
    const timeInStatus = useElapsedTime(order.updated_at);
    const [minutes, seconds] = timeInStatus.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    
    const { warn, critical } = SLA_THRESHOLDS[order.status];
    const timerColor = totalSeconds >= critical ? 'bg-red-500 text-white' : totalSeconds >= warn ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white';

    const totalItems = order.items.reduce((acc, item) => acc + item.qty, 0);

    const SourceIcon = {
        [OrderSource.WHATSAPP]: WhatsappIcon,
        [OrderSource.WEB]: WebIcon,
        [OrderSource.VOICE]: VoiceIcon,
    }[order.source];

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('orderId', order.order_id);
        e.dataTransfer.setData('fromStatus', order.status);
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.opacity = '1';
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => onSelectOrder(order)}
            className={`p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-500
                ${order.priority === OrderPriority.HIGH ? 'bg-gray-700 border-l-4 border-violet-500' : 'bg-gray-800'}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <SourceIcon className="w-6 h-6 text-gray-400" />
                    <span className="text-xl font-bold text-white">{order.order_id}</span>
                </div>
                <div className={`px-3 py-1 text-lg font-bold rounded-md ${timerColor}`}>
                    {timeInStatus}
                </div>
            </div>
            
            {/* Body */}
            <div className="mb-3">
                <p className="text-lg font-semibold text-gray-200">
                    {order.table_number || order.customer_name || 'Sin especificar'}
                </p>
                <p className="text-gray-400">
                    {totalItems} {totalItems > 1 ? 'productos' : 'producto'}
                </p>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-start gap-3 h-6">
                {order.priority === OrderPriority.HIGH && (
                    <div title="Prioridad Alta" className="flex items-center gap-1 text-violet-400">
                        <HighPriorityIcon className="w-5 h-5" />
                        <span className="font-semibold text-sm">ALTA</span>
                    </div>
                )}
                {order.allergies.length > 0 && (
                    <div title={`Alergias: ${order.allergies.join(', ')}`} className="flex items-center gap-1 text-yellow-400">
                        <AllergyIcon className="w-5 h-5" />
                        <span className="font-semibold text-sm">ALERGIAS</span>
                    </div>
                )}
                {order.notes && (
                     <div title={`Notas: ${order.notes}`} className="flex items-center gap-1 text-blue-400">
                        <NotesIcon className="w-5 h-5" />
                        <span className="font-semibold text-sm">NOTAS</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
