import React, { useState } from 'react';
import { IDE } from './IDE';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface TestCase {
  input: string;
  output: string;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: string;
  initialCode: string;
  testCases: TestCase[];
}

interface ProblemViewProps {
  problem: Problem;
  onSubmit: (code: string) => Promise<void>;
}

export function ProblemView({ problem, onSubmit }: ProblemViewProps) {
  const [results, setResults] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  const handleRun = async (code: string) => {
    try {
      await onSubmit(code);
      setResults({
        status: 'success',
        message: 'All test cases passed! Great job!',
      });
    } catch (error) {
      setResults({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to run code',
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Problem Description */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{problem.title}</h2>
          <div className="flex space-x-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {problem.language}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {problem.difficulty}
            </span>
          </div>
          <div className="prose prose-sm max-w-none">
            {problem.description}
          </div>
        </div>

        {/* Test Cases */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Cases</h3>
          <div className="space-y-4">
            {problem.testCases.map((testCase, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Input:</span>
                  <pre className="mt-1 text-sm bg-gray-50 p-2 rounded">{testCase.input}</pre>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Expected Output:</span>
                  <pre className="mt-1 text-sm bg-gray-50 p-2 rounded">{testCase.output}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IDE and Results */}
      <div className="space-y-6">
        <IDE
          initialCode={problem.initialCode}
          language={problem.language}
          onRun={handleRun}
          onSave={() => {}}
        />

        {results.status && (
          <div
            className={`p-4 rounded-lg ${
              results.status === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            <div className="flex items-center">
              {results.status === 'success' ? (
                <CheckCircle2 className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <p className="text-sm font-medium">{results.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}