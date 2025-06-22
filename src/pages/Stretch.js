import React, { useState } from "react";
import { Typography, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { HeartOutlined } from "@ant-design/icons";
import StretchWebcam from "../components/stretch/StretchWebcam";
import StretchTabs from "../components/stretch/StretchTabs";
import Progress from "../components/stretch/Progress";


const { Title } = Typography;

const Stretch = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <div style={{
      padding: "32px",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      minHeight: "calc(100vh - 64px - 64px)",
      gap: "24px"
    }}>
      <StretchWebcam onExerciseSelect={setSelectedExercise} />
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        flex: 1
      }}>
        <StretchTabs selectedExercise={selectedExercise} />
        <Progress />
      </div>
    </div>
  );
};

export default Stretch;
