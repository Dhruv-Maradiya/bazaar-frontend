import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

const GuestGuard = (props) => {
  const { children, fallback } = props;

  const router = useRouter();

  const { loading, user } = useAuth();

  if (!user.isEmpty && !loading) {
    router.replace("/");
  }

  if (loading) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
