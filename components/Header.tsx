import React, { useState, useEffect } from 'react';
import { LogoIcon, SearchIcon, ArchiveIcon, ClockIcon } from './icons';

interface HeaderProps {
    onSearch: (term: string) => void;
    onOpenArchived: () => void;
    viewMode: 'board' | 'adminArchived';
}

const Header: React.FC<HeaderProps> = ({ onSearch, onOpenArchived, viewMode }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });
     const formattedDate = currentTime.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between flex-shrink-0 z-20">
            <div className="flex items-center gap-4">
                <LogoIcon className="h-10 w-auto" />
                <h1 className="text-2xl font-bold text-white tracking-tight hidden md:block">
                    Borí Cano <span className="font-light text-violet-400">KDS</span>
                </h1>
            </div>

            <div className="flex-1 flex justify-center px-8">
                {viewMode === 'board' && (
                    <div className="relative w-full max-w-lg">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="search"
                            placeholder="Buscar por ID, mesa o cliente..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-lg text-gray-300">
                    <ClockIcon className="h-6 w-6" />
                    <div className="flex flex-col items-end">
                       <span className="font-semibold">{formattedTime}</span>
                       <span className="text-xs font-light capitalize">{formattedDate}</span>
                    </div>
                </div>
                {viewMode === 'board' && (
                    <button 
                        onClick={onOpenArchived}
                        className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500">
                        <ArchiveIcon className="h-5 w-5"/>
                        <span className="font-medium hidden lg:block">Ver Archivadas</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
