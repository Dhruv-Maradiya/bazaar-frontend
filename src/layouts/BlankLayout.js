// ** MUI Imports
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

// Styled component for Blank Layout component
const BlankLayoutWrapper = styled(Box)(({ theme }) => ({
  height: "100vh",

  "& .content-center": {
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(5),
  },

  "& .content-right": {
    display: "flex",
    minHeight: "100vh",
    position: "relative",
  },
}));

const BlankLayout = ({ children }) => {
  return (
    <BlankLayoutWrapper className="layout-wrapper">
      <Box
        className="app-content"
        sx={{ minHeight: "100vh", position: "relative" }}
      >
        {children}
      </Box>
    </BlankLayoutWrapper>
  );
};

export default BlankLayout;
