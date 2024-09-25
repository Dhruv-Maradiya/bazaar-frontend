"use client";

// ** Next Imports
import Head from "next/head";
import { Router } from "next/router";
// ** Store Imports
import { store } from '@/store';
import { Provider } from 'react-redux';
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
import { AuthProvider } from "@/context/AuthContext";
import { SettingsConsumer, SettingsProvider } from "@/context/settingContext";
import UserLayout from "@/layouts/UserLayout";
import { createEmotionCache } from "@/utils/emotion-cache";

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

export default function App(props) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;
  const getLayout =
    Component.getLayout ?? ((page) => <UserLayout>{page}</UserLayout>);
  const Guard = Component.guestGuard === true ? GuestGuard : AuthGuard;

  return (
    <Provider store={store}>
      <Head>
        <title>{`${themeConfig.appName}`}</title>
        <meta name="description" content={`${themeConfig.appName}`} />
        <meta name="keywords" content={`${themeConfig.appName}`} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <CacheProvider value={emotionCache}>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <AuthProvider>
                  <Guard fallback={<FallbackSpinner />}>
                    <CustomAppProvider settings={settings}>
                      <WindowWrapper>
                        {getLayout(<Component {...pageProps} />)}
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
                </AuthProvider>
              );
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </CacheProvider>
    </Provider>
  );
}
