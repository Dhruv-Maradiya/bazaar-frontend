// ** React Imports
import { createContext, useState, useEffect } from "react";

// ** ThemeConfig Import
import themeConfig from "@/configs/themeConfig";

const initialSettings = {
  appName: themeConfig.appName,
  themeColor: "primary",
  mode: themeConfig.mode,
  toastPosition: themeConfig.toastPosition,
};

const staticSettings = {
  toastPosition: initialSettings.toastPosition,
};

const restoreSettings = () => {
  let settings = null;
  try {
    const storedData = window.localStorage.getItem("settings");
    if (storedData) {
      settings = { ...JSON.parse(storedData), ...staticSettings };
    } else {
      settings = initialSettings;
    }
  } catch (err) {
    console.error(err);
  }

  return settings;
};

// set settings in localStorage
const storeSettings = (settings) => {
  const initSettings = Object.assign({}, settings);
  delete initSettings.toastPosition;
  window.localStorage.setItem("settings", JSON.stringify(initSettings));
};

// ** Create Context
export const SettingsContext = createContext({
  saveSettings: () => null,
  settings: initialSettings,
});

export const SettingsProvider = ({ children, pageSettings }) => {
  // ** State
  const [settings, setSettings] = useState({ ...initialSettings });
  useEffect(() => {
    const restoredSettings = restoreSettings();
    if (restoredSettings) {
      setSettings({ ...restoredSettings });
    }
    if (pageSettings) {
      setSettings({ ...settings, ...pageSettings });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSettings]);

  const saveSettings = (updatedSettings) => {
    storeSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;
