keys = {};
sorted_keys = [];

function generateCharts(subDataKey) {
  generateKeys(subDataKey);

  var counts = 0;
  var x_max = 1400000000;
  var count_max = 0;
  
  for (var idx in sorted_keys) {
    if (counts <= 3) {
      var key = sorted_keys[idx].key;
      var offices = keys[key];

      var title = "";
      if (
        offices.key[0] == "I" ||
        offices.key[0] == "V" ||
        offices.key[0] == "X"
      ) {
        title += "Region ";
      }

      title += offices.key;

      data_fxn(
        title,
        offices.key,
        offices.color,
        subDataKey,
        keys[key].maxValue * 1.2,
        -1
      );
      // 1400000000
      // 250000000
      //. 60000000
    } else {
      break;
      key = sorted_keys[idx].key;
      var offices = keys[key];

      var title = "";
      if (
        offices.key[0] == "I" ||
        offices.key[0] == "V" ||
        offices.key[0] == "X"
      ) {
        title += "Region ";
      }

      title += offices.key;

      data_fxn(title, offices.key, offices.color, subDataKey, 75000000, 3);
      // 1400000000
      // 250000000
      //. 60000000
    }
    counts++;
  }
}

function generateKeys(subkey) {
  keys = {};
  sorted_keys = [];
  var colorArray = generateRandomColors(20);
  var count = 0;

  for (var key in DROMIC_data.data) {
    var dataArray = DROMIC_data.data[key][subkey];
    var maxValue = 0;

    for (var idx in dataArray) {
      value = parseFloat(dataArray[idx].value);
      maxValue = value > maxValue ? value : maxValue;
    }

    var obj = {};
    obj = {};
    obj.key = key;
    obj.color = colorArray[count];
    obj.maxValue = maxValue;

    keys[key] = obj;
    sorted_keys.push(obj);
    count++;
  }

  sorted_keys.sort(function (a, b) {
    return parseFloat(b.maxValue) - parseFloat(a.maxValue);
  });

  console.log(sorted_keys);
}

// *****************************************************************************
// data_fxn
// *****************************************************************************

