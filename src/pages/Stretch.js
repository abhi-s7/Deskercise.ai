import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const Stretch = () => {
  return (
    <div style={{
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 64px - 64px)",
    }}>
      <Title level={2}>Stretch Page</Title>
      <p>This page will contain stretch exercises and content.</p>
    </div>
  );
};

export default Stretch;
