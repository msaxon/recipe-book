export const firstContainsAllOfSecond = <T>(arr1: T[], arr2: T[]): boolean => {
    for (const val in arr2) {
        if (!arr1.includes(arr2[val])) {
            return false;
        }
    }
    return true;
};

export const splitArrayIntoChunks = <T>(array: T[], chunkSize: number): T[][] => {
    const arrOfArr = [];

    while(array.length) {
        arrOfArr.push(array.splice(0, chunkSize));
    }

    return arrOfArr;
}