const DefaultPalette = (mode, skin) => {
  // ** Vars
  const whiteColor = "#FFF";
  const lightColor = "rgb(51, 48, 60)";
  const darkColor = "rgb(228, 230, 244)";
  const darkPaperBgColor = "#2F3349";
  const mainColor = mode === "light" ? lightColor : darkColor;

  const defaultBgColor = () => {
    if (skin === "bordered" && mode === "light") {
      return whiteColor;
    } else if (skin === "bordered" && mode === "dark") {
      return darkPaperBgColor;
    } else if (mode === "light") {
      return "#F8F7FA";
    } else return "#25293C";
  };

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: whiteColor,
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === "light" ? "#F8F7FA" : "#25293C",
      trackBg: mode === "light" ? "#F1F0F2" : "#3B405B",
      avatarBg: mode === "light" ? "#F6F6F7" : "#4A5072",
      tableHeaderBg: mode === "light" ? "#F6F6F7" : "#4A5072",
      paper: mode === "light" ? whiteColor : darkPaperBgColor,
      default: defaultBgColor(),
    },
    mode: mode,
    common: {
      black: "#000",
      white: whiteColor,
    },
  };
};

export default DefaultPalette;
