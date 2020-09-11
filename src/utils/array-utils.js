export const firstContainsAllOfSecond = (arr1, arr2) => {
    for (const val in arr2) {
        console.log('val', val);
        if (!arr1.includes(val)) {
            return false;
        }
    }
    return true;
};
