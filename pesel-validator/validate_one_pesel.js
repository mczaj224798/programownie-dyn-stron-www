function isLeapYear(year)
{
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

function validateDate(msg) {
    let result = false;

    // not validated against format, done before
        const additives = [0, 20, 40, 60, 80];
        const yearAdditives = [1900, 2000, 2100, 2200, 1800];
        const maxDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (let i=0; i < additives.length; i++) {
            if ((msg.month >= (1 + additives[i]) ) && (msg.month <= (12 + additives[i]))) {
                let actualMonth = msg.month - additives[i];
                let year = yearAdditives[i] + msg.year;
                console.log(msg.days)
                console.log(actualMonth)
                console.log(year)
                if (isLeapYear(year) && actualMonth === 2 && msg.days === 29) {
                    result = true
                    break;
                }
                else if ( msg.days <= maxDays[actualMonth]) {
                    result = true
                    break;
                } else {
                    break;
                }
            }
        }
    return result;
}

String.prototype.isNumber = function(){return /^\d+$/.test(this);}

onmessage = function(e) {
    console.log('Worker validate_one_pesel: Message received from main script');

    let lengths = [2, 2, 2, 5];
    let wages = [1,3,7,9,1,3,7,9,1,3];
    let string = "";
    for(let i=0; i<4; i++) {
        if (!e.data[i].isNumber() || e.data[i].length !== lengths[i]) {
            console.log('Worker validate_one_pesel: negative, non-digital characters present');
            postMessage(false);
            return;
        }
        string += e.data[i];
    }

    let checkSum = 0;
    for (let i = 0; i < string.length - 1; i++) {
        checkSum += parseInt(string[i]) * wages[i];
    }

    checkSum = 10 - (checkSum % 10);
    if (checkSum === 10) {
        checkSum = 0;
    }

    if ( parseInt(string[10]) !== checkSum ) {
        console.log('Worker validate_one_pesel: negative, invalid checksum');
        postMessage(false);
        return;
    }

    const message = {year: parseInt(e.data[0]), month: parseInt(e.data[1]),
                        days: parseInt(e.data[2]), extra: parseInt(e.data[3])};
    console.log(message);

    if (!validateDate(message)) {
        console.log('Worker validate_one_pesel: negative');
        postMessage(false);
        return;
    }
    console.log('Worker validate_one_pesel: positive');
    postMessage(true);
}
