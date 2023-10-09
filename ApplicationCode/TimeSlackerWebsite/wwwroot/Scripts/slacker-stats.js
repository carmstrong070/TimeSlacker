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
            let htmlExpression = "";
            data.forEach((fail) => {
                htmlExpression += renderRecentFail(fail);
            });
            $("#recent-fails-container").html(htmlExpression);
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
            $("#recentStartDate").html(data.recentStartDate);
            $("#recentEndDate").html(data.recentEndDate);
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

function renderRecentFail(fail) {
    let html = "";

    html += "<div class='col-xxl-3 col-xl-4 col-md-6 d-md-flex align-items-stretch mb-3'>";
    html += "    <div class='card h-100 w-100 shadow' data-employeeId='" + fail.employeeId + "'>";
    html += "        <div class='card-body d-md-flex flex-md-column'>";
    html += "            <div class='img-fluid card-img-top mb-3'>";
    html += "                <div class='text-center'>";
    html += "                    <i class='fa-solid fa-user' style='font-size: 5rem;'></i>";
    html += "                </div>";
    html += "            </div>";
    html += "            <h5 class='card-title'>" + fail.firstName + " " + fail.lastName + "</h5>";
    html += "            <ul class='card-text flex-md-fill'>";
    html += "                <li>Total Fails: " + fail.totalFails + "</li>";
    html += "                <li>Most Recent Fail: " + fail.mostRecent + "</li>";
    html += "                <li>Total Fails: " + (fail.failRate * 100).toFixed(2) + "%</li>";
    html += "            </ul>";
    html += "        </div>";
    html += "    </div>";
    html += "</div>";

    return html;
}

//#endregion