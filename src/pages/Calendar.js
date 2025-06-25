import React, { useState } from "react";
import { Typography } from "antd";
import GoogleCalendar from "../components/calendar/GoogleCalendar";
import CalendarAnalysis from "../components/calendar/CalendarAnalysis";

const { Title } = Typography;

const Calendar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
  };

  const handleEventsUpdate = (newEvents) => {
    setEvents(newEvents);
  };

  const handleTokenUpdate = (token) => {
    setAccessToken(token);
  };

  return (
    <div style={{
      padding: "32px",
      minHeight: "calc(100vh - 64px - 64px)",
      display: "flex",
      gap: "40px",
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      {/* Calendar Card - 35% width */}
      <div style={{ 
        width: "35%",
        animation: 'floating 6s ease-in-out infinite'
      }}>
        <GoogleCalendar 
          onConnectionChange={handleConnectionChange}
          onEventsUpdate={handleEventsUpdate}
          onTokenUpdate={handleTokenUpdate}
        />
      </div>
      
      {/* Analysis Card - 65% width */}
      <div style={{ 
        width: "65%",
        animation: 'floating 6s ease-in-out infinite',
        animationDelay: '1s'
      }}>
        <CalendarAnalysis 
          isConnected={isConnected}
          events={events}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
};

export default Calendar;