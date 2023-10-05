
function getFailsOverTime() {
	var chart = bb.generate({
		data: {
			columns: [
				["data1", 30, 200, 100, 400, 150, 250],
				["data2", 50, 20, 10, 40, 15, 25]
			],
			type: "line", // for ESM specify as: line()
		},
		bindto: "#fails-over-time-chart"
	});
}