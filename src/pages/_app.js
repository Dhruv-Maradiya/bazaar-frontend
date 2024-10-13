"use client";

// ** React Imports
import { useRef } from "react";

// ** Next Imports
import Head from "next/head";
import { Router } from "next/router";
// ** Store Imports
import { rrfProps, store } from "@/store";
import { Provider } from "react-redux";
// ** Emotion Imports
import { CacheProvider } from "@emotion/react";
// ** Third Party Import
import { Toaster } from "react-hot-toast";
// ** Spinner Import
// ** Styled Components
import ReactHotToast from "@/@core/components/react-hot-toast";
// ** Loader Import
import NProgress from "nprogress";
// ** Config Imports
import CustomAppProvider from "@/@core/components/AppProviderCustom";
import AuthGuard from "@/@core/components/guards/AuthGuard";
import GuestGuard from "@/@core/components/guards/GuestGuard";
import FallbackSpinner from "@/@core/components/spinner";
import WindowWrapper from "@/@core/components/window-wrapper";
import themeConfig from "@/configs/themeConfig";
import { AuthConsumer, AuthProvider } from "@/context/AuthContext";
import { SettingsConsumer, SettingsProvider } from "@/context/settingContext";
import UserLayout from "@/layouts/UserLayout";
import { createEmotionCache } from "@/utils/emotion-cache";
import dynamic from "next/dynamic";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import "../styles/globals.css";

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  let prev = "";
  Router.events.on("routeChangeStart", (event) => {
    const prevPath = prev.split("?")?.[0] || "";
    const newPath = event.split("?")?.[0] || "";

    if (prevPath !== newPath) {
      NProgress.start();
    }

    prev = event;
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
}

function App(props) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;
  const getLayout =
    Component.getLayout ??
    ((page) => <UserLayout drawerRef={drawerRef}>{page}</UserLayout>);
  const Guard = Component.guestGuard === true ? GuestGuard : AuthGuard;

  const drawerRef = useRef(null);

  return (
    <Provider store={store}>
      <Head>
        <title>{`${themeConfig.appName}`}</title>
        <meta name="description" content={`${themeConfig.appName}`} />
        <meta name="keywords" content={`${themeConfig.appName}`} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <CacheProvider value={emotionCache}>
          <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <AuthProvider>
                    <AuthConsumer>
                      {({ user }) => {
                        return (
                          <Guard fallback={<FallbackSpinner />}>
                            <CustomAppProvider settings={settings} user={user}>
                              <WindowWrapper>
                                {getLayout(
                                  <Component
                                    {...pageProps}
                                    drawerRef={drawerRef}
                                  />
                                )}
                                <ReactHotToast>
                                  <Toaster
                                    position={settings.toastPosition}
                                    gutter={8}
                                    containerStyle={{ zIndex: 9999 }}
                                    toastOptions={{ duration: 3000 }}
                                  />
                                </ReactHotToast>
                              </WindowWrapper>
                            </CustomAppProvider>
                          </Guard>
                        );
                      }}
                    </AuthConsumer>
                  </AuthProvider>
                );
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </CacheProvider>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
