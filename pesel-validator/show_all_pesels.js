
class PeselValidator{
    constructor() {
    }

    static validatePesel(peselString) {
        if (peselString.length !== 11 || !PeselValidator.validatePeselCheckSum(peselString)) {
            return false;
        }
        String.prototype.isNumber = function(){return /^\d+$/.test(this);}

        if (!peselString.isNumber()) {return false;}

        const pesel = {year: parseInt(peselString.substr(0, 2)),
            month: parseInt(peselString.substr(2, 2)),
            days: parseInt(peselString.substr(4, 2)),
            extra: parseInt(peselString.substr(6))};

        // console.log(pesel);

        return PeselValidator.validatePeselDate(pesel);
    }

    static validatePeselCheckSum(peselString) {
        if (peselString.length !== 11) {
            return false;
        }

        const wages = [1,3,7,9,1,3,7,9,1,3];
        let checkSum = 0;

        for (let i = 0; i < peselString.length - 1; i++) {
            checkSum += parseInt(peselString[i]) * wages[i];
        }

        checkSum = 10 - (checkSum % 10);
        if (checkSum === 10) {checkSum = 0;}

        return parseInt(peselString[10]) === checkSum;
    }

    static validatePeselDate(peselStruct) {
        let result = false;

        // not validated against format, done before
        const additives = [0, 20, 40, 60, 80];
        const yearAdditives = [1900, 2000, 2100, 2200, 1800];
        const maxDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (let i=0; i < additives.length; i++) {
            if ((peselStruct.month >= (1 + additives[i]) ) && (peselStruct.month <= (12 + additives[i]))) {
                let actualMonth = peselStruct.month - additives[i];
                let year = yearAdditives[i] + peselStruct.year;
                // console.log(peselStruct.days)
                // console.log(actualMonth)
                // console.log(year)
                if (PeselValidator.isLeapYear(year) && actualMonth === 2 && peselStruct.days === 29) {
                    result = true
                    break;
                }
                else if ( peselStruct.days <= maxDays[actualMonth]) {
                    result = true
                    break;
                } else {
                    break;
                }
            }
        }
        return result;
    }

    static isLeapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }
}

function twoDigits(number) {
    if (number >= 0 && number < 10) {
        return "0" + number.toString()
    } else if (number >= 10 && number <100) {
        return number.toString()
    }
    return "0"
}

String.prototype.isNumber = function(){return /^\d+$/.test(this);}

onmessage = function(e) {
    console.log('Worker show_all_pesels: Message received from main script');

    let lengths = [2, 2, 2];
    let wages = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let string = "";
    for (let i = 0; i < 3; i++) {
        if (!e.data[i].isNumber() || e.data[i].length !== lengths[i]) {
            console.log('Worker show_all_pesels: negative, invalid input');
            postMessage(false);
            return;
        }
        string += e.data[i];
    }

    let results = [];

    for(let i=0; i < 10000 ;i++ ) {
        let pesel = string;
        let zeros = ""
        if ( i < 10 ) {
            zeros = "000"
        } else if ( i < 100) {
            zeros = "00"
        } else if ( i < 1000) {
            zeros = "0"
        }
        pesel += zeros + i.toString();

        let checkSum = 0;
        for (let j = 0; j < pesel.length; j++) {
            checkSum += parseInt(pesel[j]) * wages[j];
        }
        checkSum = 10 - checkSum%10;
        if (checkSum === 10) {checkSum = 0;}

        pesel += checkSum.toString();

        if (PeselValidator.validatePesel(pesel)) {results.push(pesel)}
    }

    postMessage(results)
}