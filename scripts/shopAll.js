// Define URL
const shopAll =
  "https://shop.join-eby.com/collections/seamless-underwear/products.json?limit=200";
const bralettes =
  "https://shop.join-eby.com/collections/bralettes-for-women/products.json?limit=200";
const panties =
  "https://shop.join-eby.com/collections/seamless-panties/products.json?limit=200";
const newArrivals =
  "https://shop.join-eby.com/collections/new-arrivals/products.json?limit=200";

callShopityApi(shopAll, "#seamless-underwear");
callShopityApi(bralettes, "#bralettes-for-women");
callShopityApi(panties, "#seamless-panties");
callShopityApi(newArrivals, "#new-arrivals");

function callShopityApi(url, div) {
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
      draw(cleanedProducts, div);
    })
    .catch((error) => console.error("Error:", error));
}

function draw(products, divId) {
  // Define SVG dimensions and margins
  let margin = { top: 10, right: 30, bottom: 200, left: 250 },
    width = 1440 - margin.left - margin.right,
    height = 2500 - margin.top - margin.bottom;

  const tagFilters = ["rebuyMatchColor", "lightningDeal", "julyfourthsale2023"];
  // Define scales

  const allTagsArr = Array.from(
    new Set(products.flatMap((product) => product.tags))
  ).sort();

  const filterTags = allTagsArr.filter((tags) => {
    return tagFilters.some((d) => {
      return tags.includes(d);
    });
  });
  let x = d3.scalePoint().range([0, width]).domain(filterTags).padding(0.5);

  let y = d3
    .scalePoint()
    .range([height, 0])
    .domain(products.map((product) => product.title))
    .padding(1.5);

  // Append SVG container
  let svg = d3
    .select(divId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 20) // Y position of text, change to fit your needs
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text(divId);
  // Add X axis
  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "12px"); // set font size

  // Add Y axis
  // Add Y axis
  svg
    .append("g")
    .call(d3.axisLeft(y).tickSize(-width).tickPadding(10))
    .selectAll("line")
    .style("stroke", "gray") // Set gridline color
    .style("font-size", "12px");


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
        x: tag,
        y: product.title,
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
    .attr("r", 8)
    .style("fill", (d) => {
      if (d.x.includes("rebuyMatchColor")) {
        const newColor = d.y.split("-")[1];

        return "green"; //myColor(newColor);
      }
      if (d.x.includes("lightningDeal")) {
        // console.log(d.x)
        return "red";
      }
      if (d.x.includes("julyfourthsale2023")) {
        productsDeal.push(d.y);
        return "red";
      }
    })
    .on("mouseover", function (event, d) {
      console.log(d);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html("Product: " + d.y + "</br>" + "</br>" + "Tag:" + d.x)
        .style("left", d3.pointer(event, svg.node())[0] + 5 + "px")
        .style("top", d3.pointer(event, svg.node())[1] - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  console.log("--------------- products on summer sale -----------------");
  console.log(JSON.stringify(productsDeal));
}
