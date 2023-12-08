//-- Global variables
//var slacker_rootPath = "https://10.97.97.81/RiskChallenge/api/TimeSlacker/";
var slacker_rootPath = "https://localhost:7244/api/TimeSlacker/";
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