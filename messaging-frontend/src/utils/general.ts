export const initials = (name: string) => {
    return name
      .split(' ')
      .map(name => name[0].toUpperCase())
      .join('');
  }

  //function to check if the date is today
  export const checkTodaysDate = (date: string) => {
    // Get today's date
        const today = new Date();
        const dateToCheck = new Date(date)
    // Compare the components of the dateToCheck with today's date
        const isSameDate =
        dateToCheck.getDate() === today.getDate() &&
        dateToCheck.getMonth() === today.getMonth() &&
        dateToCheck.getFullYear() === today.getFullYear();
        // Return true if the dateToCheck is today, otherwise return false
        return isSameDate;
    }

    //function to check if the date is yesterday
   export const checkYesterdaysDate = (date: string) => {
    // Get today's date
        const yesterday = new Date();
        const previous = new Date(yesterday.getTime());
        previous.setDate(yesterday.getDate() - 1);
        const dateToCheck = new Date(date)
    // Compare the components of the dateToCheck with today's date
        const isSameDate =
        dateToCheck.getDate() === previous.getDate() &&
        dateToCheck.getMonth() === previous.getMonth() &&
        dateToCheck.getFullYear() === previous.getFullYear();
        // Return true if the dateToCheck is today, otherwise return false
        return isSameDate;
    }