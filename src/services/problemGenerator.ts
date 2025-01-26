import { Problem } from '../types';

const PROBLEM_TEMPLATES = {
  python: {
    easy: [
      {
        title: 'Sum of Two Numbers',
        description: 'Write a function that returns the sum of two numbers.',
        initialCode: `def add_numbers(a, b):
    # Fix the bug in this function
    return a - b  # Bug: Using subtraction instead of addition`,
        solution: `def add_numbers(a, b):
    return a + b`,
        testCases: [
          { input: '2, 3', output: '5' },
          { input: '-1, 1', output: '0' },
          { input: '0, 0', output: '0' },
        ],
        plantedErrors: [{ line: 2, description: 'Using subtraction instead of addition' }],
      },
    ],
    medium: [
      {
        title: 'Find Missing Number',
        description: 'Find the missing number in an array of consecutive integers.',
        initialCode: `def find_missing(arr):
    # Fix the bugs in this function
    n = len(arr)
    expected_sum = n * (n + 1) / 2  # Bug: Should use n+1 for total range
    actual_sum = sum(arr)
    return expected_sum - actual_sum`,
        solution: `def find_missing(arr):
    n = len(arr) + 1
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(arr)
    return int(expected_sum - actual_sum)`,
        testCases: [
          { input: '[0,1,3]', output: '2' },
          { input: '[1,2,4,5]', output: '3' },
        ],
        plantedErrors: [
          { line: 3, description: 'Incorrect range calculation' },
          { line: 3, description: 'Integer division needed' },
        ],
      },
    ],
  },
  javascript: {
    easy: [
      {
        title: 'Reverse String',
        description: 'Write a function that reverses a string.',
        initialCode: `function reverseString(str) {
  // Fix the bug in this function
  return str.split('').join('');  // Bug: Missing reverse step
}`,
        solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
        testCases: [
          { input: '"hello"', output: '"olleh"' },
          { input: '"world"', output: '"dlrow"' },
        ],
        plantedErrors: [{ line: 2, description: 'Missing reverse() method call' }],
      },
    ],
  },
};

export function generateProblem(language: string, difficulty: string): Problem {
  const templates = PROBLEM_TEMPLATES[language]?.[difficulty];
  if (!templates || templates.length === 0) {
    throw new Error(`No templates available for ${language} - ${difficulty}`);
  }

  // Randomly select a template
  const template = templates[Math.floor(Math.random() * templates.length)];

  // Add some randomization to the problem
  const randomizedProblem = {
    ...template,
    id: crypto.randomUUID(),
    language,
    difficulty,
    testCases: template.testCases.map(tc => ({
      ...tc,
      // Add some random test cases based on the template
      input: tc.input,
      output: tc.output,
    })),
  };

  return randomizedProblem;
}

export function validateCode(code: string): boolean {
  // Anti-cheating validation
  const forbiddenPatterns = [
    'import os',
    'import sys',
    'eval(',
    'exec(',
    '__import__',
    'subprocess',
    'open(',
    'fetch(',
    'XMLHttpRequest',
    'WebSocket',
  ];

  return !forbiddenPatterns.some(pattern => code.includes(pattern));
}

export function detectPlagiarism(code: string, otherSubmissions: string[]): boolean {
  // Simple similarity check (can be enhanced with more sophisticated algorithms)
  const normalizedCode = code.replace(/\s+/g, '').toLowerCase();
  
  return otherSubmissions.some(submission => {
    const normalizedSubmission = submission.replace(/\s+/g, '').toLowerCase();
    const similarity = calculateSimilarity(normalizedCode, normalizedSubmission);
    return similarity > 0.9; // 90% similarity threshold
  });
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const longerLength = longer.length;
  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],    // deletion
          dp[i][j - 1],    // insertion
          dp[i - 1][j - 1] // substitution
        );
      }
    }
  }

  return dp[m][n];
}