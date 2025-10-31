import { userService } from "@/shared/services/UserService";
import { UserProfile } from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserProfile = () => {
  const queryClient = useQueryClient();
  const queryKey = ["userProfile"];

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => userService.getUserProfile(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: Partial<UserProfile>) =>
      userService.updateUserProfile(profileData),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKey, updatedProfile);
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
};
