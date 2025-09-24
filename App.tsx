import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import KDSBoard from './components/KDSBoard';
import OrderDetailModal from './components/OrderDetailModal';
import SettingsPanel from './components/SettingsPanel';
import KPIs from './components/KPIs';
import AdminArchived from './pages/AdminArchived';
import { Order, OrderStatus } from './types';
import { initialOrders, BOARD_ALLOWED_TRANSITIONS } from './constants';
import { SoundToggleIcon, SettingsIcon, ChartIcon, CloseIcon } from './components/icons';

type ViewMode = 'board' | 'adminArchived';

const App: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMetricsOpen, setIsMetricsOpen] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('board');

    useEffect(() => {
        // Simulate network status changes
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if (!navigator.onLine) {
            setIsOffline(true);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    
    const handleOrderStatusChange = useCallback((orderId: string, newStatus: OrderStatus) => {
        const order = orders.find(o => o.order_id === orderId);
        if (!order) return;

        const allowedTransitions = BOARD_ALLOWED_TRANSITIONS.get(order.status) || [];
        if (!allowedTransitions.includes(newStatus)) {
            console.warn(`Invalid state transition from ${order.status} to ${newStatus}`);
            // Optionally: show a user-facing notification
            return;
        }

        setOrders(prevOrders =>
            prevOrders.map(o =>
                o.order_id === orderId
                    ? {
                        ...o,
                        status: newStatus,
                        updated_at: new Date().toISOString(),
                        status_history: [
                            ...o.status_history,
                            { status: newStatus, at: new Date().toISOString(), by: 'Cocinero' }
                        ]
                    }
                    : o
            )
        );
        if(newStatus === OrderStatus.ACK && isSoundOn) {
            console.log("SOUND: Order acknowledged!");
        }
    }, [isSoundOn, orders]);

    const activeOrders = useMemo(() => orders.filter(o => o.status !== OrderStatus.ARCHIVED && o.status !== OrderStatus.CANCELED), [orders]);

    const filteredOrders = useMemo(() => {
        if (!searchTerm) return activeOrders;
        return activeOrders.filter(order =>
            order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.table_number && order.table_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [activeOrders, searchTerm]);

    const renderContent = () => {
        if (viewMode === 'adminArchived') {
            return <AdminArchived onClose={() => setViewMode('board')} onSelectOrder={setSelectedOrder} />;
        }
        return (
            <KDSBoard
                orders={filteredOrders}
                onOrderStatusChange={handleOrderStatusChange}
                onSelectOrder={setSelectedOrder}
            />
        );
    };

    return (
        <div className="flex flex-col h-screen font-sans bg-gray-900 text-gray-200 overflow-hidden">
            <Header onSearch={setSearchTerm} onOpenArchived={() => setViewMode('adminArchived')} viewMode={viewMode} />

            {isOffline && (
                <div className="bg-red-800 text-white text-center py-1 font-semibold">
                    Sin conexión. Intentando reconectar...
                </div>
            )}
            
            <main className="flex-grow overflow-hidden">
                {renderContent()}
            </main>
            
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdateStatus={(newStatus) => {
                        handleOrderStatusChange(selectedOrder.order_id, newStatus);
                        setSelectedOrder(null);
                    }}
                    readOnly={viewMode === 'adminArchived'}
                />
            )}
            
            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            {isMetricsOpen && <KPIs orders={activeOrders} onClose={() => setIsMetricsOpen(false)} />}
            
            {/* Floating Action Buttons only on board view */}
            {viewMode === 'board' && (
                <div className="absolute bottom-6 right-6 flex flex-col gap-4">
                    <button
                        onClick={() => setIsSoundOn(!isSoundOn)}
                        className="bg-gray-800 p-4 rounded-full shadow-lg hover:bg-violet-800 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                        aria-label={isSoundOn ? "Silenciar Sonido" : "Activar Sonido"}
                    >
                        <SoundToggleIcon isOn={isSoundOn} className="w-7 h-7 text-white" />
                    </button>
                    <button
                        onClick={() => setIsMetricsOpen(!isMetricsOpen)}
                        className="bg-gray-800 p-4 rounded-full shadow-lg hover:bg-violet-800 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                        aria-label="Mostrar Métricas"
                    >
                        {isMetricsOpen ? <CloseIcon className="w-7 h-7 text-white" /> : <ChartIcon className="w-7 h-7 text-white" />}
                    </button>
                     <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="bg-gray-800 p-4 rounded-full shadow-lg hover:bg-violet-800 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                        aria-label="Abrir Ajustes"
                    >
                        <SettingsIcon className="w-7 h-7 text-white" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
