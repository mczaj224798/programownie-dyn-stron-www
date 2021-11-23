
String.prototype.isNumber = function(){return /^\d+$/.test(this);}

onmessage = function(e) {
    console.log('Worker show_all_pesels: Message received from main script');

    let lengths = [2, 2, 2, 5];
    let wages = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    let string = "";
    for (let i = 0; i < 3; i++) {
        if (!e.data[i].isNumber() || e.data[i].length !== lengths[i]) {
            console.log('Worker show_all_pesels: negative, non-digital characters present');
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
        results.push(pesel);
    }

    postMessage(results)
}