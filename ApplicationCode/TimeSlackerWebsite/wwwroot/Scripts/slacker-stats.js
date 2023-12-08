function getTotalFails() {
    $.ajax({
        url: (slacker_rootPath + 'GetTotalFails'),
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
        url: (slacker_rootPath + 'GetRecentFails'),
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data.length > 0) {
                $("#compliance-container").hide();
                $("#recent-fails-container").show();
                renderRecentFails(data);
            }
        },
        fail: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    });
}

function getMostRecentPeriod() {
    $.ajax({
        url: (slacker_rootPath + 'GetMostRecentPeriod'),
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
        url: (slacker_rootPath + 'GetClosestCall'),
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
        url: (slacker_rootPath + 'GetFailsPerPeriod'),
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