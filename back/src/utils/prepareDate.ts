export const getDate = (dispalyDate: string) => {
  const day = dispalyDate.split('.')[0];
  const month = dispalyDate.split('.')[1];
  const year = dispalyDate.split('.')[2];
  return new Date(month + '.' + day + '.' + year);
};

export const getDisplayDate = (date: Date) => {
  const currentDay = `${
    date.getDay() < 10 ? '0' + date.getDay() : date.getDay()
  }`;
  const currentMonth = `${date.getMonth() + 1}`;
  const currentYear = `${date.getFullYear()}`;
  return currentDay + '.' + currentMonth + '.' + currentYear;
};

export const getDisplayTime = (hour: number, minute: number) => {
  const preparedHour: string = hour < 10 ? `0${hour}` : `${hour}`;
  const preparedMinute: string = minute < 10 ? `0${minute}` : `${minute}`;
  return preparedHour + ':' + preparedMinute;
};
