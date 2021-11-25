
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
    console.log('Worker find_valid_pesels: Message received from main script');

    const VALID_LENGTH = 5;
    if (e.data[0].length !== VALID_LENGTH || !e.data[0].isNumber()) {
       console.log('Worker show_all_pesels: negative, invalid input');
       postMessage(false);
       return;
     }

    let results = [];

    // 1930 - 1999
    for (let i=30; i<100; i++) {
        let years = twoDigits(i);
        let months = "";
        let days = "";
        for (let j=1; j<13; j++) {
            months = twoDigits(j);
            for(let k=1; k<32; k++) {
                // we dont care for appropiate number of days, it will be validated anyway
                days = twoDigits(k);
                let pesel = years + months + days + e.data[0];
                // console.log(pesel);
                if (PeselValidator.validatePesel(pesel)) {
                    results.push(pesel);
                }
            }
        }
    }

    // 2000 - 2030
    const millenialAdder= 20;
    for (let i=0; i<31; i++) {
        let years = twoDigits(i);
        let months = "";
        let days = "";
        for (let j=1+millenialAdder; j<13+millenialAdder; j++) {
            months = twoDigits(j);
            for(let k=1; k<32; k++) {
                // we dont care for appropiate number of days, it will be validated anyway
                days = twoDigits(k);
                let pesel = years + months + days + e.data[0];
                if (PeselValidator.validatePesel(pesel)) {
                    console.log(pesel);
                    results.push(pesel);
                }
            }
        }
    }

    postMessage(results)
}