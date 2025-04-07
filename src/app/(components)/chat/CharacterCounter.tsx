import { useEffect, useState } from 'react';

interface CharacterCounterProps {
  text: string;
  maxLength: number;
}

export default function CharacterCounter({ text, maxLength }: CharacterCounterProps) {
  const [charactersLeft, setCharactersLeft] = useState(maxLength);
  
  useEffect(() => {
    setCharactersLeft(maxLength - text.length);
  }, [text, maxLength]);

  return (
    <div className="relative">
      <div 
        className={`absolute right-3 bottom-2.5 text-xs font-medium ${
          charactersLeft <= 10 
            ? 'text-red-500' 
            : charactersLeft <= 30 
              ? 'text-amber-500' 
              : 'text-gray-400'
        }`}
      >
        {charactersLeft}
      </div>
      {text.trim().length === maxLength && (
        <p className="text-xs text-red-500 mt-1 ml-1">
          Limite máximo de caracteres atingido
        </p>
      )}
    </div>
  );
}