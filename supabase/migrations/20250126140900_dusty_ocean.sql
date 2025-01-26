/*
  # Add Activity Monitoring

  1. New Tables
    - `activity_logs`: Track user actions and violations
    - `session_metrics`: Monitor session performance and behavior

  2. Security
    - Enable RLS on new tables
    - Add policies for activity monitoring
*/

-- Activity Logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  room_id uuid REFERENCES rooms(id),
  action_type text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Session Metrics table
CREATE TABLE IF NOT EXISTS session_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id),
  session_start timestamptz DEFAULT now(),
  session_end timestamptz,
  tab_switches integer DEFAULT 0,
  copy_paste_attempts integer DEFAULT 0,
  suspicious_activities jsonb DEFAULT '[]'::jsonb
);

-- Enable Row Level Security
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_metrics ENABLE ROW LEVEL SECURITY;

-- Activity Logs Policies
CREATE POLICY "Users can view their own logs"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create logs"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Session Metrics Policies
CREATE POLICY "Users can view their own metrics"
  ON session_metrics
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM participants
    WHERE participants.id = session_metrics.participant_id
    AND participants.user_id = auth.uid()
  ));