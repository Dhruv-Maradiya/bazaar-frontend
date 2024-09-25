import { useContext } from "react";
import { SettingsContext } from "@/context/settingContext";

export const useSettings = () => useContext(SettingsContext);
