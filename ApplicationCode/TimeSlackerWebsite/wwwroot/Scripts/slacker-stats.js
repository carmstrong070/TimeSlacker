function getTotalFails() {
    $.ajax({
        url: 'https://localhost:7244/api/TimeSlacker/GetTotalFails',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#lbl-total-fails").html(data);
        },
        fail: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });
}

function getRecentFails() {
    $.ajax({
        url: 'https://localhost:7244/api/TimeSlacker/GetRecentFails',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data.length > 0) {
                renderRecentFails(data);
                $("#compliance-video").hide();
                $("#compliance-container").hide();
                $("#recent-fails-container").css("background", "#101216");
            }
        },
        fail: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });
}

function getMostRecentPeriod() {
    $.ajax({
        url: 'https://localhost:7244/api/TimeSlacker/GetMostRecentPeriod',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#recentStartDate").html(data.startDate);
            $("#recentEndDate").html(data.endDate);
        },
        fail: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });
}

function getClosestCall() {
    $.ajax({
        url: 'https://localhost:7244/api/TimeSlacker/GetClosestCall',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#lblClosestCallName").html(data.name);
            $("#lblClosestCallTime").html(data.secondsTilFail);
            $("#lblClosestCallDate").html(new Date(data.closeCallDate).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" }));
        },
        fail: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });  
}

function getFailsOverTime() {
    $.ajax({
        url: 'https://localhost:7244/api/TimeSlacker/GetFailsPerPeriod',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            renderFailsOverTime(data);
        },
        fail: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });
}


//#region helpers

function renderRecentFails(data) {
    let htmlExpression = ""
    data.forEach((fail) => {
        htmlExpression += "<div class='col-xxl-3 col-xl-4 col-md-6 d-md-flex align-items-stretch mb-3'>";
        htmlExpression += "    <div class='card h-100 w-100 shadow' data-employeeId='" + fail.employeeId + "'>";
        htmlExpression += "        <div class='card-body d-md-flex flex-md-column'>";
        htmlExpression += "            <div class='img-fluid card-img-top mb-3'>";
        htmlExpression += "                <div class='text-center'>";
        htmlExpression += "                    <i class='fa-solid fa-user' style='font-size: 5rem;'></i>";
        htmlExpression += "                </div>";
        htmlExpression += "            </div>";
        htmlExpression += "            <h5 class='card-title'>" + fail.firstName + " " + fail.lastName + "</h5>";
        htmlExpression += "            <ul class='card-text flex-md-fill'>";
        htmlExpression += "                <li>Total Fails: " + fail.totalFails + "</li>";
        htmlExpression += "                <li>Most Recent Fail: " + fail.mostRecent + "</li>";
        htmlExpression += "                <li>Total Fails: " + (fail.failRate * 100).toFixed(2) + "%</li>";
        htmlExpression += "            </ul>";
        htmlExpression += "        </div>";
        htmlExpression += "    </div>";
        htmlExpression += "</div>";
    });

    $("#recent-fails-display").html(htmlExpression);
}

//#endregion