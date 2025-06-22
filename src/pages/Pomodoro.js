import React from "react";
import { Typography, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import PomodoroTimer from "../components/pomodoro/PomodoroTimer";
import PomodoroSettings from "../components/pomodoro/PomodoroSettings";

const { Title } = Typography;

const Pomodoro = () => {
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
      <PomodoroTimer />
      <PomodoroSettings />
    </div>
  );
};

export default Pomodoro;
