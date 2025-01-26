# Competitive Debugging Platform Setup Guide

This guide explains how to set up the backend and database for the Competitive Debugging Platform.

## System Architecture

The platform uses:
- Supabase for real-time database and authentication
- WebSocket connections for real-time updates
- Secure room management system
- Browser-based IDE integration

## Database Schema

### Tables Structure

1. **rooms**
   - `id` (uuid, primary key)
   - `key` (text, unique) - Room access key
   - `name` (text) - Room name
   - `created_at` (timestamp)
   - `created_by` (uuid, references users.id)
   - `is_active` (boolean)
   - `settings` (jsonb) - Room configuration

2. **participants**
   - `id` (uuid, primary key)
   - `user_id` (uuid, references users.id)
   - `room_id` (uuid, references rooms.id)
   - `joined_at` (timestamp)
   - `role` (text) - 'organizer', 'participant', 'judge'
   - `status` (text) - 'active', 'disconnected'

3. **problems**
   - `id` (uuid, primary key)
   - `title` (text)
   - `description` (text)
   - `language` (text)
   - `difficulty` (text)
   - `initial_code` (text)
   - `solution` (text)
   - `test_cases` (jsonb)
   - `planted_errors` (jsonb)

4. **submissions**
   - `id` (uuid, primary key)
   - `participant_id` (uuid, references participants.id)
   - `problem_id` (uuid, references problems.id)
   - `code` (text)
   - `status` (text)
   - `started_at` (timestamp)
   - `completed_at` (timestamp)
   - `errors_found` (jsonb)
   - `performance_metrics` (jsonb)

## Setup Instructions

1. **Database Setup**

   Click the "Connect to Supabase" button in the top right corner to create a new project.
   
   After connecting, the following migrations will be created in the `supabase/migrations` directory:

   - `create_tables.sql`: Creates the initial schema
   - `create_policies.sql`: Sets up Row Level Security
   - `seed_problems.sql`: Adds initial problem set

2. **Environment Variables**

   The following environment variables will be automatically configured in your `.env` file:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Authentication Setup**

   - Email and password authentication will be enabled by default
   - User roles will be managed through Supabase policies

4. **Real-time Subscriptions**

   The platform uses Supabase's real-time features for:
   - Room status updates
   - Participant tracking
   - Leaderboard updates
   - Competition progress

## Security Considerations

1. **Row Level Security (RLS)**
   - Participants can only access their assigned rooms
   - Organizers have elevated permissions
   - Judges have read-only access to assigned rooms

2. **Anti-Cheating Measures**
   - Rate limiting on submissions
   - Code similarity detection
   - Session monitoring
   - Input/output validation

## Performance Optimization

1. **Database Indexes**
   - Indexes on frequently queried columns
   - Composite indexes for common query patterns
   - Optimized real-time subscriptions

2. **Caching Strategy**
   - Problem templates cached
   - User session data cached
   - Real-time updates optimized

## Monitoring and Maintenance

1. **Performance Metrics**
   - Active room count
   - Concurrent user tracking
   - Response time monitoring
   - Error rate tracking

2. **Backup Strategy**
   - Automated daily backups
   - Point-in-time recovery
   - Competition data archival

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Database Migrations**
   - New migrations should be added to `supabase/migrations`
   - Follow the naming convention: `YYYYMMDDHHMMSS_description.sql`

3. **Testing**
   - Unit tests for problem generation
   - Integration tests for real-time features
   - Load testing for concurrent users

## Deployment

1. **Production Deployment**
   - Configure production environment
   - Set up SSL certificates
   - Configure CORS policies

2. **Scaling Considerations**
   - Database connection pooling
   - WebSocket connection limits
   - Rate limiting configuration

## Support and Troubleshooting

1. **Common Issues**
   - Connection handling
   - Real-time subscription management
   - Authentication flows

2. **Monitoring Tools**
   - Supabase dashboard
   - Custom logging implementation
   - Error tracking integration

## Next Steps

1. Set up the Supabase project using the "Connect to Supabase" button
2. Review and apply the database migrations
3. Configure authentication settings
4. Implement the frontend components
5. Test the real-time functionality
6. Deploy the application

For detailed API documentation and frontend implementation details, refer to the respective documentation files in the project.