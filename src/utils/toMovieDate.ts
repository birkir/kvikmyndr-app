import addDays from 'date-fns/add_days';

// if date 00:00 - 03:00: subtract 1 day
export function toMovieDate(date: Date) {
  if (date.getHours() < 4) {
    return addDays(date, -1);
  }
  return date;
}
