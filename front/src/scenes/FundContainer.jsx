import { Card, Typography } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import Web3Context from "../store/web3Context";

const { Text } = Typography;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "80%",
    gap: "10px",
  },
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
  fundCard: {
    display: "flex",
    flexDirection: "row",
    margin: 2,
  },
  timeline: {
    marginBottom: "-45px",
  },
};

export default function FundContainer(props) {
  const [redirctTo, setRedirctTo] = useState(false);
  const isLogged = props.isLogged;
  const {
      investment,
  } = useContext(Web3Context);

  useEffect(() => {
    if (!isLogged) {
      setRedirctTo(true);
    }
  }, [isLogged]);

  const render = (
    <div
      style={styles.container}
    >
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Fundings in progress</Text>
          </>
        }
      >
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
        }}>
          {investment && investment.map((elt, i) => (
              <Link key={i} to={"/fund/" + elt.addr}>
                <Card type="inner" style={styles.fundCard} title={elt.name}>
                  <Text>{elt.desc}: </Text>
                  <Text>{elt.current} / {elt.goal}</Text>
                </Card>
              </Link>
            )
          )}
          {!investment && <div>Nothing to display</div>}

        </div>
      </Card>
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Fundings done</Text>
          </>
        }
      >
        <div>Nothing to display</div>
        
      </Card>
    </div>
  );

  return redirctTo ? <Redirect to="/" /> : render;
}
