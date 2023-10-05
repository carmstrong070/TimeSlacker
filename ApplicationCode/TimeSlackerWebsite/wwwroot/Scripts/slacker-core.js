//-- Global variables
var slacker_rootPath = "C:\\Team\\web\\";

//-- Init
$(function () {
    getRecentFails();
    getClosestCall();
    getFailsOverTime();
    getTreemap();
});