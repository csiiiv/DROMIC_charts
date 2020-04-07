keys = {}

sorted_keys = []

main();



function main() {
  generateKeys("TSFS")

  var counts = 0
  for (var idx in sorted_keys) {
    if (counts <= 3) {

      item = sorted_keys[idx].key
      var offices = keys[item]

      var title = ""
      if (offices.key[0] == "I" ||
        offices.key[0] == "V" ||
        offices.key[0] == "X") {
        title += "Region "
      }

      title += offices.key

      data_fxn(title, offices.key, offices.color,
        "TSFS", 1400000000, -1)
      // 1400000000
      // 250000000
      //. 60000000  
    } else {
      item = sorted_keys[idx].key
      var offices = keys[item]

      var title = ""
      if (offices.key[0] == "I" ||
        offices.key[0] == "V" ||
        offices.key[0] == "X") {
        title += "Region "
      }

      title += offices.key

      data_fxn(title, offices.key, offices.color,
        "TSFS", 75000000, 3)
      // 1400000000
      // 250000000
      //. 60000000 
    }
    counts++
  }
}

function generateKeys(subkey) {
  var colorArray = generateRandomColors(20)
  var count = 0

  for (var key in DROMIC_data.data) {
    var dataArray = DROMIC_data.data[key][subkey]
    var maxValue = 0

    for (var idx in dataArray) {
      value = parseFloat(dataArray[idx].value)
      maxValue = value > maxValue ? value : maxValue
    }

    var obj = {}
    obj = {}
    obj.key = key
    obj.color = colorArray[count]
    obj.maxValue = maxValue

    keys[key] = obj
    sorted_keys.push(obj)
    count++
  }

  sorted_keys.sort(function(a, b) {
    return parseFloat(b.maxValue) - parseFloat(a.maxValue)
  });

  console.log(sorted_keys)
}

function data_fxn(title, key, color, subDataKey, y_max, range_val) {

  var data = DROMIC_data.data[key][subDataKey]

  // set the dimensions and margins of the graph
  var margin = {
      top: 30,
      right: 0,
      bottom: 30,
      left: 50
    },
    width = 800 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  // add background
  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "white");


  // add X axis
  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) {
      return d.date;
    }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      .ticks(11).tickFormat(
        function(d) {
          var date = new Date(d * 1000 + 28800000)
          month = date.getMonth() + 1
          month = month > 10 ? month : '0' + month

          day = date.getDate()
          day = day > 10 ? day : '0' + day

          return month + "/" + day
        }
      )
    );

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, y_max])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y)
      .ticks(5).tickFormat(d => d >= 1000000000 ? (d / 1000000000) + "B" : (d / 1000000) + "M")
    );

  // Add titles
  svg
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .text(function(d) {
      return (title)
    })
    .style("fill", function(d) {
      return color
    })


  // add multilines
  var cnt = 0
  for (var idx in sorted_keys) {
    var item = sorted_keys[idx].key
    if (cnt > range_val) {

      var subkey = keys[item].key
      var subcolor = keys[item].color
      var subAlpha = 0.8

      if (subkey == key) {
        // subcolor = "#000000"
        subAlpha = 100
      }

      // add lines
      svg.selectAll("myLines")
        .data(DROMIC_data.data[subkey][subDataKey])
        .enter()
        .append("path")
        .datum(DROMIC_data.data[subkey][subDataKey])
        .attr("fill", "none")
        .attr("stroke", Hex2rgba(subcolor, subAlpha))
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(function(d) {
            return x(d.date)
          })
          .y(function(d) {
            return y(d.value)
          })
        )

      // add points
      svg.selectAll("myCircles")
        .data(DROMIC_data.data[subkey][subDataKey])
        .enter()
        .append("circle")
        .attr("fill", Hex2rgba(subcolor, subAlpha))
        .attr("stroke", "none")
        .attr("cx", function(d) {
          return x(d.date)
        })
        .attr("cy", function(d) {
          return y(d.value)
        })
        .attr("r", 3.5)
    }
    cnt++
  }

}


function Hex2rgba(hex, opacity = 100) {
  hex = hex.replace('#', '');
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);

  result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  return result;
}