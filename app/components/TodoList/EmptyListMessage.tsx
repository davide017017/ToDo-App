import React from 'react';
import { TodoType } from '../../page'; // Adjust path if necessary

interface EmptyListMessageProps {
    searchTerm: string;
    displayedTodos: TodoType[];
}

const EmptyListMessage: React.FC<EmptyListMessageProps> = ({ searchTerm, displayedTodos }) => {
    if (searchTerm && displayedTodos.length === 0) {
        return <p className="text-gray-500 mt-4">Nessuna attività trovata per "{searchTerm}".</p>;
    }
    if (displayedTodos.length === 0) {
        return <p className="text-gray-500 mt-4">Nessuna attività in questa lista. Aggiungine una!</p>;
    }
    return null; // Se ci sono attività o non c'è termine di ricerca, non mostrare il messaggio
};

export default EmptyListMessage;