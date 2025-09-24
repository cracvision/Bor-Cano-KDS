import React, { useState, useEffect, useCallback } from 'react';
import { ArchiveQuery, ArchiveQueryResult, Order } from '../types';
import { queryArchivedOrders } from '../services/query';
import ArchiveFilters from '../components/admin/ArchiveFilters';
import ArchiveResults from '../components/admin/ArchiveResults';
import { LogoIcon } from '../components/icons';

interface AdminArchivedProps {
    onClose: () => void;
    onSelectOrder: (order: Order) => void;
}

const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { from: start.toISOString(), to: end.toISOString(), preset: 'today' as const };
};

const AdminArchived: React.FC<AdminArchivedProps> = ({ onClose, onSelectOrder }) => {
    const [query, setQuery] = useState<ArchiveQuery>({
        filters: { range: getTodayRange() },
        pageSize: 50,
        sort: 'created_at_desc',
    });
    const [result, setResult] = useState<ArchiveQueryResult>({ items: [] });
    const [loading, setLoading] = useState(false);

    const executeQuery = useCallback(async (q: ArchiveQuery) => {
        setLoading(true);
        try {
            const data = await queryArchivedOrders(q);
            setResult(data);
        } catch (error) {
            console.error("Failed to query archived orders:", error);
            setResult({ items: [] }); // Reset on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        executeQuery(query);
    }, [query, executeQuery]);

    const handleQueryChange = (newQuery: ArchiveQuery) => {
        setQuery(newQuery);
    };

    return (
        <div className="flex flex-col h-full bg-gray-900">
            {/* Top Bar */}
            <div className="flex-shrink-0 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-8 w-auto text-violet-400" />
                    <h1 className="text-xl font-bold text-white">Órdenes Archivadas</h1>
                </div>
                <button
                    onClick={onClose}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Volver al KDS
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex overflow-hidden">
                {/* Filters Sidebar */}
                <div className="w-80 flex-shrink-0 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
                    <ArchiveFilters
                        query={query}
                        onQueryChange={handleQueryChange}
                    />
                </div>

                {/* Results */}
                <div className="flex-grow flex flex-col overflow-y-auto">
                   <ArchiveResults
                        result={result}
                        loading={loading}
                        onSelectOrder={onSelectOrder}
                   />
                </div>
            </div>
        </div>
    );
};

export default AdminArchived;
