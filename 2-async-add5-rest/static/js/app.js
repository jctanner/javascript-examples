//https://blog.garstasio.com/you-dont-need-jquery/ajax/#sending-and-receiving-json

var data = {
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
    },
    getSumHTML: function() {
        let consoleText = "SUM: " + this.getSum().toString();
        return consoleText;
    }
};

let loadData = function() {
    $.ajax({
        url: '/api/data',
        accept: 'application/json',
        method: 'GET',
    }).then(
        function success(indata) {
            data.numbers = indata.numbers;
            document.getElementById("dataconsole").innerHTML = data.getSumHTML();
            
        },
        function fail(data, status) {
            alert('Request failed.  Returned status of ' + status);
        }
    );
};

let saveData = function() {
    $.ajax('/api/data', {
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            numbers: data.numbers
        })
    }).then(
        function success() {
            console.log("save successful!");
        },
        function fail(data, status) {
            console.log("save failed!");
            alert('Request failed.  Returned status of ' + status);   
        }
    )
}

let updateDocument = function() {
    document.getElementById("dataconsole").innerHTML = data.getSumHTML();
};

document.getElementById("add5").addEventListener("click", function(){
    data.addNumber(5);
    updateDocument();
});

document.getElementById("save").addEventListener("click", function(){
    console.log("save clicked!");
    saveData();
});

// MAIN
loadData();