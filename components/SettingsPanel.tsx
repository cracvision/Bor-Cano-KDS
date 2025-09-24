
import React from 'react';
import { CloseIcon } from './icons';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Ajustes Rápidos</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6 text-gray-400"/>
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label htmlFor="card-size" className="block text-sm font-medium text-gray-300 mb-2">Tamaño de Tarjetas</label>
                        <select id="card-size" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-violet-500 focus:border-violet-500">
                            <option>Normal</option>
                            <option>Compacto</option>
                            <option>Grande</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sound-volume" className="block text-sm font-medium text-gray-300 mb-2">Volumen de Alertas</label>
                        <input type="range" id="sound-volume" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500" />
                    </div>
                     <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input id="auto-archive" type="checkbox" className="focus:ring-violet-500 h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="auto-archive" className="font-medium text-gray-300">Auto-archivar órdenes</label>
                            <p className="text-gray-400">Archivar órdenes servidas después de 5 minutos.</p>
                        </div>
                    </div>
                     <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input id="high-contrast" type="checkbox" className="focus:ring-violet-500 h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="high-contrast" className="font-medium text-gray-300">Modo Alto Contraste</label>
                            <p className="text-gray-400">Mejora la visibilidad de los elementos.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;
