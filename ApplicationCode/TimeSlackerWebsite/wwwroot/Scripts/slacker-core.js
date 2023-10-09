//-- Global variables
var slacker_rootPath = "C:\\Team\\web\\";

//-- Init
$(function () {
    getTotalFails();
    getMostRecentPeriod();
    getRecentFails();
    getClosestCall();
    getFailsOverTime();
    getTreemap();
});