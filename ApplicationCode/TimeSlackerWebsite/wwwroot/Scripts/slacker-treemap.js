//-- This is diabolical
var slacker_treemapAnimationCache = [];
var slacker_treemapAnimationIndex = 0;

function getTreemap() {
    //-- TODO
    //showTreemap();
}

function showTreemap() {
    let peopleAddedLater = 10;
    let animateTimeInMilliseconds = 1500;

    //-- worst guy
    let columnData = [];
    let vanessaObj = timeslackerJson.find((x) => {
        return x.FirstName === "Vanessa" //-- doesn't work here
    });
    let vanessaDataPoint = [];
    vanessaDataPoint.push(vanessaObj.FirstName + " " + vanessaObj.LastName);
    vanessaDataPoint.push(vanessaObj.TotalFailures);
    columnData.push(vanessaDataPoint);

    let chart = bb.generate({
        padding: {
            top: 10,
            bottom: 15
        },
        data: {
            columns: columnData,
            type: "treemap", // for ESM specify as: treemap()
            labels: {
                colors: "#fff"
            }
        },
        treemap: {
            label: {
                threshold: 0.03
            }
        },
        bindto: "#chart"
    });

    timeslackerJson.sort((x, y) => {
        if (x.TotalFailures > y.TotalFailures)
            return 1;
        else if (x.TotalFailures < y.TotalFailures)
            return -1;
        else
            return 0;
    });

    //-- Do Alex's animate idea
    for (let jsonIndex = 0; jsonIndex < timeslackerJson.length; jsonIndex++) {
        let currentTimeslacker = timeslackerJson[jsonIndex];

        let columnDataPoint = [];
        columnDataPoint.push(currentTimeslacker.FirstName + " " + currentTimeslacker.LastName);
        columnDataPoint.push(currentTimeslacker.TotalFailures);
        slacker_treemapAnimationCache.push(columnDataPoint)

        if (jsonIndex > peopleAddedLater)
            break;
    }

    for (let animationIndex = 0; animationIndex < slacker_treemapAnimationCache.length; animationIndex++) {
        setTimeout(
            () => {
                let newLoad = slacker_treemapAnimationCache[slacker_treemapAnimationIndex];
                chart.load({
                    columns: [ newLoad ]
                });
                slacker_treemapAnimationIndex++;
            },
            animateTimeInMilliseconds * (animationIndex + 1));
    }
}