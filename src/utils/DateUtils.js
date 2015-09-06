export default class DateUtils {
  static addDays(date, amount) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + amount);
    return newDate;
  }
}
