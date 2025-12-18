import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import React, {useEffect, useState } from 'react'
import Course from './Course'
import { Skeleton } from '@/components/ui/skeleton'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authapi'
import { toast } from 'sonner'
const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  
  // All hooks must be at the top before any conditional returns
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, isSuccess , error}] = useUpdateUserMutation();

  useEffect(() => {
   refetch();
  },[]);

  useEffect(() => {
    if (isSuccess) {
       refetch();
      toast.success(updateUserData?.message || "Profile Updated");
    }
    if (isError) {
      toast.error(error?.data?.message || "Profile Update Failed");
    }
  }, [error, updateUserData, isSuccess, isError]);

  // Now safe to do conditional returns after all hooks
  const isProfileLoading = isLoading;
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // Check if data exists before destructuring
  if (!data || !data.user) {
    return <ProfileSkeleton />;
  }

 

  const user  = data && data.user;

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  }

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 my-16 md:my-24">
      {isProfileLoading ? (
        <ProfileSkeleton />
      ) : (
        <>
          <h1 className="font-bold text-2xl sm:text-3xl text-center md:text-left mb-8 text-gray-900 dark:text-gray-100">
            Profile
          </h1>

          {/* Main Row: Avatar Left | Details Right */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">

            {/* Avatar Section */}
            <div className="flex justify-center sm:justify-start w-full sm:w-auto">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
                <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info Section */}
            <div className="flex flex-col space-y-3 text-center sm:text-left w-full">
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Name:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2 block sm:inline">
                  {user?.name}
                </span>
              </h1>
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Email:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2 block sm:inline">
                  {user?.email}
                </span>
              </h1>
              <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                Role:
                <span className="font-normal text-gray-700 dark:text-gray-300 ml-2 block sm:inline">
                  {user?.role.toUpperCase()}
                </span>
              </h1>

              {/* Edit Profile Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full sm:w-fit mt-4">
                    Edit Profile
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-sm sm:text-base font-medium">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="sm:col-span-3 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                      <label className="text-sm sm:text-base font-medium">Profile Picture</label>
                      <input
                        onChange={onChangeHandler}
                        type="file"
                        className="sm:col-span-3 border rounded-md px-3 py-2"
                        accept="image/*"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button disabled={updateUserIsLoading}
                      onClick={updateUserHandler}
                      className="w-full sm:w-auto">
                      {updateUserIsLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className='mt-10'>
            <h1 className='font-medium text-lg mb-5'>Courses you're enrolled in</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
              {
                user?.enrolledCourses.length === 0 ? (
                  <h1>You aren't enrolled in any courses.</h1>
                ) : (
                  user?.enrolledCourses.map((course) => (
                    <Course key={course._id} course={course} />
                  ))
                )
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;

// Skeleton Component matching exact Profile structure
const ProfileSkeleton = () => {
  return (
    <>
      {/* Title Skeleton */}
      <Skeleton className="h-8 w-32 mx-auto md:mx-0 mb-8" />

      {/* Main Row: Avatar Left | Details Right */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">

        {/* Avatar Skeleton */}
        <div className="flex justify-center sm:justify-start w-full sm:w-auto">
          <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full" />
        </div>

        {/* Profile Info Skeleton */}
        <div className="flex flex-col space-y-3 text-center sm:text-left w-full">
          <Skeleton className="h-6 w-64 mx-auto sm:mx-0" />
          <Skeleton className="h-6 w-80 mx-auto sm:mx-0" />
          <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
          <Skeleton className="h-10 w-32 mx-auto sm:mx-0 mt-4" />
        </div>
      </div>

      {/* Enrolled Courses Skeleton */}
      <div className='mt-10'>
        <Skeleton className="h-7 w-56 mb-5" />
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden">
              <Skeleton className="w-full aspect-video" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
