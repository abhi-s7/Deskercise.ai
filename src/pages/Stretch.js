import React from "react";
import { Typography, Button, Card, Space, List, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { HeartOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Stretch = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div style={{ padding: "50px", height: "100%" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Card
          style={{
            borderRadius: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <Title level={1} style={{ color: "var(--ant-color-primary)", marginBottom: 16 }}>
                <HeartOutlined style={{ marginRight: 12 }} />
                Stretch Time!
              </Title>
              <Paragraph style={{ fontSize: 18, color: "#666" }}>
                Here are some simple exercises you can do right at your desk
              </Paragraph>
            </div>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Button
                type="primary"
                size="large"
                onClick={handleBackClick}
                style={{
                  height: 48,
                  fontSize: 16,
                  borderRadius: 8,
                  padding: "0 24px",
                }}
              >
                Done with Stretches
              </Button>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Stretch;
