import React from 'react';
import StatusColumn from './StatusColumn';
import { Order, OrderStatus } from '../types';
import { KDS_COLUMNS } from '../constants';

interface KDSBoardProps {
    orders: Order[];
    onOrderStatusChange: (orderId: string, newStatus: OrderStatus) => void;
    onSelectOrder: (order: Order) => void;
}

const KDSBoard: React.FC<KDSBoardProps> = ({ orders, onOrderStatusChange, onSelectOrder }) => {
    
    const handleDrop = (orderId: string, fromStatus: OrderStatus, targetStatus: OrderStatus) => {
        onOrderStatusChange(orderId, targetStatus);
    };

    return (
        <div className="grid grid-flow-col auto-cols-fr h-full gap-4 p-4 overflow-x-auto">
            {KDS_COLUMNS.map(status => {
                const columnOrders = orders.filter(order => order.status === status);
                return (
                    <StatusColumn
                        key={status}
                        status={status}
                        orders={columnOrders}
                        onDrop={handleDrop}
                        onSelectOrder={onSelectOrder}
                    />
                );
            })}
        </div>
    );
};

export default KDSBoard;
