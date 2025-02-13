'use client'

import React from 'react';
import SortControls from './SortControls';
import FilterControls from '../Filter/FilterControls';
import { SortOrderType, FilterByType } from '../../page';

interface SortAndFilterControlsProps {
    sortOrder: SortOrderType;
    sortOrderIcons: { [key in SortOrderType]: React.ReactNode };
    toggleSortDropdown: () => void;
    showSortDropdown: boolean;
    handleSortOrderChange: (newOrder: SortOrderType) => void;
    setShowSortDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    showFilters: boolean;
    setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
    filters: FilterByType;
    setFilters: React.Dispatch<React.SetStateAction<FilterByType>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    handleFilterChange: (filterName: keyof FilterByType, isEnabled: boolean) => void;
}

const SortAndFilterControls: React.FC<SortAndFilterControlsProps> = ({
    sortOrder,
    sortOrderIcons,
    toggleSortDropdown,
    showSortDropdown,
    handleSortOrderChange,
    setShowSortDropdown,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    handleFilterChange
}) => {
    return (
        <div className="mt-2 mb-4 flex items-center justify-between relative">
            <SortControls
                sortOrder={sortOrder}
                sortOrderIcons={sortOrderIcons}
                toggleSortDropdown={toggleSortDropdown}
                showSortDropdown={showSortDropdown}
                handleSortOrderChange={handleSortOrderChange}
                setShowSortDropdown={setShowSortDropdown}
            />
            <FilterControls
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                filters={filters}
                setFilters={setFilters}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleFilterChange={handleFilterChange}
            />
        </div>
    );
};

export default SortAndFilterControls;