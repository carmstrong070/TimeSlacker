//-- Global variables
var slacker_rootPath = "C:\\Team\\web\\";

//-- Init
$(function () {
    getMostRecentPeriod();
    getRecentFails();
    getClosestCall();
    getFailsOverTime();
    getTreemap();
});