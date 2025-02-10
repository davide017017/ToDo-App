// components/TodoList/TodoInput.tsx
import React from 'react';

interface TodoInputProps {
    newTodo: string;
    setNewTodo: React.Dispatch<React.SetStateAction<string>>;
    addTodo: () => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ newTodo, setNewTodo, addTodo }) => {
    return (
        // ... (JSX per l'input di nuove todo che hai in Home.tsx) ...
        <div className="mb-4">
            <input
                type="text"
                placeholder="Aggiungi una nuova attività..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTodo(); } }}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black text-sm"
            />
        </div>
    );
};

export default TodoInput;