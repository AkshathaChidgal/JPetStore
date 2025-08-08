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

    var data = {"OkPercent": 99.98643791957686, "KoPercent": 0.01356208042313691};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8202530485009627, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "2-3-click on productId"], "isController": false}, {"data": [1.0, 500, 1500, "2-4-click on itemId"], "isController": false}, {"data": [1.0, 500, 1500, "Click on product id"], "isController": false}, {"data": [1.0, 500, 1500, "4-10-Click on sign out"], "isController": true}, {"data": [1.0, 500, 1500, "4-6-Click on add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "Click on sign out-0"], "isController": false}, {"data": [1.0, 500, 1500, "4-2-Click on sign in"], "isController": true}, {"data": [0.7344079542030733, 500, 1500, "Scenario-1 Search"], "isController": true}, {"data": [0.47368421052631576, 500, 1500, "3-1-Open URL"], "isController": true}, {"data": [1.0, 500, 1500, "3-3-Enter Usernname and password"], "isController": true}, {"data": [1.0, 500, 1500, "4-8-Key in payment deatils and click continue"], "isController": true}, {"data": [0.46557377049180326, 500, 1500, "2-1-Open URL"], "isController": false}, {"data": [1.0, 500, 1500, "3-4-Click on category"], "isController": true}, {"data": [1.0, 500, 1500, "Click on sign out-1"], "isController": false}, {"data": [0.034482758620689655, 500, 1500, "Scenario-3 Add to Cart"], "isController": true}, {"data": [0.7344786015672091, 500, 1500, "1 Open URL"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "3-7-Click on signout"], "isController": true}, {"data": [1.0, 500, 1500, "Click on sign out"], "isController": false}, {"data": [0.5, 500, 1500, "4-1-Open URL"], "isController": false}, {"data": [1.0, 500, 1500, "Click on add to cart"], "isController": false}, {"data": [1.0, 500, 1500, "4-10-Click on sign out-0"], "isController": false}, {"data": [1.0, 500, 1500, "3-2-Click on sign in"], "isController": true}, {"data": [1.0, 500, 1500, "4-5-Click on product id"], "isController": true}, {"data": [1.0, 500, 1500, "4-10-Click on sign out-1"], "isController": false}, {"data": [0.45901639344262296, 500, 1500, "Scenario-2 View Details"], "isController": true}, {"data": [1.0, 500, 1500, "4-4-Click on cateogory"], "isController": true}, {"data": [1.0, 500, 1500, "2-2- click on categoryId"], "isController": false}, {"data": [0.0, 500, 1500, "Scenario-4 Check out"], "isController": true}, {"data": [0.0, 500, 1500, "4-9-Click on confirm"], "isController": true}, {"data": [1.0, 500, 1500, "3-6-Click on add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "4-3-Enter usename,passwork & click on login "], "isController": true}, {"data": [1.0, 500, 1500, "4-7-Click on proceed to check out"], "isController": true}, {"data": [1.0, 500, 1500, "3-5-Click on product id"], "isController": true}, {"data": [0.9999241734910524, 500, 1500, "1 Search Product"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14747, 2, 0.01356208042313691, -1.1897871735607226E8, -1754584368852, 25024, 188.0, 753.0, 766.0, 1746.0, 148.13066275589125, 621.4981905234847, 140.36686630183115], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["2-3-click on productId", 278, 0, 0.0, 189.251798561151, 175, 218, 188.0, 199.0, 204.0, 215.62999999999994, 3.152892608848514, 12.37660311617502, 2.7007452678257517], "isController": false}, {"data": ["2-4-click on itemId", 277, 0, 0.0, 186.42960288808663, 173, 206, 185.0, 194.0, 196.09999999999997, 202.87999999999988, 3.141444383959354, 11.680895134447015, 2.6712931558757482], "isController": false}, {"data": ["Click on product id", 24, 0, 0.0, 187.79166666666669, 178, 197, 187.0, 195.5, 196.75, 197.0, 0.31291151123221944, 1.2551983850832475, 0.26799159702212544], "isController": false}, {"data": ["4-10-Click on sign out", 4, 0, 0.0, 366.0, 357, 375, 366.0, 375.0, 375.0, 375.0, 0.1186485925310711, 0.6115500697060481, 0.19523718595200665], "isController": true}, {"data": ["4-6-Click on add to cart", 4, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 0.11883188259409999, 0.5430988384183476, 0.10212114910430468], "isController": true}, {"data": ["Click on sign out-0", 22, 0, 0.0, 180.36363636363637, 171, 188, 181.5, 188.0, 188.0, 188.0, 0.3184252424374005, 0.071521294688088, 0.26649456325083226], "isController": false}, {"data": ["4-2-Click on sign in", 6, 0, 0.0, 195.66666666666666, 182, 204, 201.0, 204.0, 204.0, 204.0, 0.09382770106494441, 0.3752802613883372, 0.07577686404366116], "isController": true}, {"data": ["Scenario-1 Search", 6638, 0, 0.0, 684.212714673094, 0, 6415, 818.0, 953.0, 974.0, 1946.0, 66.52769147507466, 554.6991860993907, 126.65937717670728], "isController": true}, {"data": ["3-1-Open URL", 57, 0, 0.0, 858.8245614035088, 0, 4810, 747.0, 794.0, 1749.8, 4810.0, 0.6237757033891813, 3.0943412873855043, 0.46552339706059376], "isController": true}, {"data": ["3-3-Enter Usernname and password", 53, 0, 0.0, 184.33962264150944, 0, 203, 188.0, 194.0, 200.2, 203.0, 0.6320434082642657, 2.5280804662810805, 0.7279120207501043], "isController": true}, {"data": ["4-8-Key in payment deatils and click continue", 4, 0, 0.0, 183.0, 178, 188, 183.0, 188.0, 188.0, 188.0, 0.11927480916030533, 0.5201965797948473, 0.17355416567270993], "isController": true}, {"data": ["2-1-Open URL", 305, 0, 0.0, 831.0295081967212, 704, 3205, 747.0, 793.4000000000001, 1737.7, 3065.6799999999967, 3.1546393885171127, 15.529720436245254, 2.4269370487831363], "isController": false}, {"data": ["3-4-Click on category", 51, 0, 0.0, 181.88235294117646, 0, 200, 184.0, 191.0, 198.2, 200.0, 0.6396187370665329, 2.5793448611024017, 0.517461160406346], "isController": true}, {"data": ["Click on sign out-1", 22, 0, 0.0, 184.72727272727275, 173, 198, 183.5, 196.4, 197.85, 198.0, 0.3183745531902577, 1.5694870551800988, 0.2636539268606822], "isController": false}, {"data": ["Scenario-3 Add to Cart", 29, 0, 0.0, -6.0502904658655174E10, -1754584368852, 25024, 2068.0, 16522.0, 23429.0, 25024.0, 0.3065085505316338, 8.168892569413616, 1.8072093420371191], "isController": true}, {"data": ["1 Open URL", 6636, 0, 0.0, 499.0040687160941, 170, 6233, 712.0, 764.0, 781.0, 1761.0, 66.65729152018001, 325.0339090468489, 51.5886302126233], "isController": false}, {"data": ["3-7-Click on signout", 23, 0, 0.0, 482.34782608695645, 0, 3427, 367.0, 378.6, 2817.3999999999915, 3427.0, 0.3156262436360143, 1.556099562926267, 0.502680893290884], "isController": true}, {"data": ["Click on sign out", 22, 0, 0.0, 365.49999999999994, 351, 379, 367.5, 377.1, 378.85, 379.0, 0.3175152984643806, 1.636568110639649, 0.5286753748845399], "isController": false}, {"data": ["4-1-Open URL", 3, 0, 0.0, 741.3333333333334, 736, 748, 740.0, 748.0, 748.0, 748.0, 0.04886232226330277, 0.2482880372819519, 0.036996667182435626], "isController": false}, {"data": ["Click on add to cart", 23, 0, 0.0, 187.3913043478261, 178, 200, 187.0, 193.6, 198.79999999999998, 200.0, 0.3148269820411739, 1.437801673544952, 0.26797454606740034], "isController": false}, {"data": ["4-10-Click on sign out-0", 2, 0, 0.0, 175.5, 171, 180, 175.5, 180.0, 180.0, 180.0, 0.065603883749918, 0.014735247326641736, 0.05426414993767631], "isController": false}, {"data": ["3-2-Click on sign in", 54, 0, 0.0, 188.11111111111111, 175, 202, 188.0, 197.0, 200.5, 202.0, 0.6425435204245546, 2.5696395583703193, 0.5189291908116277], "isController": true}, {"data": ["4-5-Click on product id", 4, 0, 0.0, 187.5, 186, 189, 187.5, 189.0, 189.0, 189.0, 0.11896618386223716, 0.44577465574160546, 0.10188803051482617], "isController": true}, {"data": ["4-10-Click on sign out-1", 2, 0, 0.0, 189.5, 186, 193, 189.5, 193.0, 193.0, 193.0, 0.06559527714004593, 0.32336421777632013, 0.053680510003279766], "isController": false}, {"data": ["Scenario-2 View Details", 305, 0, 0.0, 1424.5573770491806, 896, 8080, 1309.0, 1376.6000000000004, 2294.5, 7733.9799999999905, 3.14809462862805, 49.10237371495809, 9.89492750350935], "isController": true}, {"data": ["4-4-Click on cateogory", 4, 0, 0.0, 188.5, 187, 190, 188.5, 190.0, 190.0, 190.0, 0.13086864060199574, 0.46851995746769176, 0.10811999018485195], "isController": true}, {"data": ["2-2- click on categoryId", 303, 0, 0.0, 185.90759075907584, 174, 207, 185.0, 194.60000000000002, 198.8, 204.91999999999996, 3.160859586897559, 11.835151034060088, 2.611515165345295], "isController": false}, {"data": ["Scenario-4 Check out", 3, 2, 66.66666666666667, 4223.0, 2739, 7089, 2841.0, 7089.0, 7089.0, 7089.0, 0.04428109639994686, 1.7208366313524923, 0.319380290668497], "isController": true}, {"data": ["4-9-Click on confirm", 4, 4, 100.0, 370.5, 363, 378, 370.5, 378.0, 378.0, 378.0, 0.11844832691738229, 1.7835495632217944, 0.09670195439739412], "isController": true}, {"data": ["3-6-Click on add to cart", 24, 0, 0.0, 179.58333333333331, 0, 200, 186.5, 193.5, 198.5, 200.0, 0.31370908710655654, 1.373000615163913, 0.25589705685323644], "isController": true}, {"data": ["4-3-Enter usename,passwork & click on login ", 5, 0, 0.0, 149.6, 0, 195, 179.0, 195.0, 195.0, 195.0, 0.0823207876452962, 0.26837863034673515, 0.07730436464816096], "isController": true}, {"data": ["4-7-Click on proceed to check out", 4, 0, 0.0, 182.5, 175, 190, 182.5, 190.0, 190.0, 190.0, 0.11911142874158775, 0.4913346435590495, 0.09991866922756239], "isController": true}, {"data": ["3-5-Click on product id", 25, 0, 0.0, 180.27999999999997, 0, 197, 187.0, 195.4, 196.7, 197.0, 0.32609404552272875, 1.25575505038153, 0.26811044805321854], "isController": true}, {"data": ["1 Search Product", 6594, 0, 0.0, 186.1360327570523, 171, 606, 185.0, 195.0, 198.0, 207.0, 67.84997684827906, 236.54215783685754, 77.19262071050059], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 2, 100.0, 0.01356208042313691], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14747, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4-9-Click on confirm", 2, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
