function getRecentFails() {
    $.ajax({
        url: 'https://localhost:7244/api/TimeSlacker/GetRecentFails',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            let htmlExpression = "";
            data.forEach((fail) => {
                htmlExpression += "<li>" + fail + "</li>"
            });
            $("#ulFailsList").html(htmlExpression);
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