import React from 'react';
import { TodoList } from '../../page';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

interface TodoListTabsProps {
    todoLists: TodoList[];
    currentListId: string | null;
    setCurrentListId: React.Dispatch<React.SetStateAction<string | null>>;
}

const TodoListTabs: React.FC<TodoListTabsProps> = ({ todoLists, currentListId, setCurrentListId }) => {
    return (
        <>
            <style jsx>{`
                /* Scrollbar colorata - Blu Vivace */
                .todo-list-tabs-container::-webkit-scrollbar {
                    width: 10px; /* Larghezza leggermente aumentata per maggiore visibilità */
                    height: 10px;
                }

                .todo-list-tabs-container::-webkit-scrollbar-thumb {
                    background-color: #3490dc; /* Blu vivace (simile al blu Tailwind 500) */
                    border-radius: 10px;
                    border: 2px solid transparent; /* Bordo trasparente per separare dal track */
                    background-clip: padding-box; /* Evita che lo sfondo si estenda sotto il bordo */
                }

                .todo-list-tabs-container::-webkit-scrollbar-track {
                    background-color: #f7fafc; /* Grigio molto chiaro (simile al gray-100 Tailwind) */
                    border-radius: 10px; /* Angoli arrotondati per il track */
                }

                .todo-list-tabs-container::-webkit-scrollbar-thumb:hover {
                    background-color: #2779bd; /* Blu leggermente più scuro al hover */
                }
            `}</style>

            <div className="flex border-b border-gray-200 mb-4 overflow-x-auto overflow-y-hidden whitespace-nowrap flex-nowrap todo-list-tabs-container">
                {todoLists.map((list) => (
                    <button
                        key={list.id}
                        className={`px-4 py-2 -mb-px m-2 font-medium text-gray-700 hover:text-gray-900 focus:outline-none shrink-0 transition-opacity duration-200
                                    ${currentListId === list.id
                                        ? 'border-b-4 border-blue-500 text-blue-700 bg-gray-50 shadow-md'
                                        : 'border-b-2 border-transparent hover:border-gray-300 hover:bg-gray-100 opacity-75 hover:opacity-100'
                                    }`}
                        onClick={() => setCurrentListId(list.id)}
                    >
                        <span className="flex items-center">
                            {list.name}
                            {currentListId === list.id && (
                                <ArrowDownIcon className="h-4 w-4 ml-1 text-blue-500" aria-hidden="true" />
                            )}
                        </span>
                    </button>
                ))}
            </div>
        </>
    );
};

export default TodoListTabs;