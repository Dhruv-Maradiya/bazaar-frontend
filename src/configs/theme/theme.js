import { createTheme } from "@mui/material/styles";

const whiteColor = "#FFF";
const lightColor = "51, 48, 60";
const darkColor = "228, 230, 244";
const darkPaperBgColor = "#2F3349";

const common = {
  black: "#000",
  white: whiteColor,
};
const primary = {
  light: "#8479F2",
  main: "#0085ff",
  dark: "#0062ff",
  contrastText: whiteColor,
};
const secondary = {
  light: "#B2B4B8",
  main: "#A8AAAE",
  dark: "#949699",
  contrastText: whiteColor,
};
const error = {
  light: "#ED6F70",
  main: "#EA5455",
  dark: "#CE4A4B",
  contrastText: whiteColor,
};
const warning = {
  light: "#FFAB5A",
  main: "#FF9F43",
  dark: "#E08C3B",
  contrastText: whiteColor,
};
const info = {
  light: "#1FD5EB",
  main: "#00CFE8",
  dark: "#00B6CC",
  contrastText: whiteColor,
};
const success = {
  light: "#42CE80",
  main: "#28C76F",
  dark: "#23AF62",
  contrastText: whiteColor,
};
const grey = {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#EEEEEE",
  300: "#E0E0E0",
  400: "#BDBDBD",
  500: "#9E9E9E",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121",
  A100: "#F5F5F5",
  A200: "#EEEEEE",
  A400: "#BDBDBD",
  A700: "#616161",
};

const allCommons = {
  common,
  primary,
  secondary,
  error,
  warning,
  info,
  success,
  grey,
};

const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#F8F7FA",
          paper: whiteColor,
        },
        ...allCommons,
        text: {
          primary: `rgba(${lightColor}, 0.87)`,
          secondary: `rgba(${lightColor}, 0.6)`,
          disabled: `rgba(${lightColor}, 0.38)`,
        },
        divider: `rgba(${lightColor}, 0.12)`,
        action: {
          active: `rgba(${lightColor}, 0.54)`,
          hover: `rgba(${lightColor}, 0.04)`,
          selected: `rgba(${lightColor}, 0.08)`,
          disabled: `rgba(${lightColor}, 0.26)`,
          disabledBackground: `rgba(${lightColor}, 0.12)`,
          focus: `rgba(${lightColor}, 0.12)`,
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#25293C",
          paper: darkPaperBgColor,
        },
        ...allCommons,
        text: {
          primary: `rgba(${darkColor}, 0.87)`,
          secondary: `rgba(${darkColor}, 0.6)`,
          disabled: `rgba(${darkColor}, 0.38)`,
        },
        divider: `rgba(${darkColor}, 0.12)`,
        action: {
          active: `rgba(${darkColor}, 0.54)`,
          hover: `rgba(${darkColor}, 0.04)`,
          selected: `rgba(${darkColor}, 0.08)`,
          disabled: `rgba(${darkColor}, 0.26)`,
          disabledBackground: `rgba(${darkColor}, 0.12)`,
          focus: `rgba(${darkColor}, 0.12)`,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default customTheme;
