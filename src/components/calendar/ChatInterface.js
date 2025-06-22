import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar, Typography, Spin, message, Modal, Select, TimePicker } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined, CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import dayjs from 'dayjs';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ChatInterface = ({ events = [], accessToken, onStretchSuggestionsUpdate }) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your calendar assistant. I'll help you find opportunities for quick desk stretches throughout your day.",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzedAgenda, setHasAnalyzedAgenda] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Gemini AI
  const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-analyze agenda when events are loaded
  useEffect(() => {
    if (events.length > 0 && !hasAnalyzedAgenda) {
      analyzeAgendaForBreaks();
      setHasAnalyzedAgenda(true);
    }
  }, [events, hasAnalyzedAgenda]);

  const parseStretchSuggestions = (responseText) => {
    const suggestions = [];
    const lines = responseText.split('\n');
    
    for (const line of lines) {
      // Look for lines that start with • and contain time
      if (line.trim().startsWith('•') && line.includes('**')) {
        const timeMatch = line.match(/\*\*(.*?)\*\*/);
        if (timeMatch) {
          const timeStr = timeMatch[1];
          const description = line.replace(/.*\*\*.*?\*\*\s*-\s*/, '').trim();
          
          suggestions.push({
            id: Date.now() + Math.random(),
            time: timeStr,
            description: description,
            originalLine: line
          });
        }
      }
    }
    
    return suggestions;
  };

  // Function to update stretch suggestions and notify parent
  const updateStretchSuggestions = (suggestions) => {
    if (suggestions.length > 0 && onStretchSuggestionsUpdate) {
      onStretchSuggestionsUpdate(suggestions);
    }
  };

  const analyzeAgendaForBreaks = async () => {
    if (events.length === 0) return;

    try {
      setIsLoading(true);

      // Format events for analysis
      const eventsContext = events.map((event) => ({
        summary: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end?.dateTime || event.end?.date,
        description: event.description || "No description",
      }));

      // Build conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.sender === "user" || msg.sender === "bot")
        .map(msg => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`)
        .join("\n");

      const prompt = `You are a helpful calendar assistant that ONLY suggests desk-based stretching breaks. The user wants to stay at their desk/workstation at all times.

STRICT RULES:
- ONLY suggest desk stretches - NO walking, lunch breaks, or leaving the desk
- Suggest 4-6 stretch opportunities throughout the day
- Each stretch is 1-2 minutes while seated or standing at desk
- Can suggest stretches during meetings if appropriate (muted/camera off moments)
- Can suggest stretches during work blocks, not just between meetings
- Do NOT specify which stretches to do, just mention "desk stretch" or "quick stretch"
- For times, use format like "10:30 AM" or "2:15 PM"
- If this is a repeat analysis, provide NEW times that weren't mentioned before
- Consider the conversation history to understand context and avoid repeating suggestions

Previous conversation:
${conversationHistory}

Current Calendar Events (${events.length} events today):
${eventsContext
  .map(
    (event, index) =>
      `${index + 1}. ${event.summary} - ${new Date(
        event.start
      ).toLocaleTimeString()} to ${new Date(event.end).toLocaleTimeString()}`
  )
  .join("\n")}

Provide EXACTLY this format:

**Desk Stretch Opportunities:**
• **[Time]** - Quick desk stretch
• **[Time]** - Brief stretch break
• **[Time]** - 1-2 minute desk stretch
• **[Time]** - Quick stretch
• **[Time]** - Short desk stretch

**Schedule Notes:**
• [Brief note about meeting density]
• [One wellness tip about desk stretching]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text;
      const suggestions = parseStretchSuggestions(responseText);
      
      // Update parent component with new suggestions
      updateStretchSuggestions(suggestions);

      const analysisMessage = {
        id: Date.now(),
        text: responseText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
        hasCalendarAction: suggestions.length > 0,
      };

      setMessages((prev) => [...prev, analysisMessage]);
    } catch (error) {
      console.error("Error analyzing agenda:", error);
      const errorMessage = {
        id: Date.now(),
        text: "I had trouble analyzing your agenda for desk stretches, but I'm still here to help with any questions!",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = async (userMessage) => {
    try {
      setIsLoading(true);

      // Format events for the AI context
      const eventsContext =
        events.length > 0
          ? events.map((event) => ({
              summary: event.summary,
              start: event.start.dateTime || event.start.date,
              end: event.end?.dateTime || event.end?.date,
              description: event.description || "No description",
            }))
          : [];

      // Build conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.sender === "user" || msg.sender === "bot")
        .map(msg => `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`)
        .join("\n");

      // Create a conversation context for calendar assistance
      const prompt = `You are a helpful calendar assistant that ONLY suggests desk-based stretching breaks. The user wants to stay at their desk/workstation at all times.

STRICT RULES:
- ONLY suggest desk stretches - NO walking, lunch breaks, or leaving the desk
- Suggest 4-6 stretch opportunities throughout the day
- Each stretch is 1-2 minutes while seated or standing at desk
- Can suggest stretches during meetings if appropriate (muted/camera off moments)
- Can suggest stretches during work blocks, not just between meetings
- Do NOT specify which stretches to do, just mention "desk stretch" or "quick stretch"
- For times, use format like "10:30 AM" or "2:15 PM"
- If the user asks for "one more" or additional suggestions, provide NEW times that weren't mentioned before
- Consider the conversation history to understand context and avoid repeating suggestions

Previous conversation:
${conversationHistory}

User's current question: "${userMessage}"

Here are the user's events for today (${events.length} total):
${eventsContext
  .map(
    (event, index) =>
      `${index + 1}. ${event.summary} — ${new Date(
        event.start
      ).toLocaleTimeString()} to ${new Date(event.end).toLocaleTimeString()}`
  )
  .join("\n")}

Provide your response in this format:

**Desk Stretch Opportunities:**
• **[Time]** - Quick desk stretch
• **[Time]** - Brief stretch break
• **[Time]** - 1-2 minute desk stretch
• **[Time]** - Quick stretch
• **[Time]** - Short desk stretch

**Schedule Notes:**
• [Brief insight about schedule]
• [Desk wellness tip]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text;
      const suggestions = parseStretchSuggestions(responseText);
      
      // Update parent component with new suggestions
      updateStretchSuggestions(suggestions);

      return {
        text: responseText,
        hasCalendarAction: suggestions.length > 0,
      };
    } catch (error) {
      console.error("Error generating response:", error);
      return {
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        hasCalendarAction: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() && !isLoading) {
      const userMessage = messageInput.trim();
      const userMessageId = Date.now();

      // Add user message
      const newUserMessage = {
        id: userMessageId,
        text: userMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setMessageInput("");

      // Generate and add bot response
      const botResponse = await generateResponse(userMessage);
      const botMessageId = userMessageId + 1;

      const newBotMessage = {
        id: botMessageId,
        text: botResponse.text,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
        hasCalendarAction: botResponse.hasCalendarAction,
      };

      setMessages((prev) => [...prev, newBotMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBreakSuggestion = () => {
    analyzeAgendaForBreaks();
  };

  const handleResetAnalysis = () => {
    // Reset conversation to initial state
    setMessages([
      {
        id: Date.now(),
        text: "Hi there! I'm your calendar assistant. I'll help you find opportunities for quick desk stretches throughout your day.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setHasAnalyzedAgenda(false);
    // Clear any existing suggestions
    if (onStretchSuggestionsUpdate) {
      onStretchSuggestionsUpdate([]);
    }
  };

  // Function to render formatted text with basic markdown support
  const renderFormattedText = (text) => {
    // Simple markdown rendering for bold text and bullet points
    return text.split("\n").map((line, index) => {
      // Handle bold text
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      // Handle bullet points
      if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
        return (
          <div key={index} style={{ marginLeft: "12px", marginBottom: "4px" }}>
            <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          </div>
        );
      }

      // Handle headers (lines with **)
      if (line.includes("**") && !line.trim().startsWith("•")) {
        return (
          <div
            key={index}
            style={{ marginBottom: "8px", marginTop: index > 0 ? "12px" : "0" }}
          >
            <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          </div>
        );
      }

      // Regular lines
      if (line.trim()) {
        return (
          <div key={index} style={{ marginBottom: "4px" }}>
            <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          </div>
        );
      }

      // Empty lines for spacing
      return <div key={index} style={{ height: "8px" }} />;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <RobotOutlined
            style={{ fontSize: 16, color: "#1890ff", marginRight: 8 }}
          />
          <Text strong>Desk Stretch Assistant</Text>
        </div>
        {events.length > 0 && (
          <Button
            size="small"
            onClick={handleResetAnalysis}
            disabled={isLoading}
            danger
            style={{ 
              fontSize: "12px",
              background: "#ff4d4f",
              borderColor: "#ff4d4f",
              color: "#ffffff"
            }}
          >
            Reset Analysis
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          background: "#ffffff",
          minHeight: 0, // Critical for scrolling
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id}>
            <div
              style={{
                display: "flex",
                marginBottom: "16px",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  maxWidth: "70%",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  size="small"
                  icon={
                    msg.sender === "user" ? <UserOutlined /> : <RobotOutlined />
                  }
                  style={{
                    margin: msg.sender === "user" ? "0 0 0 8px" : "0 8px 0 0",
                    background: msg.sender === "user" ? "#1890ff" : "#52c41a",
                  }}
                />
                <div
                  style={{
                    background: msg.sender === "user" ? "#1890ff" : "#f5f5f5",
                    color: msg.sender === "user" ? "#ffffff" : "#000000",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    wordWrap: "break-word",
                    lineHeight: "1.4",
                  }}
                >
                  {msg.sender === "bot" ? (
                    <div style={{ color: "#000000" }}>
                      {renderFormattedText(msg.text)}
                    </div>
                  ) : (
                    <Text style={{ color: "#ffffff" }}>{msg.text}</Text>
                  )}
                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.7,
                      marginTop: "8px",
                      textAlign: msg.sender === "user" ? "right" : "left",
                    }}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div
            style={{
              display: "flex",
              marginBottom: "16px",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                maxWidth: "70%",
              }}
            >
              <Avatar
                size="small"
                icon={<RobotOutlined />}
                style={{
                  margin: "0 8px 0 0",
                  background: "#52c41a",
                }}
              />
              <div
                style={{
                  background: "#f5f5f5",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Spin size="small" />
                <Text style={{ marginLeft: 8, color: "#666" }}>
                  Finding desk stretch opportunities...
                </Text>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #f0f0f0",
          background: "#fafafa",
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <TextArea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about desk stretching opportunities..."
          autoSize={{ minRows: 1, maxRows: 3 }}
          disabled={isLoading}
          style={{
            flex: 1,
            borderRadius: "20px",
            resize: "none",
            border: "1px solid #d9d9d9",
            padding: "8px 12px",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          disabled={!messageInput.trim() || isLoading}
          loading={isLoading}
          style={{
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
};

export default ChatInterface;