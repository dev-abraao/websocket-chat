import HandleName from "@/app/handlers/HandleName";
import React, { useEffect, useState } from "react";
import { FiUser, FiLogOut, FiCheck } from "react-icons/fi";

interface InputNameProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
}

export default function InputName({ name, setName }: InputNameProps) {
    const [hasName, setHasName] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const savedName = localStorage.getItem("name");
        if (savedName) {
            setName(savedName);
            setHasName(true);
        } else {
            setIsEditing(true);
        }
    }, [setName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            HandleName(e, name);
            setHasName(true);
            setIsEditing(false);
        }
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.removeItem("name");
        setName("Anônimo");
        setHasName(false);
        setIsEditing(true);
    };

    return (
        <div className="bg-gray-50 border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-6 py-4">
                {hasName && !isEditing ? (
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="bg-green-100 h-8 w-8 rounded-full flex items-center justify-center mr-2">
                                <FiUser className="text-green-700 text-sm" />
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Conectado como</span>
                                <h3 className="font-medium text-gray-800">{name}</h3>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="text-sm text-gray-600 hover:text-green-600 font-medium px-3 py-1 rounded-md hover:bg-gray-100 flex items-center transition-colors"
                            >
                                Editar
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="text-sm text-gray-600 hover:text-red-600 font-medium px-3 py-1 rounded-md hover:bg-gray-100 flex items-center transition-colors"
                            >
                                <FiLogOut className="mr-1" />
                                Sair
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-shrink-0">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <FiUser className="mr-1" /> 
                                Como devemos chamá-lo?
                            </label>
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full text-sm border border-gray-300 bg-white rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                required
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!name.trim()}
                                className={`absolute right-1 top-1 rounded-md p-1.5 ${
                                    name.trim() ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <FiCheck size={18} />
                            </button>
                        </div>
                        {hasName && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="text-sm text-gray-600 font-medium px-3 py-1.5 rounded-md hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}
