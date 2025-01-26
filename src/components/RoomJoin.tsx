import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { KeyRound } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface RoomJoinProps {
  onJoin: (roomId: string) => void;
}

export function RoomJoin({ onJoin }: RoomJoinProps) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Find room by key
      const { data: rooms, error: roomError } = await supabase
        .from('rooms')
        .select('id, name, settings')
        .eq('key', key.toUpperCase())
        .eq('is_active', true)
        .single();

      if (roomError) throw roomError;
      if (!rooms) throw new Error('Room not found');

      // Check if room is full
      const { count, error: countError } = await supabase
        .from('participants')
        .select('*', { count: 'exact' })
        .eq('room_id', rooms.id);

      if (countError) throw countError;
      if (count >= rooms.settings.maxParticipants) {
        throw new Error('Room is full');
      }

      // Join room
      const { error: joinError } = await supabase
        .from('participants')
        .insert([{ room_id: rooms.id }]);

      if (joinError) throw joinError;

      onJoin(rooms.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <KeyRound className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Join a Room</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-gray-700">
            Room Key
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter 6-digit room key"
              maxLength={6}
              pattern="[A-Z0-9]{6}"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Enter the 6-digit key provided by the room organizer
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || key.length !== 6}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Joining...' : 'Join Room'}
        </button>
      </form>
    </div>
  );
}