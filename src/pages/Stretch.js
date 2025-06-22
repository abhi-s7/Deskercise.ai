import React from "react";
import { Typography, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { HeartOutlined } from "@ant-design/icons";
import StretchWebcam from "../components/stretch/StretchWebcam";
import StretchTabs from "../components/stretch/StretchTabs";

const { Title, Paragraph } = Typography;

const Stretch = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div style={{
      padding: "32px",
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch",
      minHeight: "calc(100vh - 64px - 64px)",
      gap: "24px",
      overflow: "hidden"
    }}>
      <StretchWebcam />
      <StretchTabs />
    </div>
  );
};

export default Stretch;
