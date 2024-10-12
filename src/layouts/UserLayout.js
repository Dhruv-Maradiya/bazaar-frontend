import { DashboardLayout } from "@toolpad/core";

const UserLayout = ({ children, drawerRef }) => {
  return <DashboardLayout drawerRef={drawerRef}>{children}</DashboardLayout>;
};

export default UserLayout;
