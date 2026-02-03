'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    appearance: {
      darkMode: false,
      fontSize: 'medium',
    },
    privacy: {
      profileVisibility: 'public',
      shareActivity: true,
    },
    integrations: {
      googleCalendar: false,
      slack: false,
      github: true,
    }
  });

  const handleSettingChange = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // In a real application, you would save settings to the backend
    alert('Settings saved successfully!');
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
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Notification Settings */}
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Email Notifications</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Push Notifications</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive push notifications on your devices</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">SMS Notifications</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive important updates via SMS</p>
                  </div>
                  <Switch
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Dark Mode</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enable dark theme for the application</p>
                  </div>
                  <Switch
                    checked={settings.appearance.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('appearance', 'darkMode', checked)}
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Font Size</h4>
                  <div className="flex space-x-4">
                    {(['small', 'medium', 'large'] as const).map(size => (
                      <label key={size} className="flex items-center">
                        <input
                          type="radio"
                          name="fontSize"
                          checked={settings.appearance.fontSize === size}
                          onChange={() => handleSettingChange('appearance', 'fontSize', size)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300 capitalize">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Profile Visibility</h4>
                  <div className="flex space-x-4">
                    {(['public', 'private', 'friends'] as const).map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          checked={settings.privacy.profileVisibility === option}
                          onChange={() => handleSettingChange('privacy', 'profileVisibility', option)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300 capitalize">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Share Activity</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Allow others to see your activity</p>
                  </div>
                  <Switch
                    checked={settings.privacy.shareActivity}
                    onCheckedChange={(checked) => handleSettingChange('privacy', 'shareActivity', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Integrations */}
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Google Calendar</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Sync tasks with Google Calendar</p>
                  </div>
                  <Switch
                    checked={settings.integrations.googleCalendar}
                    onCheckedChange={(checked) => handleSettingChange('integrations', 'googleCalendar', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Slack</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications in Slack</p>
                  </div>
                  <Switch
                    checked={settings.integrations.slack}
                    onCheckedChange={(checked) => handleSettingChange('integrations', 'slack', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">GitHub</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect with your GitHub account</p>
                  </div>
                  <Switch
                    checked={settings.integrations.github}
                    onCheckedChange={(checked) => handleSettingChange('integrations', 'github', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 px-6"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}