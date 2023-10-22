function renderRecentFails(data) {
    let htmlExpression = ""
    data.forEach((fail) => {
        let empId = fail.employeeId;
        let imgName = (fail.lastName + fail.firstName.charAt(0)).toLowerCase();
        let team = slackerJson.find((x) => x.EmployeeId == empId).Team;
        let title = slackerJson.find((x) => x.EmployeeId == empId).Title;
        let years = getYears(slackerJson.find((x) => x.EmployeeId == empId).StartDate);

        htmlExpression += "<div class='flippable-container'>";
        htmlExpression += "    <div class='flippable " + team.toLowerCase() + "'>";
        htmlExpression += "        <div class='flippable-content'>";
        htmlExpression += "            <div class='flippable-front'>";
        htmlExpression += "                <img src='Content/Images/Employee Cards/" + imgName + ".jpg' width='300' height='500' class='flippable-front-img' draggable='false' />";
        htmlExpression += "                <div class='flippable-front-gradient'></div>";
        htmlExpression += "                <div class='flippable-front-meta'>";
        htmlExpression += "                    <span class='flippable-front-meta-years'>" + years + "</span>";
        htmlExpression += "                    <img src='Content/Images/Logos/" + team.toLowerCase() + "_35x35.png' width='35' height='35' class='flippable-front-meta-team' draggable='false' />";
        htmlExpression += "                </div>";
        htmlExpression += "                <div class='flippable-front-titling'>";
        htmlExpression += "                    <span class='flippable-front-titling-name'>" + fail.firstName + " " + fail.lastName + "</span>";
        htmlExpression += "                    <span class='flippable-front-titling-job'>" + title + "</span>";
        htmlExpression += "                </div>";
        htmlExpression += "            </div>";
        htmlExpression += "            <div class='flippable-back'>";
        htmlExpression += "                <div class='flippable-back-meta'>";
        htmlExpression += "                    <div class='flippable-back-meta-years-container'>";
        htmlExpression += "                        <span class='flippable-back-meta-years'>" + years + "</span>";
        htmlExpression += "                        <span class='flippable-back-meta-years-label'>year" + (years == 1 ? "s" : "") + "</span>";
        htmlExpression += "                    </div>";
        htmlExpression += "                    <div class='flippable-back-meta-team-container " + team.toLowerCase() + "'>";
        htmlExpression += "                        <img src='Content/Images/Logos/" + team.toLowerCase() + "_50x50.png' width='50' height='50' class='flippable-back-meta-team' draggable='false' />";
        htmlExpression += "                        <span class='flippable-back-meta-team-label'>" + team + "</span>";
        htmlExpression += "                    </div>";
        htmlExpression += "                </div>";
        htmlExpression += "                <div class='flippable-back-img-container'>";
        htmlExpression += "                    <img src='Content/Images/Employee Display Pictures/" + imgName + ".jpg' width='300' height='300' class='flippable-back-img' draggable='false' />";
        htmlExpression += "                </div>";
        htmlExpression += "                <div class='flippable-back-titling'>";
        htmlExpression += "                    <span class='flippable-back-titling-name'>" + fail.firstName + " " + fail.lastName + "</span>";
        htmlExpression += "                    <span class='flippable-back-titling-job'>" + title + "</span>";
        htmlExpression += "                </div>";
        htmlExpression += "                <hr />";
        htmlExpression += "                <div class='flippable-back-stats'>";
        htmlExpression += "                    <div class='flippable-back-stat-container'>";
        htmlExpression += "                        <span class='flippable-back-stat'>" + fail.totalFails + "</span>";
        htmlExpression += "                        <span class='flippable-back-stat-label'>Total Fails</span>";
        htmlExpression += "                    </div>";
        htmlExpression += "                    <div class='flippable-back-stat-container'>";
        htmlExpression += "                        <span class='flippable-back-stat'>" + (fail.failRate * 100).toFixed(2) + "%</span>";
        htmlExpression += "                        <span class='flippable-back-stat-label'>Failure Rate</span>";
        htmlExpression += "                    </div>";
        htmlExpression += "                    <div class='flippable-back-stat-container'>";
        htmlExpression += "                        <span class='flippable-back-stat'>" + (fail.mostRecent == null ? "N/A" : fail.mostRecent) + "</span>";
        htmlExpression += "                        <span class='flippable-back-stat-label'>Last Fail</span>";
        htmlExpression += "                    </div>";
        htmlExpression += "                </div>";
        htmlExpression += "                <hr />";
        htmlExpression += "                <div class='flippable-back-achievements-container'>";
        htmlExpression += "                    <img src='Content/Images/Achievements/test-achievement-1.png' width='50' height='50' class='flippable-back-achievement' draggable='false' />";
        htmlExpression += "                    <img src='Content/Images/Achievements/test-achievement-2.png' width='50' height='50' class='flippable-back-achievement' draggable='false' />";
        htmlExpression += "                    <img src='Content/Images/Achievements/test-achievement-3.png' width='50' height='50' class='flippable-back-achievement' draggable='false' />";
        htmlExpression += "                </div>";
        htmlExpression += "            </div>";
        htmlExpression += "        </div>";
        htmlExpression += "    </div>";
        htmlExpression += "</div>";
    });

    $("#recent-fails-display").html(htmlExpression);
    fitty(".flippable-back-titling-name");
}

function getYears(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}