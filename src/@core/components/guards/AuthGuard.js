// ** React Imports
import { useEffect } from "react";

// ** Next Import
import { useRouter } from "next/router";

import { useAuth } from "@/hooks/useAuth";

const AuthGuard = (props) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (auth.user.isEmpty && auth.loading === false) {
      router.push("/auth/login");
    }
  }, [auth.loading, auth.user, router]);

  if (auth.loading) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
