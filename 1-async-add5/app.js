let data = {
    numbers: [],
    addNumber: function(newNumber) {
        this.numbers.push(newNumber);
    },
    getSum: function() {
        let total = 0;
        for (i = 0; i < this.numbers.length; i++) {
            total += this.numbers[i];
        };
        return total; 
    }
};

let updateDocument = function() {
    let consoleText = "SUM: " + data.getSum().toString();
    document.getElementById("dataconsole").innerHTML = consoleText;
};

document.getElementById("add5").addEventListener("click", function(){
    data.addNumber(5);
    updateDocument();
});

updateDocument();