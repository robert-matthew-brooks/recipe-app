export function getShortDate(longDate) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date = new Date(longDate);

  const shortDate = `${date.getDate()} ${
    months[date.getMonth()]
  }, ${date.getFullYear()}`;

  return shortDate;
}
