/*
  # Initial Schema Setup for Debug Arena

  1. New Tables
    - `rooms`: Competition rooms with settings and access control
    - `problems`: Programming problems with test cases and planted errors
    - `submissions`: User submissions and performance tracking
    - `participants`: Room participation tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for room access and submission control
*/

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{
    "languages": ["python", "javascript", "java", "cpp"],
    "timeLimit": 3600,
    "maxParticipants": 50
  }'::jsonb
);

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  language text NOT NULL,
  difficulty text NOT NULL,
  initial_code text NOT NULL,
  solution text NOT NULL,
  test_cases jsonb NOT NULL,
  planted_errors jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  room_id uuid REFERENCES rooms(id),
  joined_at timestamptz DEFAULT now(),
  role text DEFAULT 'participant',
  status text DEFAULT 'active',
  UNIQUE(user_id, room_id)
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id),
  problem_id uuid REFERENCES problems(id),
  code text NOT NULL,
  status text DEFAULT 'pending',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  errors_found jsonb DEFAULT '[]'::jsonb,
  performance_metrics jsonb DEFAULT '{
    "timeSpent": 0,
    "memoryUsed": 0,
    "score": 0
  }'::jsonb
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Room Policies
CREATE POLICY "Users can view active rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Organizers can create rooms"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Problem Policies
CREATE POLICY "Users can view problems in their rooms"
  ON problems
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM participants
    WHERE participants.user_id = auth.uid()
  ));

-- Participant Policies
CREATE POLICY "Users can view participants in their rooms"
  ON participants
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM rooms
    WHERE rooms.id = participants.room_id
    AND (rooms.created_by = auth.uid() OR participants.user_id = auth.uid())
  ));

CREATE POLICY "Users can join rooms"
  ON participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Submission Policies
CREATE POLICY "Users can view their submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM participants
    WHERE participants.id = submissions.participant_id
    AND participants.user_id = auth.uid()
  ));

CREATE POLICY "Users can create submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM participants
    WHERE participants.id = submissions.participant_id
    AND participants.user_id = auth.uid()
  ));