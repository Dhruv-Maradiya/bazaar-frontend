import { useAuth } from "@/hooks/useAuth";
import BlankLayout from "@/layouts/BlankLayout";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useRouter } from "next/router";

const Login = () => {
  const { login } = useAuth();
  const { returnUrl } = useRouter().query;

  const handleSignIn = async (_provider, formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login({ email, password }, returnUrl || "/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SignInPage
      providers={[
        {
          id: "credentials",
          name: "Email and Password",
        },
      ]}
      signIn={handleSignIn}
    />
  );
};

Login.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
Login.guestGuard = true;

export default Login;
