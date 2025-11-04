import { eachDayOfInterval, add, startOfDay, format, parse, eachMinuteOfInterval, isBefore, areIntervalsOverlapping } from "date-fns";
import { TZDate } from "@date-fns/tz";

function getDateSlots (meetings, pref, duration) {
  const present = TZDate.tz('Asia/Singapore');
  const monthLater = startOfDay(add(present, { months: 1}));
  const datesMonth = eachDayOfInterval({start: present, end: monthLater});
  const datesMonthFiltered = datesMonth.filter(date => {
    const dateWord = format(date, 'EEEE').toLowerCase();
    return pref.schedule[dateWord].on;
  });

  const possibleMeetings = {};

  datesMonthFiltered.forEach(date => {
    const dateWord = format(date, 'EEEE').toLowerCase();
    const day = pref.schedule[dateWord];
    const dayStart = parse(day.startTime, 'HH:mm', date);
    const endStart = parse(day.endTime, 'HH:mm', date);
    
    let possibleStarts = eachMinuteOfInterval({start: dayStart, end: endStart}, {step: 15}).filter(date => isBefore(add(date, {minutes: duration}), endStart));

    pref.holidays.forEach(holiday => {
      const holidayStart = holiday.startTime;
      const holidayEnd = holiday.endTime;

      possibleStarts = possibleStarts.filter(date => {
        return !areIntervalsOverlapping({start: date, end: add(date, {minutes: duration})}, {start: holidayStart, end: holidayEnd});
      });
    });

    day.breaks.forEach(brek => {
      const brekStart = parse(brek.startTime, 'HH:mm', date);
      const brekEnd = parse(brek.endTime, 'HH:mm', date);
      
      possibleStarts = possibleStarts.filter(date => {
        return !areIntervalsOverlapping({start: date, end: add(date, {minutes: duration})}, {start: brekStart, end: brekEnd});
      });
    });

    meetings.forEach(meeting => {
      possibleStarts = possibleStarts.filter(date => {
        return !areIntervalsOverlapping({start: date, end: add(date, {minutes: duration})}, {start: meeting.startTime, end: meeting.endTime});
      });
    });

    possibleMeetings[format(date, 'yyyy-MM-dd')] = possibleStarts;
  });

  return possibleMeetings;
}

export default getDateSlots;