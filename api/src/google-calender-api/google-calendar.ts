import axios from 'axios';

const API_KEY = 'AIzaSyDo4KFzeRdq6KrqYJFmwKwZ--fq-B-uh-s'; // replace this
const CALENDAR_ID = 'en.indian#holiday@group.v.calendar.google.com';

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
