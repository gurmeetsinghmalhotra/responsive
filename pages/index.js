import MobileDetect from "mobile-detect";
import Head from "next/head";
import React from "react";
import { Container, Message, Responsive } from "semantic-ui-react";

const DesktopContainer = ({ children, getWidth }) => (
  <Responsive
    fireOnMount
    getWidth={getWidth}
    minWidth={Responsive.onlyTablet.minWidth}
  >
    <Message info>
      This is a <code>DesktopContainer</code>.
    </Message>

    {children}
  </Responsive>
);

const MobileContainer = ({ children, getWidth }) => (
  <Responsive
    fireOnMount
    getWidth={getWidth}
    maxWidth={Responsive.onlyMobile.maxWidth}
  >
    <Message info>
      This is a <code>MobileContainer</code>.
    </Message>

    {children}
  </Responsive>
);

const ResponsiveContainer = ({ children, getWidth }) => (
  <React.Fragment>
    <DesktopContainer getWidth={getWidth}>{children}</DesktopContainer>
    <MobileContainer getWidth={getWidth}>{children}</MobileContainer>
  </React.Fragment>
);

const Homepage = ({ deviceInfo, isMobileFromSSR }) => (
  <React.Fragment>
    <Head>
      <title>Semantic UI React: Responsive & SSR</title>

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
      />
    </Head>

    <Container style={{ padding: 20 }}>
      <Message info>
        This example show hot to use the Responsive component from Semantic UI
        React with SSR.
      </Message>

      <ResponsiveContainer getWidth={getWidthFactory(isMobileFromSSR)} />

      <Message>
        <Message.Header>Information about your device</Message.Header>
        <pre>{JSON.stringify(deviceInfo, null, 2)}</pre>
      </Message>
    </Container>
  </React.Fragment>
);

const getWidthFactory = isMobileFromSSR => () => {
  const isSSR = typeof window === "undefined";
  const ssrValue = isMobileFromSSR
    ? Responsive.onlyMobile.maxWidth
    : Responsive.onlyTablet.minWidth;

  return isSSR ? ssrValue : window.innerWidth;
};

Homepage.getInitialProps = async ({ req }) => {
  console.log('here');
  const md = new MobileDetect(req.headers["user-agent"]);
  const isMobileFromSSR = !!md.mobile();

  return {
    isMobileFromSSR,
    deviceInfo: {
      mobile: md.mobile(),
      tablet: md.tablet(),
      os: md.os(),
      userAgent: md.userAgent()
    }
  };
};

export default Homepage;
