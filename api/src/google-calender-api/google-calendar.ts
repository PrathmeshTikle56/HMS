import axios from 'axios';

const API_KEY = 'YOUR_API_KEY'; // replace this
const CALENDAR_ID = 'CALENDER_ID';

export const getUpcomingHolidays = async () => {
  const timeMin = new Date().toISOString(); // today's date

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    CALENDAR_ID
  )}/events?key=${API_KEY}&timeMin=${timeMin}&orderBy=startTime&singleEvents=true`;

  const { data } = await axios.get(url);
  return data.items.map((event: any) => ({
    name: event.summary,
    date: event.start.date || event.start.dateTime,
  }));
};
