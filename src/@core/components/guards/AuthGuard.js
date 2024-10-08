// ** React Imports
import { useEffect } from "react";

// ** Next Import
import { useRouter } from "next/router";

import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { fetchAllStocks } from "@/store/settings/user";
import { Box } from "@mui/system";

const AuthGuard = (props) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (auth.user.isEmpty && auth.loading === false) {
      router.push("/auth/login");
    } else if (auth.user && auth.loading === false) {
      dispatch(fetchAllStocks());
    }
  }, [auth.loading, auth.user, dispatch, router]);

  if (auth.loading) {
    return fallback;
  }

  return <Box>{children}</Box>;
};

export default AuthGuard;
