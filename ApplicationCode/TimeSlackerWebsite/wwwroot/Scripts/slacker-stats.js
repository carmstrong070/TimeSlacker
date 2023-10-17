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
                $("#recent-fails-container").removeClass("bg-dot-grid");
                $("#recent-fails-container").css("background-color", "saddlebrown");
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