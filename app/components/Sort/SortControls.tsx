import React from 'react';
import SortDropdown from './SortDropdown';
import { SortOrderType } from '../../page';
import { NumberedListIcon } from '@heroicons/react/24/outline'; 

interface SortControlsProps {
    sortOrder: SortOrderType;
    sortOrderIcons: { [key: string]: React.ReactNode }; 
    toggleSortDropdown: () => void;
    showSortDropdown: boolean;
    handleSortOrderChange: (newOrder: SortOrderType) => void;
    setShowSortDropdown: (show: boolean) => void;
}

const SortControls: React.FC<SortControlsProps> = ({
    sortOrder,
    sortOrderIcons,
    toggleSortDropdown,
    showSortDropdown,
    handleSortOrderChange,
    setShowSortDropdown
}) => (
    <div className="flex items-center space-x-2">
        <button
            onClick={toggleSortDropdown}
            className={`
                bg-gradient-to-r from-gray-300 to-gray-100
                border border-gray-800 rounded-lg p-2 m-1 transition-colors duration-500 flex items-center
                hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-800
                ${showSortDropdown ? 'outline-2 outline-blue-500 shadow-md shadow-blue-200/50' : ''}
            `}
        >
            <NumberedListIcon className="h-5 w-5 mx-2" />
            <span>Ordina per: </span> 
            <span className='mx-1'> 
                {sortOrderIcons[sortOrder]} 
            </span>
        </button>
        <SortDropdown
            showSortDropdown={showSortDropdown}
            sortOrder={sortOrder}
            handleSortOrderChange={handleSortOrderChange}
            setShowSortDropdown={setShowSortDropdown}
        />
    </div>
);

export default SortControls;