'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate saving profile data
    // In a real application, you would make an API call here
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect would happen in a wrapper component
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profile</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-soft overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-500 to-indigo-500 text-white p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-2 rounded-full">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">{formData.name || 'User Profile'}</CardTitle>
                    <p className="text-white/80">{formData.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</h3>
                        <p className="text-slate-800 dark:text-slate-200">{formData.name || 'Not provided'}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email</h3>
                        <p className="text-slate-800 dark:text-slate-200">{formData.email || 'Not provided'}</p>
                      </div>

                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Bio</h3>
                        <p className="text-slate-800 dark:text-slate-200">
                          {formData.bio || 'No bio provided'}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">Account Settings</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-slate-200">Change Password</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Update your account password</p>
                          </div>
                          <Button variant="outline">Change</Button>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-slate-200">Notification Preferences</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your notification settings</p>
                          </div>
                          <Button variant="outline">Configure</Button>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-slate-200">Privacy Settings</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Control your privacy preferences</p>
                          </div>
                          <Button variant="outline">Manage</Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}