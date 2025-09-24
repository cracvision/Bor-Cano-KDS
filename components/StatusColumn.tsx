import React, { useState } from 'react';
import OrderCard from './OrderCard';
import { Order, OrderStatus } from '../types';
import { STATUS_CONFIG, BOARD_ALLOWED_TRANSITIONS } from '../constants';

interface StatusColumnProps {
    status: OrderStatus;
    orders: Order[];
    onDrop: (orderId: string, fromStatus: OrderStatus, targetStatus: OrderStatus) => void;
    onSelectOrder: (order: Order) => void;
}

const StatusColumn: React.FC<StatusColumnProps> = ({ status, orders, onDrop, onSelectOrder }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const config = STATUS_CONFIG[status];
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    
    const handleDragLeave = () => {
        setIsDragOver(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const orderId = e.dataTransfer.getData('orderId');
        const fromStatus = e.dataTransfer.getData('fromStatus') as OrderStatus;

        const allowedTransitions = BOARD_ALLOWED_TRANSITIONS.get(fromStatus) || [];
        
        if (orderId && allowedTransitions.includes(status)) {
            onDrop(orderId, fromStatus, status);
        } else {
            console.warn(`Invalid state transition from ${fromStatus} to ${status}`);
            // Here you could trigger a visual feedback, like a shake animation
        }
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col min-w-[320px] max-w-[400px] h-full rounded-xl bg-gray-800/50 transition-all duration-300 ${isDragOver ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-gray-900' : ''}`}
        >
            <div className={`sticky top-0 z-10 flex items-center justify-between p-4 rounded-t-xl ${config.color} text-white shadow-md`}>
                <h2 className="text-xl font-bold uppercase tracking-wider">{config.title}</h2>
                <span className="flex items-center justify-center min-w-[32px] h-8 bg-black/20 text-lg font-bold rounded-full px-3">
                    {orders.length}
                </span>
            </div>
            <div className="flex-grow p-2 space-y-3 overflow-y-auto">
                {orders
                    .sort((a, b) => {
                         // High priority always comes first
                        if (a.priority === 'high' && b.priority !== 'high') return -1;
                        if (a.priority !== 'high' && b.priority === 'high') return 1;
                        // Then, sort by oldest (longest time in current status)
                        return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
                    })
                    .map(order => (
                        <OrderCard 
                            key={order.order_id} 
                            order={order} 
                            onSelectOrder={onSelectOrder}
                        />
                ))}
            </div>
        </div>
    );
};

export default StatusColumn;
