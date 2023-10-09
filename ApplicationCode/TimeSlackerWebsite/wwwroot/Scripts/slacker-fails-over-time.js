
function renderFailsOverTime(data) {
    let fails = [];
    let rollingAvg = [];
    let dates = [];

    data.forEach((period) => {
        fails.push(period.totalFails);
        rollingAvg.push(period.rollingAverage);
        dates.push(period.endDate);
    });

    var chart = bb.generate({
        data: {
            x: "x",
            json: {
                Fails: fails,
                "Rolling Average": rollingAvg,
                x: dates
            },
            type: "line"
        },
        axis: {
            x: {
                tick: {
                    fit: false,
                    count: 10,
                    format: "%b %Y"
                },
                type: "timeseries"
            }
        },
        zoom: {
            enabled: true, // for ESM specify as: zoom()
            type: "drag"
        },
        tooltip: {
            format: {
                title: function (x) {
                    return d3.timeFormat("%Y-%m-%d")(x);
                }
            }
        },
        point: {
            focus: {
                only: true
            }
        },
        bindto: "#fails-over-time-chart"
    });
}