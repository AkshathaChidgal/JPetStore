/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.98100484376484, "KoPercent": 0.018995156235160033};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6587183789364998, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "2-3-click on productId"], "isController": false}, {"data": [1.0, 500, 1500, "2-4-click on itemId"], "isController": false}, {"data": [1.0, 500, 1500, "Click on product id"], "isController": false}, {"data": [1.0, 500, 1500, "4-10-Click on sign out"], "isController": true}, {"data": [1.0, 500, 1500, "4-6-Click on add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "Click on sign out-0"], "isController": false}, {"data": [1.0, 500, 1500, "4-2-Click on sign in"], "isController": true}, {"data": [0.4622163472130425, 500, 1500, "Scenario-1 Search"], "isController": true}, {"data": [0.4649122807017544, 500, 1500, "3-1-Open URL"], "isController": true}, {"data": [1.0, 500, 1500, "3-3-Enter Usernname and password"], "isController": true}, {"data": [1.0, 500, 1500, "4-8-Key in payment deatils and click continue"], "isController": true}, {"data": [0.4440789473684211, 500, 1500, "2-1-Open URL"], "isController": false}, {"data": [1.0, 500, 1500, "3-4-Click on category"], "isController": true}, {"data": [1.0, 500, 1500, "Click on sign out-1"], "isController": false}, {"data": [0.034482758620689655, 500, 1500, "Scenario-3 Add to Cart"], "isController": true}, {"data": [0.4616232906925452, 500, 1500, "1 Open URL"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "3-7-Click on signout"], "isController": true}, {"data": [1.0, 500, 1500, "Click on sign out"], "isController": false}, {"data": [0.5, 500, 1500, "4-1-Open URL"], "isController": false}, {"data": [1.0, 500, 1500, "Click on add to cart"], "isController": false}, {"data": [1.0, 500, 1500, "4-10-Click on sign out-0"], "isController": false}, {"data": [1.0, 500, 1500, "3-2-Click on sign in"], "isController": true}, {"data": [1.0, 500, 1500, "4-5-Click on product id"], "isController": true}, {"data": [1.0, 500, 1500, "4-10-Click on sign out-1"], "isController": false}, {"data": [0.44243421052631576, 500, 1500, "Scenario-2 View Details"], "isController": true}, {"data": [1.0, 500, 1500, "4-4-Click on cateogory"], "isController": true}, {"data": [1.0, 500, 1500, "2-2- click on categoryId"], "isController": false}, {"data": [0.0, 500, 1500, "Scenario-4 Check out"], "isController": true}, {"data": [0.0, 500, 1500, "4-9-Click on confirm"], "isController": true}, {"data": [1.0, 500, 1500, "3-6-Click on add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "4-3-Enter usename,passwork & click on login "], "isController": true}, {"data": [1.0, 500, 1500, "4-7-Click on proceed to check out"], "isController": true}, {"data": [1.0, 500, 1500, "3-5-Click on product id"], "isController": true}, {"data": [1.0, 500, 1500, "1 Search Product"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10529, 2, 0.018995156235160033, -1.6663936299980983E8, -1754551216763, 25090, 205.0, 775.0, 815.0, 1784.7000000000007, 105.28684139475816, 441.98203350774475, 99.24391721373358], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["2-3-click on productId", 275, 0, 0.0, 189.0472727272728, 175, 231, 188.0, 199.0, 205.2, 215.24, 3.126172314617982, 12.264720008639603, 2.6780839157013427], "isController": false}, {"data": ["2-4-click on itemId", 274, 0, 0.0, 187.70802919708026, 174, 232, 186.0, 197.5, 203.25, 219.75, 3.115973343644097, 11.58744813226397, 2.649603502342666], "isController": false}, {"data": ["Click on product id", 24, 0, 0.0, 189.95833333333337, 180, 201, 191.5, 198.5, 201.0, 201.0, 0.3092265470990685, 1.2912749998389446, 0.26483562676355765], "isController": false}, {"data": ["4-10-Click on sign out", 4, 0, 0.0, 367.5, 358, 377, 367.5, 377.0, 377.0, 377.0, 0.11940654944923729, 0.6154568046807367, 0.19648440998238753], "isController": true}, {"data": ["4-6-Click on add to cart", 4, 0, 0.0, 185.0, 177, 193, 185.0, 193.0, 193.0, 193.0, 0.12001200120012001, 0.5476719546954696, 0.10313531353135313], "isController": true}, {"data": ["Click on sign out-0", 22, 0, 0.0, 187.40909090909088, 176, 205, 186.5, 199.9, 204.54999999999998, 205.0, 0.31849900107131485, 0.07153786156875236, 0.26655629288878596], "isController": false}, {"data": ["4-2-Click on sign in", 6, 0, 0.0, 191.66666666666669, 179, 203, 193.0, 203.0, 203.0, 203.0, 0.09429366189435966, 0.37708256392324496, 0.07615318201819868], "isController": true}, {"data": ["Scenario-1 Search", 4539, 0, 0.0, 1026.9982374972474, 0, 6370, 936.0, 1003.0, 1934.0, 2330.2000000000007, 45.31342031965978, 376.9458228874452, 85.96088820830298], "isController": true}, {"data": ["3-1-Open URL", 57, 0, 0.0, 858.4035087719299, 0, 3753, 748.0, 988.2000000000028, 1753.0, 3753.0, 0.6212060115304554, 3.0815939110912516, 0.4636056377170134], "isController": true}, {"data": ["3-3-Enter Usernname and password", 53, 0, 0.0, 189.13207547169813, 0, 221, 191.0, 204.0, 210.49999999999994, 221.0, 0.6380314922713921, 2.552267043265758, 0.7348083798815429], "isController": true}, {"data": ["4-8-Key in payment deatils and click continue", 4, 0, 0.0, 182.0, 181, 183, 182.0, 183.0, 183.0, 183.0, 0.12025012025012026, 0.5244502314814814, 0.17497331950456949], "isController": true}, {"data": ["2-1-Open URL", 304, 0, 0.0, 886.3355263157898, 710, 3256, 749.0, 1735.5, 1768.75, 3184.7999999999993, 3.1326319260533992, 15.422065637140236, 2.409953738291273], "isController": false}, {"data": ["3-4-Click on category", 51, 0, 0.0, 186.07843137254903, 0, 212, 188.0, 207.0, 210.8, 212.0, 0.6316571711667079, 2.5472388221451574, 0.5110201340723309], "isController": true}, {"data": ["Click on sign out-1", 22, 0, 0.0, 185.54545454545456, 178, 203, 185.0, 196.2, 202.25, 203.0, 0.3185082233032198, 1.5701460070650914, 0.26376462242297893], "isController": false}, {"data": ["Scenario-3 Add to Cart", 29, 0, 0.0, -6.0501761460517235E10, -1754551216763, 25090, 2089.0, 16516.0, 23505.5, 25090.0, 0.30689454468490396, 8.220879742314407, 1.8094748730091539], "isController": true}, {"data": ["1 Open URL", 4534, 0, 0.0, 841.8857520952797, 698, 6188, 749.0, 806.0, 1749.0, 2143.899999999998, 45.338639840804774, 221.20799266647, 35.079308948856536], "isController": false}, {"data": ["3-7-Click on signout", 23, 0, 0.0, 489.4347826086956, 0, 3420, 373.0, 387.0, 2813.7999999999915, 3420.0, 0.3162555344718533, 1.5592020907240878, 0.5036831308610401], "isController": true}, {"data": ["Click on sign out", 22, 0, 0.0, 373.3181818181818, 359, 389, 373.5, 383.4, 388.25, 389.0, 0.31764824788114177, 1.6372533714029947, 0.528896740856784], "isController": false}, {"data": ["4-1-Open URL", 3, 0, 0.0, 739.0, 720, 750, 747.0, 750.0, 750.0, 750.0, 0.04907734589713388, 0.24938065411922522, 0.037159474790603324], "isController": false}, {"data": ["Click on add to cart", 23, 0, 0.0, 192.73913043478257, 180, 232, 192.0, 205.0, 226.99999999999994, 232.0, 0.31541847803727424, 1.4404896186179186, 0.26846462341776495], "isController": false}, {"data": ["4-10-Click on sign out-0", 2, 0, 0.0, 188.0, 182, 194, 188.0, 194.0, 194.0, 194.0, 0.0660087791676293, 0.014826190633354237, 0.054599058549787124], "isController": false}, {"data": ["3-2-Click on sign in", 54, 0, 0.0, 187.55555555555551, 176, 205, 188.0, 199.0, 201.25, 205.0, 0.6484539177424197, 2.5929009681777244, 0.5237025292704893], "isController": true}, {"data": ["4-5-Click on product id", 4, 0, 0.0, 189.5, 188, 191, 189.5, 191.0, 191.0, 191.0, 0.11995082016373287, 0.48437172009476115, 0.1027313176597595], "isController": true}, {"data": ["4-10-Click on sign out-1", 2, 0, 0.0, 178.5, 175, 182, 178.5, 182.0, 182.0, 182.0, 0.0660087791676293, 0.3254026535529225, 0.05401890326413413], "isController": false}, {"data": ["Scenario-2 View Details", 304, 0, 0.0, 1434.5559210526312, 908, 7884, 1309.5, 2123.5, 2331.0, 3784.2999999999997, 3.1261568837151907, 48.61907249740344, 9.797469429347826], "isController": true}, {"data": ["4-4-Click on cateogory", 4, 0, 0.0, 177.5, 173, 182, 177.5, 182.0, 182.0, 182.0, 0.13200884459258772, 0.4728598066070427, 0.10944873931553414], "isController": true}, {"data": ["2-2- click on categoryId", 303, 0, 0.0, 186.3102310231023, 174, 213, 184.0, 196.0, 203.0, 211.95999999999998, 3.142534147833933, 11.755860165008972, 2.5959897362034456], "isController": false}, {"data": ["Scenario-4 Check out", 3, 2, 66.66666666666667, 4198.0, 2720, 7053, 2821.0, 7053.0, 7053.0, 7053.0, 0.04450114219598303, 1.737789883221586, 0.3210543015916575], "isController": true}, {"data": ["4-9-Click on confirm", 4, 4, 100.0, 368.5, 353, 384, 368.5, 384.0, 384.0, 384.0, 0.11938872970391595, 1.7977097883834767, 0.09746970510983764], "isController": true}, {"data": ["3-6-Click on add to cart", 24, 0, 0.0, 184.7083333333333, 0, 232, 192.0, 204.5, 225.75, 232.0, 0.3100134339154697, 1.3568133525369432, 0.2528698444120079], "isController": true}, {"data": ["4-3-Enter usename,passwork & click on login ", 5, 0, 0.0, 149.2, 0, 187, 186.0, 187.0, 187.0, 187.0, 0.08284866862189524, 0.27016433033421156, 0.07780007787774851], "isController": true}, {"data": ["4-7-Click on proceed to check out", 4, 0, 0.0, 193.0, 182, 204, 193.0, 204.0, 204.0, 204.0, 0.1199184554502938, 0.49431230513250984, 0.100595657452932], "isController": true}, {"data": ["3-5-Click on product id", 25, 0, 0.0, 182.36, 0, 201, 191.0, 198.0, 201.0, 201.0, 0.3218621657461409, 1.2902775296756916, 0.2646310493994052], "isController": true}, {"data": ["1 Search Product", 4485, 0, 0.0, 187.63188405797075, 171, 268, 186.0, 199.0, 205.0, 222.0, 45.81954149809979, 159.74851091278964, 52.128847187742636], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 2, 100.0, 0.018995156235160033], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10529, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4-9-Click on confirm", 2, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
