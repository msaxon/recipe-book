import moment from 'moment';

export const minutesToTime = (timeInMinutes: number | undefined): string => {
    if(!timeInMinutes) {
        return '';
    }
    const hours = moment.duration(timeInMinutes, 'minutes').get('hours');
    const minutes = moment.duration(timeInMinutes, 'minutes').get('minutes');

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
    return Math.floor(parseInt(''+minutes) / 60);
};

export const minutesToTimeGetMinutes = (minutes: string | number): number => {
    return parseInt(''+minutes) % 60;
};
