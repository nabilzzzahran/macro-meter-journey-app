
import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Activity } from 'lucide-react';
import UserSelector from '../components/UserSelector';
import Dashboard from '../components/Dashboard';
import { User } from '../types/fitness';

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('fitnessUsers');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers);
      if (parsedUsers.length > 0) {
        setCurrentUser(parsedUsers[0]);
      }
    }
  }, []);

  useEffect(() => {
    // Save users to localStorage whenever users change
    localStorage.setItem('fitnessUsers', JSON.stringify(users));
  }, [users]);

  const addUser = (user: User) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setShowCreateUser(false);
  };

  if (users.length === 0 && !showCreateUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to FitTracker</h1>
          <p className="text-gray-600 mb-8">Track your nutrition, monitor your progress, and achieve your fitness goals with ease.</p>
          <button
            onClick={() => setShowCreateUser(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Create Your Profile
          </button>
        </div>
      </div>
    );
  }

  if (showCreateUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
        <UserSelector onUserCreate={addUser} onBack={() => setShowCreateUser(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FitTracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={currentUser?.id || ''}
                onChange={(e) => {
                  const user = users.find(u => u.id === e.target.value);
                  setCurrentUser(user || null);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowCreateUser(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {currentUser && <Dashboard user={currentUser} onUserUpdate={(updatedUser) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
      }} />}
    </div>
  );
};

export default Index;
