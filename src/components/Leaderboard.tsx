import React from 'react';
import { Trophy, Medal } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  score: number;
  problemsSolved: number;
  averageTime: number;
}

interface LeaderboardProps {
  participants: Participant[];
}

export function Leaderboard({ participants }: LeaderboardProps) {
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
  const topThree = sortedParticipants.slice(0, 3);
  const rest = sortedParticipants.slice(3);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Top 3 Podium */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
          Top Performers
        </h2>
        
        <div className="flex justify-center items-end space-x-4">
          {topThree.map((participant, index) => (
            <div
              key={participant.id}
              className={`flex flex-col items-center ${
                index === 1 ? 'order-1' : index === 0 ? 'order-2' : 'order-3'
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold">
                  {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                </span>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{participant.name}</div>
                <div className="text-sm text-gray-500">{participant.score} pts</div>
              </div>
              <div
                className={`w-full mt-2 rounded-t-lg ${
                  index === 1
                    ? 'h-32 bg-yellow-500'
                    : index === 0
                    ? 'h-28 bg-gray-400'
                    : 'h-24 bg-orange-400'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="pb-4">Rank</th>
              <th className="pb-4">Name</th>
              <th className="pb-4 text-right">Problems</th>
              <th className="pb-4 text-right">Avg Time</th>
              <th className="pb-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {rest.map((participant, index) => (
              <tr key={participant.id} className="border-t">
                <td className="py-4">{index + 4}</td>
                <td className="py-4">{participant.name}</td>
                <td className="py-4 text-right">{participant.problemsSolved}</td>
                <td className="py-4 text-right">{participant.averageTime}s</td>
                <td className="py-4 text-right font-medium">{participant.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}