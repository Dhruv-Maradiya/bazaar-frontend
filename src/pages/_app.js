"use client";

// ** Next Imports
import { store } from "@/store";
import { createEmotionCache } from "@/utils/emotion-cache";
import { CacheProvider } from "@emotion/react";
import Head from "next/head";
import { Provider } from "react-redux";

// Create client-side emotion cache
const clientSideEmotionCache = createEmotionCache();

function App({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Blank Page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CacheProvider value={emotionCache}>
        {/* Commenting out all global wrappers */}
        {/* <ReactReduxFirebaseProvider {...rrfProps}> */}
        {/* <SettingsProvider> */}
        {/* <AuthProvider> */}
        {/* Remove AuthGuard, Layout, etc. */}
        {/* Rendering only the Component */}
        <Component {...pageProps} />
        {/* </AuthProvider> */}
        {/* </SettingsProvider> */}
        {/* </ReactReduxFirebaseProvider> */}
      </CacheProvider>
    </Provider>
  );
}

export default App;
