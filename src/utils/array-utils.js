export const firstContainsAllOfSecond = (arr1, arr2) => {
    for (const val in arr2) {
        if (!arr1.includes(arr2[val])) {
            return false;
        }
    }
    return true;
};

export const splitArrayIntoChunks = (array, chunkSize) => {
    const arrOfArr = [];

    while(array.length) {
        arrOfArr.push(array.splice(0, chunkSize));
    }

    return arrOfArr;
}