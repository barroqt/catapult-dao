import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import Chains from "components/Chains";
import TokenPrice from "components/TokenPrice";
import Account from "components/Account/Account";
import NativeBalance from "components/NativeBalance";
import FundContainer from "components/FundContainer";
import Home from "components/Home";
import Fund from "components/Fund";
import CreateFunding from "components/CreateFunding";
import Text from "antd/lib/typography/Text";
import MenuItems from "./components/MenuItems";
const { Header, Footer } = Layout;
import logo from "./assets/favicon-80x80.png";

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = () => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <Link to="/">
            <img src={logo} alt="logo" width="60" height="60" />
          </Link>
          <MenuItems />
          <div style={styles.headerRight}>
            <Chains />
            <TokenPrice
              address="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
              chain="eth"
              image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/"
              size="40px"
            />
            <NativeBalance />
            <Account />
          </div>
        </Header>

        <div style={styles.content}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/fund">
              <FundContainer />
            </Route>
            <Route exact path='/fund/:id'>
              <Fund />
            </Route>
            <Route exact path="/create-funding">
              <CreateFunding />
            </Route>
            <Route path="/nonauthenticated">
              <>Please login using the "Authenticate" button</>
            </Route>
          </Switch>
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ display: "block" }}>Build at Avalanche Summit 2022</Text>
      </Footer>
    </Layout>
  );
};

export default App;
