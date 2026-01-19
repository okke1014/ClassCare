import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAuth = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: any) => {
      setError(null);
      return await authService.login(username, password);
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    },
    onError: (err) => {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error,
  };
};





