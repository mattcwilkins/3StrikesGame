export class DateTimeHelper {
  public static getFridayOf(date: Date) {
    const context = new Date(date.getTime());
    const first = context.getDate() - context.getDay() + 1;
    const fifth = first + 4;

    const friday = new Date(context.setDate(fifth));
    friday.setHours(8);
    friday.setMinutes(0);
    friday.setSeconds(0);
    friday.setMilliseconds(0);

    return friday;
  }
}
