const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
fetch(dataUrl)
  .then(response => response.json())
  .then(json => {
    const dataset = json.data;
  
    const w = 800;
    const h = 600;
    const padding = 50;

    const parseDate = d3.timeParse("%Y-%m-%d");
    const xScale = d3.scaleTime()
                     .domain([d3.min(dataset, d => parseDate(d[0])), d3.max(dataset, d => parseDate(d[0]))])
                     .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, (d) => d[1])])
                     .range([h - padding, padding]);

    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);

    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(parseDate(d[0])))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", (w - 2 * padding) / dataset.length)
      .attr("height", d => (h - padding) - yScale(d[1]))
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("fill", "#4da6ff")
      .on("mouseover", function(event, d) {
        // Show tooltip
        d3.select("#tooltip")
          .style("visibility", "visible")
          .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`)
          .attr("data-date", d[0])
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
    })
      .on("mouseout", function() {
        // Hide tooltip
        d3.select("#tooltip")
          .style("visibility", "hidden");
    });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d => d3.format(",.0f")(d));

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);
  
    svg.append("text")
      .attr("id", "title")
      .attr("x", w / 2)
      .attr("y", padding / 2)
      .attr("text-anchor", "middle")
      .text("United States GDP");

  });
