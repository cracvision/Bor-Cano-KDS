import React from 'react';
import { ArchiveQuery, DateRange, OrderSource, OrderPriority } from '../../types';

interface ArchiveFiltersProps {
    query: ArchiveQuery;
    onQueryChange: (newQuery: ArchiveQuery) => void;
}

const ArchiveFilters: React.FC<ArchiveFiltersProps> = ({ query, onQueryChange }) => {

    const handleDatePreset = (preset: 'today' | 'last_7d' | 'last_30d') => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        if (preset === 'last_7d') {
            start.setDate(start.getDate() - 6);
        } else if (preset === 'last_30d') {
            start.setDate(start.getDate() - 29);
        }
        
        const newRange: DateRange = { from: start.toISOString(), to: end.toISOString(), preset };
        onQueryChange({ ...query, filters: { ...query.filters, range: newRange } });
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onQueryChange({ ...query, filters: { ...query.filters, text: e.target.value } });
    };
    
    const handleIncludeCanceledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onQueryChange({ ...query, filters: { ...query.filters, includeCanceled: e.target.checked } });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Filtros</h2>
            
            {/* Date Range */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rango de Fechas</label>
                <div className="flex flex-col gap-2">
                    <button onClick={() => handleDatePreset('today')} className={`w-full text-left px-3 py-2 rounded-md text-sm ${query.filters.range.preset === 'today' ? 'bg-violet-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Hoy</button>
                    <button onClick={() => handleDatePreset('last_7d')} className={`w-full text-left px-3 py-2 rounded-md text-sm ${query.filters.range.preset === 'last_7d' ? 'bg-violet-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Últimos 7 días</button>
                    <button onClick={() => handleDatePreset('last_30d')} className={`w-full text-left px-3 py-2 rounded-md text-sm ${query.filters.range.preset === 'last_30d' ? 'bg-violet-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Últimos 30 días</button>
                </div>
            </div>

            {/* Text Search */}
            <div>
                <label htmlFor="text-search" className="block text-sm font-medium text-gray-300 mb-2">Búsqueda</label>
                <input
                    id="text-search"
                    type="text"
                    value={query.filters.text || ''}
                    onChange={handleTextChange}
                    placeholder="ID, mesa, cliente..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-violet-500 focus:border-violet-500"
                />
            </div>

            {/* Other Filters */}
            <div className="relative flex items-start">
                <div className="flex items-center h-5">
                    <input 
                        id="include-canceled" 
                        type="checkbox"
                        checked={query.filters.includeCanceled || false}
                        onChange={handleIncludeCanceledChange}
                        className="focus:ring-violet-500 h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="include-canceled" className="font-medium text-gray-300">Incluir Canceladas</label>
                </div>
            </div>

        </div>
    );
};

export default ArchiveFilters;
