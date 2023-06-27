// Define URL
const url =
  "https://shop.join-eby.com/collections/seamless-underwear/products.json?limit=200";

// Fetch data
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // Extract products array from data
    let products = data.products;

    // Clean products
    let cleanedProducts = products.map((product) => {
      return {
        title: product.title,
        handle: product.handle,
        product_type: product.product_type,
        tags: product.tags,
      };
    });

    // Log cleaned products
    console.log(cleanedProducts);
    draw(cleanedProducts);
  })
  .catch((error) => console.error("Error:", error));

function draw(products) {
  // Define SVG dimensions and margins
  let margin = { top: 10, right: 30, bottom: 200, left: 100 },
    width = 1000 - margin.left - margin.right,
    height = 2500 - margin.top - margin.bottom;

  // Define scales
  let x = d3
    .scalePoint()
    .range([0, width])
    .domain(products.map((product) => product.title))
    .padding(0.5);

  let y = d3
    .scalePoint()
    .range([height, 0])
    .domain(
      Array.from(new Set(products.flatMap((product) => product.tags)))
      .sort()
    )
    .padding(1.5);

  // Append SVG container
  let svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "6px"); // set font size

  // Add Y axis
  // Add Y axis
  svg
    .append("g")
    .call(d3.axisLeft(y).tickSize(-width).tickPadding(10))
    .selectAll("line")
    .style("stroke", "gray"); // Set gridline color

  svg.selectAll("text").style("font-size", "6px"); // set font size

  // Extend Y axis

  // Define data points
  let dataPoints = [];
  let colorGroup = new Set();

  products.forEach((product, i) => {
    product.tags.forEach((tag) => {
      if (tag.includes("rebuyMatchColor") && !colorGroup.has(tag)) {
        colorGroup.add(tag);
      }
      dataPoints.push({
        x: product.title,
        y: tag,
      });
    });
  });

  let colors = {
    black: "#000000",
    woodsmoke: "#123456",
    mint: "#abcdef",
    kiki: "#654321",
    skyway: "#fedcba",
    reptile_stripe: "#abcdef",
    nude: "#123456",
    sunkissed: "#abcdef",
    castle_wall: "#123456",
    raindrop: "#abcdef",
    fallen_rock: "#123456",
    blue_opal: "#abcdef",
    rose_dust: "#123456",
    castor_grey: "#abcdef",
    peach_bloom: "#123456",
    caribbean_sea: "#abcdef",
    white: "#ffffff",
  };

  const myColor = d3
    .scaleOrdinal()
    .domain([...colorGroup])
    .range(Object.values(colors));
  console.log(colorGroup);

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  let productsDeal = [];
  // Draw points
  svg
    .append("g")
    .selectAll("dot")
    .data(dataPoints)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.x);
    })
    .attr("cy", function (d) {
      return y(d.y);
    })
    .attr("r", 4)
    .style("fill", (d) => {
      if (d.y.includes("rebuyMatchColor")) {
        const newColor = d.y.split("-")[1];

        return "green" //myColor(newColor);
      }
      if (d.y.includes("lightningDeal")) {
        // console.log(d.x)
        return "red";
      }
      if (d.y.includes("julyfourthsale2023")) {
        productsDeal.push(d.x);
        return "red";
      }
    })
    .on("mouseover", function (event, d) {
      console.log(d)
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html("Product: " + d.x + "</br>" + "Tag:" + d.y)
        .style("left", d3.pointer(event, svg.node())[0] + 5 + "px")
        .style("top", d3.pointer(event, svg.node())[1] - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });

    console.log('--------------- products on summer sale -----------------');
    console.log(JSON.stringify(productsDeal))
}
