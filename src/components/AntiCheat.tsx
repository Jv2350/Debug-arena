import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface AntiCheatProps {
  onViolation: (type: string) => void;
}

export function AntiCheat({ onViolation }: AntiCheatProps) {
  const violations = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        violations.current.add('tab_switch');
        onViolation('Tab switching detected');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common dev tools shortcuts
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        violations.current.add('dev_tools');
        onViolation('Attempted to open developer tools');
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      violations.current.add('copy');
      onViolation('Copy action detected');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      violations.current.add('paste');
      onViolation('Paste action detected');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      violations.current.add('right_click');
      onViolation('Right-click detected');
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onViolation]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {violations.current.size > 0 && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-medium">Security Alert</p>
            <p className="text-sm">Suspicious activity detected</p>
          </div>
        </div>
      )}
    </div>
  );
}