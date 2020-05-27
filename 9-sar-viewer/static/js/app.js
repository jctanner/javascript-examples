/*---------------------------

    GLOBALS

---------------------------*/

var serverurl = "http://localhost:5000";


// cpu bar colors
const cpuColorGradients = {
    "red": {"low": 95, "high": 100},
    "orange": {"low": 80, "high": 95},
    "gold": {"low": 50, "high": 80},
    "yellow": {"low": 20, "high": 50},
    "green": {"low": 10, "high": 20},
    "darkgreen": {"low": 2, "high": 10},
    "blue": {"low": 0, "high": 2}
}

/*---------------------------

    Data Indexer

---------------------------*/

var DataIndexer = function() {
    console.log('DI init ...');
    this.files = [];
};

DataIndexer.prototype.add_file = function(filename) {
    console.log('add: ' + filename);
    this.files.push(filename);
};

DataIndexer.prototype.render_data = function() {
    console.log("DI.render_data");
    var html = "<ul>";
    for (i=0;i<this.files.length;i++) {
        html += "<li "
        html += 'onclick="di.showfile(' + "'" + this.files[i] + "'" + ')"'
        html += ">";
        html += this.files[i];
        html += "</li>";
    };
    html += "</ul>";
    return html;
};

DataIndexer.prototype.get_files = function() {
    console.log("DI.get_files ...");
    var parent = this;

    var filelist = fetch(serverurl + '/files', {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    })
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log("ERROR:" + response.status);
                return;
            };
            return response.json();
        }
    ).then(
        function(data) {
            console.log(data);
            //parent.clear();
            parent.files = [];
            for (i=0; i<data.length; i++) {
                parent.add_file(data[i]);
            };
            $("#data").html(parent.render_data());
        }
    );
};

DataIndexer.prototype.json_to_csv = function(jsonrows) {
    var rows = "";
    for (const property in jsonrows[0]) {
        rows += property + " "
    }
    rows += "<br>"
    //for (i=0;i<jsonrows.length;i++) {
    for (i=0;i<20;i++) {
        var thisrow = ""
        for (const property in jsonrows[i]) {
            thisrow += jsonrows[i][property] + " ";
        }
        rows += thisrow + "<br>";
    }
    return rows;
};


DataIndexer.prototype.renderFeatureMenu = function(filename) {

    var menuitems = ["cpu", "memused", "load"];

    var html = ""
    html += '<div id="featuremenu">'

    for (i=0; i<menuitems.length;i++) {
        html += '<button '
        html += 'id="' + menuitems[i] + '" '
        html += "onclick='" + "di.show" + menuitems[i] + '("' + filename + '")' + "'"
        html += '>'
        html += menuitems[i]
        html += "</button>"
    }

    html += "</div>"
    return html
}

DataIndexer.prototype.showfile = function(filename) {
    console.log("showing " + filename);
    $("#graph").html("<h2>" + "file: " + filename + "</h2>" + this.renderFeatureMenu(filename));
}

