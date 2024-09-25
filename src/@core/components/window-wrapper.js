// ** React Imports
import { useEffect, useState } from "react";

const WindowWrapper = ({ children }) => {
  // ** State
  const [windowReadyFlag, setWindowReadyFlag] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowReadyFlag(true);
    }
  }, []);
  if (windowReadyFlag) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default WindowWrapper;
