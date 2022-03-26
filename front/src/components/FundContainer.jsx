import { Card, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const { Text } = Typography;

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

export default function FundContainer() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        gap: "10px",
      }}
    >
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Funding Periode</Text>
          </>
        }
      >
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
        }}>
          <Link to="/fund/id1">
            <Card type="inner" title="Funding 1">
              Inner
            </Card>
          </Link>
          <Link to="/fund/id2">
            <Card type="inner" title="Funding 2">
              Inner
            </Card>
          </Link>
        </div>
      </Card>
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Funded</Text>
          </>
        }
      >
        <Link to="/fund/id3">
          <Card type="inner" title="Funded 1">
            Inner
          </Card>
        </Link>
      </Card>
    </div>
  );
}
