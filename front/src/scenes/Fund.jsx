import { Card, Button, Typography } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { Redirect, Link, useParams } from "react-router-dom";
import TableInvestors from "../components/TableInvestors";

import Web3Context from "../store/web3Context";
const { Text, Title } = Typography;

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
  },
  timeline: {
    marginBottom: "-45px",
  },
};

export default function Fund(props) {
  const [redirctTo, setRedirctTo] = useState(false);
  const { id } = useParams();
  const isLogged = props.isLogged;
  const {
    doParticipate,
    participation,
  } = useContext(Web3Context);

  useEffect(() => {
    if (!isLogged) {
      setRedirctTo(true);
    }
  }, [isLogged]);

  console.log({ participation });
  const render = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        gap: "10px",
      }}
    >
      <Link to="/">
        <Button>Back</Button>
      </Link>
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Fund Info</Text>
          </>
        }
      >
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>Title:</Text>
            <Title level={4}>{id}</Title>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>Date:</Text>
            <Title level={4}>2022-03-28</Title>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>End Date:</Text>
            <Title level={4}>2022-03-31</Title>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>Fund:</Text>
            {participation && <Title level={4}>5000/5000</Title>}
            {!participation && <Title level={4}>0/5000</Title>}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>Currency:</Text>
            <Title level={4}>USDC</Title>
          </div>
        </div>
      </Card>
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Investors List</Text>
          </>
        }
      >
       <TableInvestors
          data={[participation]}
        />
      </Card>
      {!participation && <Button type="primary" onClick={() => doParticipate(5000)}>Participate with 5000</Button>}
    </div>
  );

  return redirctTo ? <Redirect to="/" /> : render;
}
