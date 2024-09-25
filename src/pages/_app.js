"use client";

// ** Next Imports
import Head from "next/head";
import { Router } from "next/router";
// ** Emotion Imports
import { CacheProvider } from "@emotion/react";
// ** Third Party Import
import { Toaster } from "react-hot-toast";
// ** Spinner Import
import Spinner from "@/@core/components/spinner";
// ** Styled Components
import ReactHotToast from "@/@core/components/react-hot-toast";
// ** Loader Import
import NProgress from "nprogress";
// ** Config Imports
import themeConfig from "@/configs/themeConfig";
import { SettingsConsumer, SettingsProvider } from "@/context/settingContext";
import UserLayout from "@/layouts/UserLayout";
import WindowWrapper from "@/@core/components/window-wrapper";
import { AppProvider } from "@toolpad/core";
import NAVIGATION from "@/navigation/navigation";
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
    Component.Layout ?? ((page) => <UserLayout>{page}</UserLayout>);

  return (
    <>
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
                <AppProvider
                  navigation={NAVIGATION}
                  branding={{
                    title: settings.appName,
                  }}
                >
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
                </AppProvider>
              );
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </CacheProvider>
    </>
  );
}
