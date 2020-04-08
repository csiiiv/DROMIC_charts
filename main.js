var dataKeyArray = ["SF", "FFPQ", "FFPTC", "OFITC", "NFITC", "TSFS"];
var dataKey = "TSFS";
var select_obj = d3.select("#subdata_selection").on("change", onchange);

for (idx in dataKeyArray) {
  var dataKey = dataKeyArray[idx];
  var str = DROMIC_data.data_header[dataKey];
  select_obj.append("option").text(str).property("value", dataKey);
}

function onchange(d) {
  var el = document.getElementById("subdata_selection");
  var value = el.value;
  dataKey = value;
  console.log(dataKey);

  d3.selectAll("svg").remove();
  generateCharts(dataKey);
}

document.getElementById("subdata_selection").value = dataKey;
generateCharts(dataKey);
