export const minutesToTime = (timeInMinutes: number | undefined): string => {
  if (!timeInMinutes) {
    return '';
  }
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  let string = '';
  if (hours > 1) {
    string += hours + ' hours';
  } else if (hours === 1) {
    string += hours + ' hour';
  }

  if (minutes > 0 && hours > 0) {
    string += ', ' + minutes + ' minutes';
  } else if (minutes > 0) {
    string += minutes + ' minutes';
  }
  return string;
};

export const minutesToTimeGetHours = (minutes: string | number): number => {
  return Math.floor(parseInt('' + minutes) / 60);
};

export const minutesToTimeGetMinutes = (minutes: string | number): number => {
  return parseInt('' + minutes) % 60;
};
