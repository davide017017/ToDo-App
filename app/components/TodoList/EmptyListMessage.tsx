import React from 'react';
import { TodoType } from '../../page'; 
import { PencilSquareIcon } from '@heroicons/react/24/outline'; 

interface EmptyListMessageProps {
    searchTerm: string;
    displayedTodos: TodoType[];
}

const EmptyListMessage: React.FC<EmptyListMessageProps> = ({ searchTerm, displayedTodos }) => {
    let message = "";
    if (searchTerm && displayedTodos.length === 0) {
        message = `Nessuna corrispondenza per "${searchTerm}".`; 
    } else if (displayedTodos.length === 0) {
        message = "La lista è vuota. Inizia ad aggiungere attività!"; 
    } else {
        return null;
    }

    return (
        <div className="text-center py-4 px-4 rounded-md bg-gray-50 bg-opacity-50 border border-gray-200 border-dashed">
            <PencilSquareIcon className="h-10 w-10 mx-auto text-gray-500 mb-2" aria-hidden="true" /> 
            <p className="text-gray-600 text-sm italic"> 
                {message}
            </p>
        </div>
    );
};

export default EmptyListMessage;