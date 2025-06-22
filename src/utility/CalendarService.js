import axios from 'axios';

class CalendarService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://www.googleapis.com/calendar/v3';
  }

  // Create a stretch break event
  async createStretchEvent(stretchData) {
    const { time, title = "Desk Stretch Break", duration = 2 } = stretchData;
    
    try {
      // Parse the time and create start/end times
      const startTime = this.parseTimeToDate(time);
      const endTime = new Date(startTime.getTime() + duration * 60000); // Add duration in minutes

      const event = {
        summary: title,
        description: "Quick desk stretch break for better posture and energy. Stay at your desk and do some simple stretches!",
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        colorId: '7', // Peacock blue color for stretch events
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 1 }, // 1 minute before reminder
          ],
        },
      };

      const response = await axios.post(
        `${this.baseURL}/calendars/primary/events`,
        event,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        event: response.data,
        message: `Stretch break added at ${this.formatTime(startTime)}`,
      };
    } catch (error) {
      console.error('Error creating stretch event:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Failed to create event',
      };
    }
  }

  // Create multiple stretch events at once
  async createMultipleStretchEvents(stretchList) {
    const results = [];
    
    for (const stretch of stretchList) {
      const result = await this.createStretchEvent(stretch);
      results.push({
        ...result,
        originalTime: stretch.time,
      });
      
      // Small delay between requests to avoid rate limiting
      await this.delay(200);
    }

    return results;
  }

  // Parse time string to Date object (handles various formats)
  parseTimeToDate(timeString) {
    const today = new Date();
    
    // Remove any non-time characters and normalize
    const cleanTime = timeString.replace(/[^\d:APMapm\s]/g, '').trim();
    
    // Try to parse common time formats
    let hour, minute, isPM = false;
    
    if (cleanTime.includes('PM') || cleanTime.includes('pm')) {
      isPM = true;
    }
    
    // Extract hour and minute
    const timeMatch = cleanTime.match(/(\d{1,2}):?(\d{2})?/);
    if (timeMatch) {
      hour = parseInt(timeMatch[1]);
      minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      
      // Convert to 24-hour format
      if (isPM && hour !== 12) {
        hour += 12;
      } else if (!isPM && hour === 12) {
        hour = 0;
      }
    } else {
      // Default to current time if parsing fails
      hour = today.getHours();
      minute = today.getMinutes();
    }
    
    const eventDate = new Date(today);
    eventDate.setHours(hour, minute, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (eventDate <= today) {
      eventDate.setDate(eventDate.getDate() + 1);
    }
    
    return eventDate;
  }

  // Format time for display
  formatTime(date) {
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Parse stretch suggestions from Gemini response
  static parseStretchSuggestions(geminiResponse) {
    const stretches = [];
    const lines = geminiResponse.split('\n');
    
    for (const line of lines) {
      // Look for lines with time patterns like "**10:30 AM**" or "**2:15 PM**"
      const timeMatch = line.match(/\*\*([^*]+)\*\*.*(?:stretch|break)/i);
      if (timeMatch) {
        const timeStr = timeMatch[1].trim();
        // Skip lines that don't look like times
        if (timeStr.match(/\d+:?\d*\s*(AM|PM|am|pm)?/)) {
          stretches.push({
            time: timeStr,
            title: "Desk Stretch Break",
            originalLine: line.trim()
          });
        }
      }
    }
    
    return stretches;
  }
}

export default CalendarService;