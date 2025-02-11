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
                /* Scrollbar colorata - Blu Vivace (INLINE STYLES - TailWind non la gestisce nativamente) */
                .todo-list-tabs-container::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .todo-list-tabs-container::-webkit-scrollbar-thumb {
                    background-color: #3490dc;
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: padding-box;
                }
                .todo-list-tabs-container::-webkit-scrollbar-track {
                    background-color: #f7fafc;
                    border-radius: 10px;
                }
                .todo-list-tabs-container::-webkit-scrollbar-thumb:hover {
                    background-color: #2779bd;
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