import { Button, Typography } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Web3Context from "../store/web3Context";

const { Title } = Typography;

export default function Home(props) {
  const {
      initWeb3Modal,
      loading,
  } = useContext(Web3Context);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        gap: "10px",
      }}
    >
      <div
        style={{
          textAlign: "center"
        }}
      >
        <img src={logo} alt="logo" width="250" height="250" />
        <Title>Welcome to CatapultDAO</Title>        
      </div>
      {!loading && props.isLogged && (
        <div>
          <div 
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Link to="/create-funding">
              <Button>Create a Funding</Button>
            </Link>
            <Link to="/fund">
              <Button>Fund Page</Button>
            </Link>
          </div>
            <Title level={4} style={{ textAlign: 'center', marginTop: '15px' }}>You are connected</Title>
        </div>
      )}
      {!loading && !props.isLogged && (
        <Button type="primary" style={{ margin: 'auto' }} onClick={initWeb3Modal}>Connect your Wallet</Button>
      )}
      {loading && (
        <Button type="primary" style={{ margin: 'auto' }} loading>
          Loading
        </Button>
      )}
    </div>
  );
}
