import { DashboardLayout, PageContainer } from "@toolpad/core";

const UserLayout = ({ children }) => {
  return (
    <DashboardLayout>
      <PageContainer>{children}</PageContainer>
    </DashboardLayout>
  );
};

export default UserLayout;