DataIndexer.prototype.showcpu = function(filename) {
    console.log("showing: " + filename);

    var parent = this;

    var filelist = fetch(serverurl + '/file/' + filename + '/cpu' , {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    })
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log("ERROR:" + response.status);
                return;
            };
            return response.json();
        }
    ).then(
        function(data) {
            $("#graph").html("");

            var height = 100;
            var width = 1000;
            var barOffset = 0;
            var barWidth = width / (data.length / 5);
            
            var timestamp = ""
            timestamp += data[0]['timestamp'];
            timestamp += " > "
            timestamp += data[data.length-1]['timestamp'];
            console.log(timestamp);
            $("#graph").html("<h2>" + timestamp + "</h2>" + parent.renderFeatureMenu(filename));

            var groups = [
                {"cpuid": 0, "color": 'orange'},
                {"cpuid": 1, "color": 'red'},
                {"cpuid": 2, "color": 'blue'},
                {"cpuid": 3, "color": 'green'}
            ];

            for (x=0;x<groups.length;x++) {
            
                //console.log("looking for cpu " + groups[x][0] + " and using color " + groups[x][1]);
                var testdata = [];
                for (i=0;i<data.length;i++) {
                    var thisbit = data[i];
                    if (thisbit.CPU.toString() === groups[x].cpuid.toString()) {
                        //console.log(thisbit);
                        testdata.push(thisbit['%usr']);
                    }
                }
                //console.log(testdata);

                var graph = d3.select('#graph')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .style('background', '#dff0d8')
                    .selectAll('rect')
                    .data(testdata)
                    .enter()
                    .append('rect')
                    //.style({'fill': '#3c763d', 'stroke': '#d6e9c6', 'stroke-width': 5})
                    //.style("fill", groups[x].color)
                    .style("fill", function(data){
                        for (const color in cpuColorGradients) {
                            if (data >= cpuColorGradients[color].low && data <= cpuColorGradients[color].high) {
                                return color;
                            }
                        };
                        return "blue";
                    })
                    //.style("color", groups[x].color)
                    .style("stroke-width", barWidth)
                    .attr('width', barWidth)
                    .attr('height', function(data) {return data;})
                    .attr('x', function(data, i){return i * (barWidth + barOffset);})
                    .attr('y', function(data) {
                        //var thisheight = (height*(4-x)) - data;
                        var thisheight = height - data;
                        //console.log(thisheight);
                        return thisheight;
                    });

                //console.log("add text ...");
                var graph = d3.select('#graph')
                    .append("text")
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .style("color", "black")
                    .text("cpu " + x);
            
            }
        }
    );
}

DataIndexer.prototype.showmemused = function(filename) {
    console.log("showing: " + filename);

    var parent = this;

    var filelist = fetch(serverurl + '/file/' + filename + '/memfree' , {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    })
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log("ERROR:" + response.status);
                return;
            };
            return response.json();
        }
    ).then(
        function(data) {
            //$("#graph").html("");
            $("#graph").html("<h2>" + timestamp + "</h2>" + parent.renderFeatureMenu(filename))

            var testdata = [];
            for (i=0;i<data.length;i++) {
                var thisbit = data[i]['%memused'];
                if (Number(thisbit) === thisbit && thisbit % 1 !== 0) {
                    testdata.push(thisbit);
                }
            }
            console.log(testdata);


            var height = 100;
            var width = 1000;
            var barOffset = 0;
            var barWidth = width / (testdata.length / 5);
            
            var timestamp = ""
            timestamp += data[0]['timestamp'];
            timestamp += " > "
            timestamp += data[data.length-1]['timestamp'];
            
            console.log(timestamp);
            console.log(data[0]);
            console.log(height);
            console.log(width);
            console.log(barWidth);

            var graph = d3.select('#graph')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('background', '#dff0d8')
                .selectAll('rect')
                .data(testdata)
                .enter()
                .append('rect')
                .style("fill", function(x){
                    for (const color in cpuColorGradients) {
                        if (x >= cpuColorGradients[color].low && x <= cpuColorGradients[color].high) {
                            return color;
                        }
                    };
                    return "blue";
                })
                .style("stroke-width", barWidth)
                .attr('width', barWidth)
                .attr('height', function(x) {
                    //console.log(x);
                    return x;
                })
                .attr('x', function(x, i){return i * (barWidth + barOffset);})
                .attr('y', function(x) {
                    var thisheight = height - x;
                    return thisheight;
                });

            //console.log("add text ...");
            var graph = d3.select('#graph')
                .append("text")
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("color", "black")
                .text("%memused");

            //$("#graph").html("<h2>" + timestamp + "</h2>" + parent.renderFeatureMenu(filename));        

        }
    );
}


/*---------------------------

    Main

---------------------------*/


di = new DataIndexer();
di.get_files();