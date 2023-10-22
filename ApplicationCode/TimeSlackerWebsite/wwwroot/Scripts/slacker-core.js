//-- Global variables
var slacker_rootPath = "C:\\Team\\web\\";
var slackerJson = {};

//-- Init
$(function () {
    getTotalFails();
    getMostRecentPeriod();
    getRecentFails();
    getClosestCall();
    getFailsOverTime();
    getTreemap();

    fitty(".flippable-back-titling-name");
    fitty(".flippable-back-titling-job");
});