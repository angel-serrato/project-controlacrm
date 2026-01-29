import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Lock,
  Bell,
  History,
  LogOut,
  FileText,
  CheckCircle,
  Clock,
} from 'lucide-react';

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 animate-pulse">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="mt-2 h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        <Card className="mb-6 animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-24 bg-gray-200 dark:bg-gray-700"></Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error Alert
function ErrorAlert({ message, onRetry }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
          <div className="p-6 flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                Error Loading Profile
              </h3>
              <p className="mt-2 text-red-800 dark:text-red-200">{message}</p>
              <button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Sub-component: Profile Header
function ProfileHeader({ user, onEditClick, isEditing = false }) {
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase() || 'U';

  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-green-400 to-green-600',
  ];
  const colorIndex = (user?.id?.charCodeAt(0) || 0) % colors.length;

  return (
    <Card className="mb-6 shadow-md overflow-hidden">
      <CardHeader className="pb-4 bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br ${colors[colorIndex]} text-white text-3xl font-bold shadow-lg`}
              aria-label={`${user?.name} avatar`}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {user?.name || 'User'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {user?.status && `${user.status} · `}
                Joined{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'recently'}
              </p>
            </div>
          </div>

          <Button
            onClick={onEditClick}
            variant="outline"
            disabled={isEditing}
            className="whitespace-nowrap"
          >
            {isEditing ? 'Editing...' : 'Edit Profile'}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

// Sub-component: Profile Stats
function ProfileStats({ user, stats = null }) {
  const defaultStats = [
    {
      id: 'contacts',
      label: 'Total Contacts',
      value: user?.contactCount || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      id: 'status',
      label: 'Account Status',
      value: user?.status || 'Active',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      id: 'updated',
      label: 'Last Updated',
      value: user?.updatedAt
        ? new Date(user.updatedAt).toLocaleDateString()
        : 'N/A',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
      {displayStats.map((stat) => {
        const Icon = stat.icon || null;
        return (
          <Card
            key={stat.id || stat.label}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <CardContent className="pt-6">
              <div className={`rounded-lg p-4 ${stat.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  {Icon && (
                    <Icon className={`h-8 w-8 ${stat.color} opacity-20`} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Sub-component: Profile Info
function ProfileInfo({ user }) {
  const infoItems = [
    { label: 'Email', value: user?.email },
    { label: 'Phone', value: user?.phone || 'Not provided' },
    { label: 'Location', value: user?.location || 'Not provided' },
    {
      label: 'Join Date',
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : 'Unknown',
    },
  ];

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {infoItems.map((item) => (
            <div key={item.label}>
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="mt-1 text-base text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Sub-component: Profile Edit Form
const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
  },
  phone: {
    pattern: /^[+]?[0-9\s()-]*$/,
  },
  location: {
    maxLength: 100,
  },
};

function ProfileEditForm({ user, onSave, onCancel, isSaving = false }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const rules = VALIDATION_RULES[name];
    if (!rules) return '';

    if (rules.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${name} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name} must not exceed ${rules.maxLength} characters`;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return `${name} format is invalid`;
    }

    return '';
  };

  const isFormValid = useMemo(() => {
    return Object.keys(formData).every(
      (key) => key === 'email' || !validateField(key, formData[key])
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'email') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const fields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Your full name',
      disabled: false,
      helperText: 'Required (2-100 characters)',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your.email@example.com',
      disabled: true,
      helperText: 'Email cannot be changed',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+1 (555) 123-4567',
      disabled: false,
      helperText: 'Optional',
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'City, Country',
      disabled: false,
      helperText: 'Optional',
    },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={field.placeholder}
                disabled={field.disabled || isSaving}
                className={`mt-1 ${
                  touched[field.name] && errors[field.name]
                    ? 'border-red-500 focus:border-red-500'
                    : ''
                }`}
                aria-invalid={touched[field.name] && !!errors[field.name]}
              />
              {touched[field.name] && errors[field.name] ? (
                <p className="mt-1 text-xs text-red-500">
                  {errors[field.name]}
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">{field.helperText}</p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Sub-component: Profile Actions
function ProfileActions({
  onChangePassword,
  onNotifications,
  onActivityLog,
  onLogout,
}) {
  const actions = [
    {
      id: 'password',
      icon: Lock,
      label: 'Change Password',
      onClick: onChangePassword,
      variant: 'outline',
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      onClick: onNotifications,
      variant: 'outline',
    },
    {
      id: 'activity',
      icon: History,
      label: 'Activity Log',
      onClick: onActivityLog,
      variant: 'outline',
    },
  ];

  const dangerousActions = [
    {
      id: 'logout',
      icon: LogOut,
      label: 'Logout',
      onClick: onLogout,
      variant: 'destructive',
    },
  ];

  return (
    <Card className="shadow-md sticky top-20">
      <CardHeader>
        <CardTitle className="text-lg">Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              onClick={action.onClick}
              variant={action.variant}
              className="w-full justify-start text-left"
            >
              <Icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          );
        })}

        <div className="my-3 border-t border-gray-200 dark:border-gray-700" />

        {dangerousActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              onClick={action.onClick}
              variant={action.variant}
              className="w-full justify-start text-left"
            >
              <Icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/users/profile');
      // if (!response.ok) throw new Error('Failed to fetch profile');
      // const data = await response.json();

      // Mock data for development
      setUser({
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, USA',
        avatar: null,
        contactCount: 24,
        status: 'Active',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2025-01-26'),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while loading your profile'
      );
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Handlers
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/users/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Failed to update profile');
      // const data = await response.json();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUser((prev) => ({ ...prev, ...formData, updatedAt: new Date() }));
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save profile changes'
      );
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Action handlers
  const handleChangePassword = () => {
    // TODO: Navigate to change password page or open modal
    console.log('Change password clicked');
  };

  const handleNotifications = () => {
    // TODO: Navigate to notifications settings
    console.log('Notifications clicked');
  };

  const handleActivityLog = () => {
    // TODO: Navigate to activity log
    console.log('Activity log clicked');
  };

  const handleLogout = () => {
    // TODO: Call logout API and redirect
    console.log('Logout clicked');
  };

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error && !user) {
    return <ErrorAlert message={error} onRetry={fetchUserProfile} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">
            My Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account information and settings
          </p>
        </div>

        {/* Error Alert */}
        {error && user && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {error}
            </p>
          </div>
        )}

        {/* Profile Content */}
        {user && (
          <>
            <ProfileHeader
              user={user}
              onEditClick={handleEditClick}
              isEditing={isEditing}
            />

            <ProfileStats user={user} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {isEditing ? (
                  <ProfileEditForm
                    user={user}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                  />
                ) : (
                  <ProfileInfo user={user} />
                )}
              </div>

              <div>
                <ProfileActions
                  onChangePassword={handleChangePassword}
                  onNotifications={handleNotifications}
                  onActivityLog={handleActivityLog}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
