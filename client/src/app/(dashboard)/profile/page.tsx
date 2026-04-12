'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  
  Mail, 
  Phone, 
  Calendar, 
  Edit2, 
  Save, 
  X,
  Loader2,
  Home,
  Heart,
  MessageCircle,
  Calendar as CalendarIcon,
  CheckCircle,
  Building2,
  Users,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/state';
import { setIsEditing, setFormData, resetForm } from '@/state/features/profileSlice';
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserStatsQuery,
  UserProfile,
} from '@/state/apis/userApi';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value || 0}</p>
      </div>
      <div className={`p-2 rounded-lg bg-${color}-50`}>
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </div>
    </div>
  </div>
);

// Validation functions
const validateFullName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Full name is required';
  }
  if (name.length < 2) {
    return 'Full name must be at least 2 characters';
  }
  if (name.length > 100) {
    return 'Full name must be less than 100 characters';
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return 'Full name can only contain letters and spaces';
  }
  return null;
};

const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) {
    return null; // Phone is optional
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return 'Phone number must be a valid 10-digit Indian number (starts with 6-9)';
  }
  return null;
};

// Edit Profile Form Component with Validation
function EditProfileForm({ profile, onCancel, onSuccess }: { profile: UserProfile; onCancel: () => void; onSuccess: () => void }) {
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const [formData, setFormDataState] = useState({
    fullName: profile.fullName || '',
    phone: profile.phone || '',
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormDataState(prev => ({ ...prev, [id]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { fullName?: string; phone?: string } = {};
    
    const nameError = validateFullName(formData.fullName);
    if (nameError) newErrors.fullName = nameError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully');
      onSuccess();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to update profile';
      toast.error(errorMessage);
      
      // Handle validation errors from backend
      if (error?.data?.details) {
        const backendErrors: { fullName?: string; phone?: string } = {};
        if (error.data.details.fullName) {
          backendErrors.fullName = error.data.details.fullName[0];
        }
        if (error.data.details.phone) {
          backendErrors.phone = error.data.details.phone[0];
        }
        setErrors(backendErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-1">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={cn(errors.fullName && "border-red-500 focus-visible:ring-red-500")}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.fullName}
            </p>
          )}
          <p className="text-xs text-gray-500">Only letters and spaces allowed (2-100 characters)</p>
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number <span className="text-gray-400 text-xs">(Optional)</span></Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={cn(errors.phone && "border-red-500 focus-visible:ring-red-500")}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.phone}
            </p>
          )}
          <p className="text-xs text-gray-500">10-digit Indian number starting with 6,7,8, or 9</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}

// View Profile Component
function ViewProfile({ profile, onEdit }: { profile: UserProfile; onEdit: () => void }) {
  const { user: clerkUser } = useUser();
  const { data: stats } = useGetUserStatsQuery();

  const getInitials = () => {
    return profile.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isTenant = profile.role === 'TENANT';
  const isLandlord = profile.role === 'LANDLORD';

  // Use Clerk's avatar if available, otherwise fallback to database
  const avatarUrl = clerkUser?.imageUrl || profile.avatarUrl;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <h2 className="text-2xl font-bold">{profile.fullName}</h2>
            <Badge className={isTenant ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
              {isTenant ? 'Tenant' : isLandlord ? 'Landlord' : 'Admin'}
            </Badge>
            {profile.isVerified && (
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 justify-center md:justify-start text-gray-500">
            <span className="flex items-center gap-1 text-sm">
              <Mail className="h-4 w-4" />
              {profile.email}
            </span>
            {profile.phone && (
              <span className="flex items-center gap-1 text-sm">
                <Phone className="h-4 w-4" />
                {profile.phone}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              Joined {formatDate(profile.createdAt)}
            </span>
          </div>
        </div>
        <Button onClick={onEdit} variant="outline" className="gap-2">
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isTenant ? (
          <>
            <StatCard title="Wishlist" value={stats?.wishlistCount || 0} icon={Heart} color="red" />
            <StatCard title="Enquiries" value={stats?.totalLeads || 0} icon={MessageCircle} color="blue" />
            <StatCard title="Visits" value={stats?.totalVisits || 0} icon={CalendarIcon} color="purple" />
            <StatCard title="Active Rentals" value={stats?.activeAgreements || 0} icon={Home} color="green" />
          </>
        ) : isLandlord ? (
          <>
            <StatCard title="Properties" value={stats?.totalProperties || 0} icon={Building2} color="blue" />
            <StatCard title="Active Listings" value={stats?.activeProperties || 0} icon={CheckCircle} color="green" />
            <StatCard title="Leads" value={stats?.totalLeads || 0} icon={MessageCircle} color="purple" />
            <StatCard title="Active Tenants" value={stats?.activeAgreements || 0} icon={Users} color="orange" />
          </>
        ) : null}
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Account Status</span>
            <Badge className={profile.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
              {profile.isVerified ? 'Verified' : 'Pending Verification'}
            </Badge>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Member Since</span>
            <span>{formatDate(profile.createdAt)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">User ID</span>
            <span className="text-sm font-mono">{profile?.id.slice(0, 16)}...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading Skeleton
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-50 rounded-2xl animate-pulse">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
          <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading, refetch } = useGetUserProfileQuery(undefined, {
    skip: !isSignedIn,
  });
  const { isEditing } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/auth/login');
    }
  }, [isSignedIn, router]);

  const handleEdit = () => {
    if (profile) {
      dispatch(setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        email: profile.email || '',
        avatarUrl: profile.avatarUrl || '',
      }));
      dispatch(setIsEditing(true));
    }
  };

  const handleCancel = () => {
    dispatch(resetForm());
  };

  const handleSuccess = () => {
    dispatch(resetForm());
    refetch();
  };

  if (!isSignedIn) return null;
  if (isLoading) return <ProfileSkeleton />;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </motion.div>

        {isEditing ? (
          <EditProfileForm profile={profile} onCancel={handleCancel} onSuccess={handleSuccess} />
        ) : (
          <ViewProfile profile={profile} onEdit={handleEdit} />
        )}
      </div>
    </div>
  );
}