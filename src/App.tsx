import React from 'react';
import { Layout } from './components/Layout';
import { useAuth } from './hooks/useAuth';
import { Code2, Trophy, Users } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {user.name}!</h2>
          <p className="text-gray-600">
            Ready to tackle some debugging challenges? Join a room or create your own to get started.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Users className="h-6 w-6 text-blue-600" />}
            title="Active Rooms"
            value="12"
            change="+3 from last hour"
          />
          <StatCard
            icon={<Code2 className="h-6 w-6 text-green-600" />}
            title="Problems Solved"
            value="156"
            change="+23 today"
          />
          <StatCard
            icon={<Trophy className="h-6 w-6 text-yellow-600" />}
            title="Your Rank"
            value="#42"
            change="Top 10%"
          />
        </div>

        {/* Active Rooms */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Rooms</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((room) => (
              <RoomCard
                key={room}
                name={`Debug Challenge #${room}`}
                participants={Math.floor(Math.random() * 20) + 5}
                language="Python"
                difficulty="Medium"
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function AuthScreen() {
  const [isLogin, setIsLogin] = React.useState(true);
  const { signIn, signUp } = useAuth();
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        const name = formData.get('name') as string;
        await signUp(email, password, name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to Debug Arena' : 'Create your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
        <div className="ml-4">
          <h4 className="text-sm font-medium text-gray-500">{title}</h4>
          <div className="mt-1">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{change}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomCard({
  name,
  participants,
  language,
  difficulty,
}: {
  name: string;
  participants: number;
  language: string;
  difficulty: string;
}) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-900">{name}</h4>
        <span className="text-sm text-gray-500">{participants} participants</span>
      </div>
      <div className="mt-2 flex space-x-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {language}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          {difficulty}
        </span>
      </div>
    </div>
  );
}

export default App;