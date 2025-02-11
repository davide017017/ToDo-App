import React, { useRef, useEffect } from 'react';
import { SortOrderType } from '../../page';
import {
    ListBulletIcon, 
    CalendarDaysIcon, 
    BarsArrowDownIcon, 
    BarsArrowUpIcon 
} from '@heroicons/react/24/outline';

interface SortDropdownProps {
    showSortDropdown: boolean;
    sortOrder: SortOrderType;
    handleSortOrderChange: (newOrder: SortOrderType) => void;
    setShowSortDropdown: (show: boolean) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ showSortDropdown, sortOrder, handleSortOrderChange, setShowSortDropdown }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && showSortDropdown && !dropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSortDropdown, setShowSortDropdown]);

    if (!showSortDropdown) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute mt-2 w-fit p-1 rounded-md shadow-xl shadow-black bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"  // Ombra nera più marcata
            tabIndex={0}
            onBlur={() => setShowSortDropdown(false)}
        >
            <div
                className="py-1 flex flex-col items-stretch"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu-button"
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSortOrderChange('recent');
                        setShowSortDropdown(false);
                    }}
                    className={`group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${sortOrder === 'recent' ? 'font-bold bg-green-100' : ''}`} // Sfondo verde chiaro per selezionato
                    role="menuitem"
                >
                    <ListBulletIcon className="h-5 w-5 mr-2 text-gray-500 group-hover:text-gray-700" aria-hidden="true" /> {/* Icona "Più Recenti" cambiata */}
                    Più recenti
                    {sortOrder === 'recent' && <span className="ml-auto font-bold text-green-500" aria-hidden="true">✓</span>}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSortOrderChange('oldest');
                        setShowSortDropdown(false);
                    }}
                    className={`group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${sortOrder === 'oldest' ? 'font-bold bg-green-100' : ''}`} // Sfondo verde chiaro per selezionato
                    role="menuitem"
                >
                    <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-500 group-hover:text-gray-700" aria-hidden="true" /> {/* Icona "Meno Recenti" cambiata */}
                    Meno recenti
                    {sortOrder === 'oldest' && <span className="ml-auto font-bold text-green-500" aria-hidden="true">✓</span>}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSortOrderChange('alphaAsc');
                        setShowSortDropdown(false);
                    }}
                    className={`group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${sortOrder === 'alphaAsc' ? 'font-bold bg-green-100' : ''}`} // Sfondo verde chiaro per selezionato
                    role="menuitem"
                >
                    <BarsArrowDownIcon className="h-5 w-5 mr-2 text-gray-500 group-hover:text-gray-700" aria-hidden="true" /> {/* Icona "A-Z" cambiata */}
                    A-Z
                    {sortOrder === 'alphaAsc' && <span className="ml-auto font-bold text-green-500" aria-hidden="true">✓</span>}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSortOrderChange('alphaDesc');
                        setShowSortDropdown(false);
                    }}
                    className={`group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${sortOrder === 'alphaDesc' ? 'font-bold bg-green-100' : ''}`} // Sfondo verde chiaro per selezionato
                    role="menuitem"
                >
                    <BarsArrowUpIcon className="h-5 w-5 mr-2 text-gray-500 group-hover:text-gray-700" aria-hidden="true" /> {/* Icona "Z-A" cambiata */}
                    Z-A
                    {sortOrder === 'alphaDesc' && <span className="ml-auto font-bold text-green-500" aria-hidden="true">✓</span>}
                </button>
            </div>
        </div>
    );
};

export default SortDropdown;