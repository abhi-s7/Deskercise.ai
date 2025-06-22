import React, { useState } from "react";
import { Card, Button, Typography, Space, Divider, Avatar } from "antd";
import {
  GoogleOutlined,
  CalendarOutlined,
  LinkOutlined,
  UserOutlined,
  ReloadOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const { Title, Text } = Typography;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleCalendarHeader = ({ isConnected, userInfo, onConnect, onRefresh, onDisconnect, isLoading }) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <CalendarOutlined style={{ fontSize: 24, color: "#1890ff", marginRight: 20 }} />
        <div>
          <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
            Google Calendar
          </Title>
          {!isConnected ? (
            <Text type="secondary">Connect your Google account to view your calendar</Text>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar 
                src={userInfo?.picture} 
                icon={<UserOutlined />} 
                size="small" 
                style={{ marginRight: 8 }}
              />
              <Text type="secondary">
                Connected as {userInfo?.email || "Google Account"}
              </Text>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ marginLeft: 44 }}>
        {!isConnected ? (
          <Button
            type="primary"
            icon={<GoogleOutlined />}
            onClick={onConnect}
            style={{
              background: "#4285f4",
              borderColor: "#4285f4",
              boxShadow: "0 2px 8px rgba(66, 133, 244, 0.3)",
            }}
          >
            Connect Account
          </Button>
        ) : (
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={isLoading}
            >
              Refresh
            </Button>
            <Button
              icon={<DisconnectOutlined />}
              onClick={onDisconnect}
              danger
            >
              Disconnect
            </Button>
          </Space>
        )}
      </div>
    </div>
  );
};

const GoogleCalendarInner = ({ onConnectionChange, onEventsUpdate, onTokenUpdate }) => {
  const [events, setEvents] = useState([]);
  const [hasFetchedEvents, setHasFetchedEvents] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const fetchCalendarEvents = async (token) => {
    setIsLoading(true);
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            timeMin: todayStart.toISOString(),
            timeMax: todayEnd.toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: "startTime",
          },
        }
      );
      const fetchedEvents = response.data.items || [];
      setEvents(fetchedEvents);
      onEventsUpdate(fetchedEvents);
      setHasFetchedEvents(true);
      console.log("Fetched events:", fetchedEvents);
    } catch (err) {
      console.error("Error fetching calendar events:", err);
      setHasFetchedEvents(true);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    // Updated scope to include write access
    scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile",
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      setAccessToken(token);
      setIsConnected(true);
      onConnectionChange(true);
      // Pass token to parent component for calendar operations
      onTokenUpdate(token);
      setIsLoading(true);

      try {
        // Fetch user info
        const userResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserInfo(userResponse.data);

        // Fetch calendar events
        await fetchCalendarEvents(token);
      } catch (err) {
        console.error("Error fetching data:", err);
        setHasFetchedEvents(true);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => console.error("Login Failed:", err),
  });

  const handleRefresh = () => {
    if (isConnected && accessToken) {
      fetchCalendarEvents(accessToken);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUserInfo(null);
    setEvents([]);
    onEventsUpdate([]);
    setHasFetchedEvents(false);
    setAccessToken(null);
    onConnectionChange(false);
    onTokenUpdate(null);
  };

  return (
    <div style={{ 
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
        bodyStyle={{ 
          padding: 24,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%",
          overflow: "hidden"
        }}
      >
        {/* Header Component - Fixed height */}
        <div style={{ flexShrink: 0 }}>
          <GoogleCalendarHeader
            isConnected={isConnected}
            userInfo={userInfo}
            onConnect={() => login()}
            onRefresh={handleRefresh}
            onDisconnect={handleDisconnect}
            isLoading={isLoading}
          />
        </div>

        <Divider style={{ margin: "16px 0", flexShrink: 0 }} />

        {/* Agenda Section - Scrollable */}
        <div style={{ 
          flex: 1, 
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}>
          <Title level={4} style={{ marginBottom: 16, flexShrink: 0 }}>
            Today's Agenda
          </Title>

          {!isConnected ? (
            <Text type="secondary">No account connected. Please connect your Google account to view your calendar events.</Text>
          ) : (
            <div style={{ 
              flex: 1, 
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}>
              {isLoading ? (
                <Text type="secondary">Loading your calendar events...</Text>
              ) : hasFetchedEvents ? (
                events.length > 0 ? (
                  <div style={{ 
                    flex: 1, 
                    overflowY: "auto",
                    paddingRight: "8px" // Add some padding for scrollbar
                  }}>
                    {events.map((event) => (
                      <div key={event.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ marginBottom: 4 }}>
                          <Text strong style={{ fontSize: 16 }}>
                            {event.summary}
                          </Text>
                        </div>
                        <Text type="secondary">
                          {new Date(event.start.dateTime || event.start.date).toLocaleString()}
                          {event.end && event.end.dateTime && (
                            <span> - {new Date(event.end.dateTime).toLocaleTimeString()}</span>
                          )}
                        </Text>
                        {event.description && (
                          <div style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {event.description}
                            </Text>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text type="secondary">No events scheduled for today.</Text>
                )
              ) : (
                <Text type="secondary">Click refresh to load your calendar events.</Text>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const GoogleCalendar = ({ onConnectionChange, onEventsUpdate, onTokenUpdate }) => {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div style={{ 
        width: "100%",
        height: "calc(100vh - 128px)", // Match the height of CalendarAnalysis
        display: "flex",
        flexDirection: "column"
      }}>
        <GoogleCalendarInner 
          onConnectionChange={onConnectionChange} 
          onEventsUpdate={onEventsUpdate}
          onTokenUpdate={onTokenUpdate}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleCalendar;