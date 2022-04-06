import React, { useState, useEffect, useContext } from "react";
import { Redirect, Link, useParams } from "react-router-dom";
import TableInvestors from "../components/TableInvestors";
import ModalParticipate from "../components/ModalParticipate";
import { Card, Button, Typography } from "antd";
import { displayDate } from '../utils';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { id } = useParams();
  const isLogged = props.isLogged;
  const {
    doParticipate,
    getCampaign,
    fundData,
    account,
  } = useContext(Web3Context);

  useEffect(() => {
    if (!isLogged) {
      setRedirctTo(true);
    } else if (id && getCampaign) {
      getCampaign(id, true);
    }
  }, [isLogged]);

  const isOwner = (owner) => {
    if (owner == account.address)
      return true;
    return false;
  }

  const alreadyParticipate = (partipants) => {
    if (partipants.filter(e => e.address == account.address).length > 0)
      return true;
    return false;
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const render = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        gap: "10px",
      }}
    >
      <Link to="/fund">
        <Button>Back</Button>
      </Link>
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>{fundData && fundData.name}</Text>
          </>
        }
      >
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>Id:</Text>
            <Title level={4}>{id}</Title>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>Desc:</Text>
            <Title level={4}>{fundData && fundData.desc}</Title>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>Owner:</Text>
            <Title level={4}>{fundData && fundData.owner && isOwner(fundData.owner) ? 'You are the owner' : fundData && fundData.owner}</Title>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>Start Date:</Text>
            <Title level={4}>{fundData && displayDate(fundData.startDate)}</Title>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>End Date:</Text>
            <Title level={4}>{fundData && displayDate(fundData.endDate)}</Title>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
            <Text style={{ marginRight: "5px" }}>Fund:</Text>
            <Title level={4}>{fundData && fundData.current + "/" + fundData.goal}</Title>
          </div>
        </div>
      </Card>
      {fundData 
        && fundData.owner
        && !isOwner(fundData.owner) 
        && <Button type="primary" onClick={showModal}>Participate</Button>}
      {fundData 
        && fundData.owner
        && isOwner(fundData.owner) 
        && <Button>You cannot participate in your own funding.</Button>}
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Investors List</Text>
          </>
        }
      >
       <TableInvestors
          data={fundData && fundData.participants ? fundData.participants : []}
        />
      </Card>
      {fundData 
        && <ModalParticipate
          title={"Partipate to" + fundData.name}
          isModalVisible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        />}
    </div>
  );

  return redirctTo ? <Redirect to="/" /> : render;
}
