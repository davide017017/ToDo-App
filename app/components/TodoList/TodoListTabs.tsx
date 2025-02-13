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
            {/* Stili scrollbar (INLINE - Tailwind non gestisce direttamente le scrollbar) */}
            <style jsx>{`
                .todo-list-tabs-container::-webkit-scrollbar {
                    width: 17px;
                    height: 17px;
                }
                .todo-list-tabs-container::-webkit-scrollbar-thumb {
                    background-color: #56CCF2; /* Blu Smeraldo (più chiaro e vivace del blu originale) */
                    border-radius: 7px;
                    border: 3px solid transparent;
                    background-clip: padding-box;
                    transition: background-color 0.3s ease, border-color 0.3s ease;
                    box-shadow: 0 0 0 1px rgba(0,0,0,0.7); /* Ombra sottile per profondità */
                }
                .todo-list-tabs-container::-webkit-scrollbar-track {
                    background-color: #F8F4F0; /* Grigio Caldo molto chiaro (simile al beige caldo) */
                    border-radius: 7px;
                    background-clip: padding-box;
                    transition: background-color 0.3s ease;
                }
                .todo-list-tabs-container::-webkit-scrollbar-thumb:hover {
                    background-color: #42A5CC; /* Blu Smeraldo leggermente più scuro */
                    border-color: #E8E3DF; /* Grigio Caldo leggermente più chiaro su hover */
                }
                .todo-list-tabs-container::-webkit-scrollbar-track:hover {
                    background-color: #F2EDE9; /* Grigio Caldo leggermente più scuro track hover */
                }
                .todo-list-tabs-container::-webkit-scrollbar-thumb:active {
                    background-color: #2E7BB8; /* Blu Smeraldo ancora più scuro per "active" */
                    border-color: #DAD5D2; /* Grigio caldo più scuro su active */
                    box-shadow: 0 0 0 2px rgba(0,0,0,0.2); /* Ombra più marcata su "active" */
                }
                .todo-list-tabs-container::-webkit-scrollbar-track:active {
                    background-color: #ECE7E3; /* Grigio Caldo track active leggermente più scuro */
                }
            `}</style>

            <div className="flex border-b border-black overflow-x-auto overflow-y-hidden whitespace-nowrap todo-list-tabs-container">
                {todoLists.map((list) => (
                    <button
                        key={list.id}
                        className={`px-4 py-2 -mb-px m-2 font-medium focus:outline-none shrink-0 transition-opacity duration-200 rounded-t-md text-center 
                                    ${currentListId === list.id
                                        ? 'text-black bg-gray-50 shadow-md border-b-4 border-blue-500' 
                                        : 'text-white border-b-2 border-transparent hover:border-gray-300 hover:bg-gray-200 hover:text-gray-900 opacity-75 hover:opacity-100 bg-gray-700' 
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