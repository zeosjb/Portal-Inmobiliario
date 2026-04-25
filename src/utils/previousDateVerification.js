const previousDateVerification = (date) => {
    if (!date) return false;

    const inputDate = new Date(date);

    if (Number.isNaN(inputDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate < today;
};

module.exports = previousDateVerification;
