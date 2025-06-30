import { Controller, Get } from '@nestjs/common';
import { getUpcomingHolidays } from '../google-calender-api/google-calendar';

@Controller('calendar')
export class CalendarController {
  @Get('festivals')
  async fetchFestivals() {
    return await getUpcomingHolidays();
  }
}
