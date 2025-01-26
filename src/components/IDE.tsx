import React, { useState, useEffect } from 'react';
import { Play, Save } from 'lucide-react';

interface IDEProps {
  initialCode: string;
  language: string;
  onRun: (code: string) => void;
  onSave: (code: string) => void;
}

export function IDE({ initialCode, language, onRun, onSave }: IDEProps) {
  const [code, setCode] = useState(initialCode);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => String(i + 1)));
  }, [code]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      e.currentTarget.value = value.substring(0, start) + '  ' + value.substring(end);
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">{language}</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSave(code)}
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRun(code)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700"
          >
            <Play className="h-4 w-4" />
            <span className="text-sm">Run</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex">
        {/* Line Numbers */}
        <div className="px-4 py-4 bg-gray-800 text-gray-500 select-none">
          {lineNumbers.map((num) => (
            <div key={num} className="text-xs leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm leading-6 resize-none outline-none"
          spellCheck="false"
          rows={20}
        />
      </div>
    </div>
  );
}