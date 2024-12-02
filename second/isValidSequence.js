
function checkSequence(arr) {
    // Determine if sequence is increasing or decreasing
    const isIncreasing = arr[0] < arr[arr.length - 1];
  
    // Check step differences
    for (let i = 1; i < arr.length; i++) {
      const diff = isIncreasing
        ? arr[i] - arr[i - 1] // For increasing sequence
        : arr[i - 1] - arr[i]; // For decreasing sequence
  
      // Ensure steps are between 1 and 3
      if (diff < 1 || diff > 3) return false;
    }
  
    return true;
  }


export const isValidSequence = (arrOfNumbers) => {
    if(checkSequence(arrOfNumbers)) return true;

    for(let i = 0; i < arrOfNumbers.length; i++) {
        const modifiedArray = [...arrOfNumbers.slice(0, i), ...arrOfNumbers.slice(i + 1)];
        if(checkSequence(modifiedArray)) return true;
    }

    return false;
};

