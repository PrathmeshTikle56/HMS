import { Module } from '@nestjs/common';
import { CalendarController } from '../google-calender-api/google-calender.controller';

@Module({
  controllers: [CalendarController],
})
export class CalendarModule {}
