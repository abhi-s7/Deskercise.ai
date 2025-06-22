import React, { useState } from "react";
import GoogleCalendar from "../components/calendar/GoogleCalendar";
import CalendarAnalysis from "../components/calendar/CalendarAnalysis";

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
      gap: "24px"
    }}>
      {/* Calendar Card - 35% width (reduced from 40%) */}
      <div style={{ width: "35%" }}>
        <GoogleCalendar 
          onConnectionChange={handleConnectionChange}
          onEventsUpdate={handleEventsUpdate}
          onTokenUpdate={handleTokenUpdate}
        />
      </div>
      
      {/* Analysis Card - 65% width (increased from 60%) */}
      <div style={{ width: "65%" }}>
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