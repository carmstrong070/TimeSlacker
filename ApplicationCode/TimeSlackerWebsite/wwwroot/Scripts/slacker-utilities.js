function loadJson () {
    let jsonPath = (window.location.host === "10.97.97.81" ? "Content/Images/Slacker/Scripts/slacker-data.json" : "/Scripts/slacker-data.json");
    loadJsonFile(, function (jsonText) {
        slackerJson = JSON.parse(jsonText);
    });
});

//-- https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJsonFile(jsonFilepath, callback) {
    let xobj = new XMLHttpRequest();
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

function checkAuthorization() {
    if (window.location.host === "10.97.97.81" && document.referrer != "https://10.97.97.81/") {
        window.location.href = "https://www.uspioneer.com/timetracker";
    }
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};