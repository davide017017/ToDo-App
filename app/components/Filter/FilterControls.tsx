import React, { useRef, useEffect } from 'react';
import { FilterByType } from '../../page';
import { AdjustmentsHorizontalIcon, CheckIcon, ClockIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FilterControlsProps {
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
    filters: FilterByType;
    setFilters: React.Dispatch<React.SetStateAction<FilterByType>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    handleFilterChange: (filterName: keyof FilterByType, isEnabled: boolean) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ showFilters, setShowFilters, filters, setFilters, searchTerm, setSearchTerm, handleFilterChange }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && showFilters && !dropdownRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        }; 

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilters, setShowFilters]);


    return (
        <div className="relative text-center justify-end items-center"> {/* Added relative here for absolute positioning context */}
            {/* Pulsante "Filtri" - Stile simile a SortControls */}
            
            <div className="flex justify-end">
            
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`
                        bg-gradient-to-r from-yellow-400 to-yellow-100 border border-yellow-800 rounded-lg p-2 m-1 transition-colors duration-500 flex items-center
                        hover:bg-gradient-to-r hover:from-yellow-200 hover:to-yellow-400
                        focus:outline-none focus:ring-2 focus:ring-yellow-800
                        ${showFilters ? 'outline-2 outline-blue-500 shadow-md shadow-blue-200/50' : ''}
                        ${(filters.completed || filters.incomplete || searchTerm !== '') ? 'bg-gradient-to-r from-yellow-200 to-yellow-300' : ''}
                    `}
                >
                    <AdjustmentsHorizontalIcon className="h-5 w-5 mx-2" />
                    <span>Filtri</span>
                    {(filters.completed || filters.incomplete || searchTerm !== '') && !showFilters && (
                        <MagnifyingGlassIcon  className='ml-2 h-5 w-5 text-yellow-700' />
                    )}
                </button>
            </div>
            {/* Riepilogo filtri attivi (quando il pannello è chiuso) */}
            {(filters.completed || filters.incomplete || searchTerm !== '') && !showFilters && (
                <div className="max-w-full text-sm text-gray-700 m-1 p-1 bg-gray-50 rounded border border-orange-500 flex gap-2 items-center flex-col sm:flex-row">
                    {searchTerm && <div className="px-2 py-1 bg-gray-200 rounded-full text-xs flex flew-row flex-nowrap items-center"><MagnifyingGlassIcon className="h-3 w-3 mr-1 text-orange-500"/> Ricerca: "{searchTerm}" <button onClick={() => setSearchTerm('')} className='ml-1 text-red-500'>X</button></div>} 
                    {filters.completed && <div className="flex flex-nowrap px-1 py-1 bg-green-200 rounded-full text-xs items-center"><CheckIcon className="h-3 w-3 mr-1 text-green-500"/>Completati <button onClick={() => handleFilterChange('completed', false)} className='ml-1 text-red-500'>X</button></div>}
                    {filters.incomplete && <div className="flex flex-nowrap px-1 py-1 bg-blue-200 rounded-full text-xs items-center"><ClockIcon className="h-3 w-3 mr-1 text-blue-500"/>Incompleti <button onClick={() => handleFilterChange('incomplete', false)} className='ml-1 text-red-500'>X</button></div>}
                </div>
            )}


            {/* Pannello dei filtri a scomparsa - STILE "VECCHIO CODICE" e SEMPRE APERTO */}
            <div
                ref={dropdownRef}
                className={`shadow-xl shadow-black absolute right-0 mt-2 w-72 rounded-lg border-black z-10
                    ${showFilters ? 'scale-100 max-h-[500px]' : 'scale-0 opacity-0 max-h-0'}
                    transition-all duration-500 ease-in-out overflow-hidden
                    bg-yellow-100 border rounded shadow-sm p-4 text-black ring-0 focus:outline-none`}
                role="menu-filtro-ricerca" aria-orientation="vertical" aria-labelledby="menu-filtro-ricerca">
                <div className="py-0 px-0" role="menu" aria-orientation="vertical" aria-labelledby="menu-filtro-ricerca">
                    {/* Input di ricerca "Cerca per attività" */}
                    <div className="mb-4 px-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cerca..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`font-mono border-orange-300 px-3 py-2 w-full focus:ring-2 focus:ring-orange-500 outline-none text-black
                                    sm:text-sm block pl-10 pr-3 border rounded-md focus:outline-none`}

                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-3 flex items-center text-orange-600 hover:text-orange-800 hover:animate-spin focus:outline-none"
                                    style={{ color: '#ea580c' }}
                                >
                                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Checkbox per filtri di completamento - **STILE "BOTTONE LUMINOSO" APPLICATO QUI - SOLO TAILWIND** */}
                    <div className="space-y-2 px-4">
                        <div className="flex justify-between">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    id="filter-completed"
                                    name="filter-completed"
                                    type="checkbox"
                                    className="appearance-none focus:outline-none mr-2" // **Rimuove aspetto checkbox, outline focus, spazio a destra**
                                    checked={filters.completed}
                                    onChange={(e) => handleFilterChange('completed', e.target.checked)}
                                />
                                <div
                                    className={`relative w-6 h-6 rounded-md border-2 border-gray-300 transition-all duration-200
                                        ${filters.completed ? 'bg-green-800 border-green-600 ring-2 ring-green-200 shadow-green-700 shadow-xl' : 'hover:border-gray-400'}`} // **Tailwind classes for "bottone luminoso" & shadow**
                                >
                                    {filters.completed && <CheckIcon className="absolute inset-0 w-full h-full text-white" />}
                                </div>
                                <span className="text-gray-700" style={{marginLeft: '1.5rem'}}>Fatto</span> {/* Sposta il testo a destra per fare spazio al "bottone"*/}
                            </label>

                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    id="filter-incomplete"
                                    name="filter-incomplete"
                                    type="checkbox"
                                    className="appearance-none focus:outline-none mr-2" // **Rimuove aspetto checkbox, outline focus, spazio a destra**
                                    checked={filters.incomplete}
                                    onChange={(e) => handleFilterChange('incomplete', e.target.checked)}
                                />
                                <div
                                    className={`relative w-6 h-6 rounded-md border-2 border-gray-300 transition-all duration-200
                                        ${filters.incomplete ? 'bg-blue-800 border-blue-600 ring-2 ring-blue-200 shadow-blue-700/50 shadow-lg' : 'hover:border-gray-400'}`} // **Tailwind classes for "bottone luminoso" & shadow**
                                >
                                    {filters.incomplete && <ClockIcon className="absolute inset-0 w-full h-full text-white" />}
                                </div>
                                <span className="text-gray-700" style={{marginLeft: '1.5rem'}}>In Corso..</span> {/* Sposta il testo a destra per fare spazio al "bottone"*/}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterControls;