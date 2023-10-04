var rootPath = "C:\\Team\\web\\";

$(function () {
    loadJson("/Scripts/timeslacker.json", function (jsonText) {
        var timeslackerJson = JSON.parse(jsonText);
        showStats(timeslackerJson);
        showChart(timeslackerJson);
    });
});

//-- https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJson(jsonFilepath, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", jsonFilepath, true); // Replace with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function showStats(timeslackerJson) {
    var steveObj = timeslackerJson.find((x) => {
        return x.FirstName === "Tony" //-- wife is scared of him
    });

    $("#lblFirstStat").text(steveObj.FirstName + " " + steveObj.LastName);
    $("#lblFailureRate").text(Number(steveObj.FailureRate).toLocaleString(undefined, {
        style: "percent",
        minimumFractionDigits: 2
    }));
}

//-- This is diabolical
var columnDataLoad2 = [];
var setTimeoutIndex = 0;

function showChart(timeslackerJson) {
    //var columnData = [];
    //for (var jsonIndex = 0; jsonIndex < timeslackerJson.length; jsonIndex++) {
    //    var currentTimeslacker = timeslackerJson[jsonIndex];

    //    var columnDataPoint = [];
    //    columnDataPoint.push(currentTimeslacker.FirstName + " " + currentTimeslacker.LastName);
    //    columnDataPoint.push(currentTimeslacker.TotalFailures);
    //    columnData.push(columnDataPoint)
    //}

    //var chart = bb.generate({
    //    padding: {
    //        top: 10,
    //        bottom: 15
    //    },
    //    data: {
    //        columns: columnData,
    //        type: "treemap", // for ESM specify as: treemap()
    //        labels: {
    //            colors: "#fff"
    //        }
    //    },
    //    treemap: {
    //        label: {
    //            threshold: 0.03
    //        }
    //    },
    //    bindto: "#chart"
    //});

    var peopleAddedLater = 10;
    var animateTimeInMilliseconds = 1500;

    //-- worst guy
    var columnData = [];
    var vanessaObj = timeslackerJson.find((x) => {
        return x.FirstName === "Vanessa" //-- doesn't work here
    });
    var vanessaDataPoint = [];
    vanessaDataPoint.push(vanessaObj.FirstName + " " + vanessaObj.LastName);
    vanessaDataPoint.push(vanessaObj.TotalFailures);
    columnData.push(vanessaDataPoint);

    var chart = bb.generate({
        padding: {
            top: 10,
            bottom: 15
        },
        data: {
            columns: columnData,
            type: "treemap", // for ESM specify as: treemap()
            labels: {
                colors: "#fff"
            }
        },
        treemap: {
            label: {
                threshold: 0.03
            }
        },
        bindto: "#chart"
    });

    timeslackerJson.sort((x, y) => {
        if (x.TotalFailures > y.TotalFailures)
            return 1;
        else if (x.TotalFailures < y.TotalFailures)
            return -1;
        else
            return 0;
    });

    //-- Do Alex's animate idea
    for (var jsonIndex = 0; jsonIndex < timeslackerJson.length; jsonIndex++) {
        var currentTimeslacker = timeslackerJson[jsonIndex];

        var columnDataPoint = [];
        columnDataPoint.push(currentTimeslacker.FirstName + " " + currentTimeslacker.LastName);
        columnDataPoint.push(currentTimeslacker.TotalFailures);
        columnDataLoad2.push(columnDataPoint)

        if (jsonIndex > peopleAddedLater)
            break;
    }

    for (var animationIndex = 0; animationIndex < columnDataLoad2.length; animationIndex++) {
        setTimeout(
            () => {
                var newLoad = columnDataLoad2[setTimeoutIndex];
                chart.load({
                    columns: [ newLoad ]
                });
                setTimeoutIndex++;
            },
            animateTimeInMilliseconds * (animationIndex + 1));
    }
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};