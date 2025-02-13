import React from 'react';
import { TodoType } from '../../page'; 
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TodoItemProps {
    todo: TodoType;
    index: number;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    itemsToRemove: string[];
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, index, toggleTodo, deleteTodo, itemsToRemove }) => {
    const isRemoving = itemsToRemove.includes(todo.id);

    return (
            <li
                key={todo.id}
                className={`font-mono p-3 flex items-center justify-between rounded shadow-sm hover:shadow-md transition-all duration-300
                    ${todo.completed ? 'bg-green-100 border-green-300 text-gray-400 line-through opacity-70' : `${index % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'} border border-gray-300 text-gray-600`}
                    ${isRemoving ? 'opacity-0 translate-x-full bg-red-200' : ''}`}
                style={{ transitionProperty: 'opacity, transform' }}
            >
                <div className="flex items-start w-full">
                    <button onClick={() => toggleTodo(todo.id)} className="cursor-pointer flex items-center justify-center w-7 h-7 rounded hover:animate-pulse hover:scale-105 focus:outline-none relative shrink-0" aria-label={todo.completed ? "Segna come non completato" : "Segna come completato"}>
                        {!todo.completed && <div className="absolute inset-0 rounded-full border border-gray-400"></div>}
                        {todo.completed && <CheckIcon className="w-8 h-8 text-green-500" />}
                    </button>
                    <span className="px-2 flex-grow break-anywhere">{todo.text}</span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} aria-label={`Elimina ${todo.text}`} className="text-red-400 hover:text-red-800 hover:animate-spin focus:outline-none shrink-0">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </li>
    );
};

export default TodoItem;