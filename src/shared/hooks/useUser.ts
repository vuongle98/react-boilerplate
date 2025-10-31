import { userService } from "@/shared/services/UserService";
import { User } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  return useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      return await userService.getCurrentUser();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
