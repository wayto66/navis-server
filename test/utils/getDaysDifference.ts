export const getDaysDifference = (date1: Date, date2: Date): number => {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  firstDate.setHours(0, 0, 0, 0);
  secondDate.setHours(0, 0, 0, 0);

  if (
    firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear()
  )
    return 0;

  const differenceInMilliseconds = secondDate.getTime() - firstDate.getTime();

  const differenceInDays = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  return differenceInDays;
};
