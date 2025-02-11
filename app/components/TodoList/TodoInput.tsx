import React from 'react';

interface TodoInputProps {
    newTodo: string;
    setNewTodo: React.Dispatch<React.SetStateAction<string>>;
    addTodo: () => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ newTodo, setNewTodo, addTodo }) => {
    return (
        <div className="group transition-transform duration-200 focus-within:scale-105">
            <input
                type="text"
                placeholder="Aggiungi una nuova attività..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTodo(); } }}
                className="w-full p-3 border border-black rounded focus:ring-3 focus:ring-blue-500 outline-none text-black text-sm text-center bg-gradient-to-b from-blue-50 to-blue-200 focus:bg-white placeholder-gray-800"
            />
        </div>
    );
};

export default TodoInput;