function data_fxn(title, key, color, subDataKey, y_max, range_val) {
  var data = DROMIC_data.data[key][subDataKey];

  // *****************************************************************************
  // set the dimensions and margins of the graph
  // *****************************************************************************

  var margin = {
      top: 30,
      right: 0,
      bottom: 30,
      left: 50,
    },
    width = 800 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  // *****************************************************************************
  // append the svg object to the body of the page
  // *****************************************************************************
  var svg = {};
  svg = d3
    .select("#div_template")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // *****************************************************************************
  // add background
  // *****************************************************************************

  svg
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "white");

  // *****************************************************************************
  // add X axis
  // *****************************************************************************

  var x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    )
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(
      d3
        .axisBottom(x)
        .ticks(11)
        .tickFormat(function (d) {
          var date = new Date(d * 1000 + 28800000);
          month = date.getMonth() + 1;
          month = month > 10 ? month : "0" + month;

          day = date.getDate();
          day = day > 10 ? day : "0" + day;

          return month + "/" + day;
        })
    );

  // *****************************************************************************
  // Add Y axis
  // *****************************************************************************

  var y = d3.scaleLinear().domain([0, y_max]).range([height, 0]);
  svg.append("g").call(
    d3
      .axisLeft(y)
      .ticks(5)
      .tickFormat((d) =>
        d >= 1000000000 ? d / 1000000000 + "B" : d / 1000000 + "M"
      )
  );

  // *****************************************************************************
  // Add titles
  // *****************************************************************************

  // keys[key].color

  var titleColor = "#ff0000";

  svg
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .style("fill", function (d) {
      return "#000000";
    })
    .style("padding", "4px")
    .style("border", "1px")
    .style("border-color", titleColor)
    .style("border-radius", "5px")
    .style("font-weight", "bold")
    .style("background", Hex2rgba(titleColor, 30))
    .text(function (d) {
      return "[ " + title + " ] - " + DROMIC_data.data_header[subDataKey];
    });

  for (var idx in sorted_keys) {
    var cnt = 0;
    var tooltip = d3
      .select("#div_template")
      .append("div")
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("z-index", "10")
      .style("background", Hex2rgba(keys[key].color, 90))
      .style("position", "absolute")
      .style("visibility", "hidden");

    var item = sorted_keys[idx].key;
    var subkey = keys[item].key;
    var subcolor = keys[item].color;
    var subAlpha = 0.8;
    if (cnt > range_val && key != subkey) {
      makeLines(subkey, subcolor, subAlpha);
      cnt++;
    }
  }

  var subkey = key;
  var subcolor = keys[key].color;
  var subAlpha = 0.8;
  makeLines(subkey, subcolor, subAlpha);

  //done multiline loop

  // *****************************************************************************
  // LOCAL SUB FUNCTIONS
  // *****************************************************************************

  function makeLines() {
    // *****************************************************************************
    // initialize values
    // *****************************************************************************

    // *****************************************************************************
    // add multilines
    // *****************************************************************************

    if (subkey == key) {
      // subcolor = "#000000"
      subAlpha = 100;
    }

    // *****************************************************************************
    // add lines
    // *****************************************************************************
    svg
      .selectAll("myLines")
      .data(DROMIC_data.data[subkey][subDataKey])
      .enter()
      .append("path")
      .datum(DROMIC_data.data[subkey][subDataKey])
      .attr("fill", "none")
      .attr("stroke", Hex2rgba(subcolor, subAlpha))
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.value);
          })
      );

    // *****************************************************************************
    // add points
    // *****************************************************************************
    var point = svg
      .selectAll("myCircles")
      .data(DROMIC_data.data[subkey][subDataKey])
      .enter()
      .append("circle")
      .attr("fill", Hex2rgba(subcolor, subAlpha))
      .attr("stroke", "none")
      .attr("cx", function (d) {
        return x(d.date);
      })
      .attr("cy", function (d) {
        return y(d.value);
      })
      .attr("r", 3.5);

    // *****************************************************************************
    // TOOLTIP functions
    // *****************************************************************************

    function tooltip_text(d) {
      var br = "<br>";
      var str = "";
      var value = parseFloat(d.value);
      value = formatMoney(value, "₱");

      str += value + br;
      str += "DROMIC Sitrep # " + d.report_num + br;
      var date = new Date(d.date * 1000);
      str +=
        date.getFullYear() +
        "/" +
        date.getMonth() +
        "/" +
        date.getDate() +
        " " +
        date.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

      return str;
    }

    function tooltip_modify(d, tooltip, subcolor) {
      tooltip
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("z-index", "10")
        .style("position", "absolute")
        .style("visibility", "visible");
      return tooltip;
    }

    // *****************************************************************************
    // handle points mouse events
    // *****************************************************************************
    if (subkey == key) {
      var mouseover = function (d) {
        tooltip_modify(d, tooltip, subcolor);
        d3.select(this).style("stroke", "black");
      };
      var mousemove = function (d) {
        tooltip.html(tooltip_text(d));
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
        return tooltip;
      };
      var mouseleave = function (d) {
        tooltip.style("visibility", "hidden");
        d3.select(this).style("stroke", "none");
      };

      point
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    } // done key = subkey
  } // end range limiting

  // end local functions
}

function Hex2rgba(hex, opacity = 100) {
  hex = hex.replace("#", "");
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);

  result = "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
  return result;
}

function formatMoney(value, sym0, sym1 = ",", sym2 = ".") {
  var valueFloat = parseFloat(value);
  var valueFloat = valueFloat.toFixed(2);
  var valueString = valueFloat.toString();

  var valueArray = valueString.split(".");

  var intString = valueArray[0];
  var decString = valueArray[1];

  var str = sym0;
  for (var i = 0; i < intString.length; i++) {
    var len = intString.length;
    var idx = len - 1 - i;

    var char = intString[i];
    str += char;
    if (idx % 3 == 0 && idx != 0) {
      str += sym1;
    }
  }

  str += sym2 + decString;

  return str;
}

function textWithLineBreaks(d, str, x, y) {
  var el = d3.select(this);

  var words = d.split("\n");
  el.text("");

  for (var i = 0; i < words.length; i++) {
    var tspan = el.append("tspan").text(words[i]);
    if (i > 0) tspan.attr("x", 0).attr("dy", "15");
  }

  return el;
}
