function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
}

let yearStart = 2000
let yearEnd = 2021
let releaseYears = Array(yearEnd - yearStart + 1)
    .fill()
    .map(() => yearStart++)

function getRandomReleaseYear() {
    const releaseYear = releaseYears[Math.floor(Math.random() * releaseYears.length)]
    return releaseYear
}

no_img_src = "no-photo-available.jpg"

const releaseYear = 2019 // getRandomReleaseYear()

const fill = gender => gender == "Male" ? "#377eb8" : (gender == "Female" ? "#e41a1c" : "#000000")

let nav_clicked = false

function insertNavElement(element_id, element_type, content, parent, padTop = "10px") {
    let element = document.getElementById(element_id)
    if (element) { element.remove() }
    element = document.createElement(element_type)
    element.innerHTML = content
    element.id = element_id
    element.style.display = "inline-block"
    element.style.paddingLeft = "20px"
    element.style.paddingTop = padTop
    element.style.verticalAlign = "top"
    parent.appendChild(element)
    return element
}

function openNavMovie(movie_info, credits_info) {

    url_path = movie_info['poster_path']
    title = movie_info['original_title']
    overview_text = movie_info['overview']

    options = { size: 'w300', file: url_path }
    url = theMovieDb.common.getImage(options)

    sidebar = document.getElementById("infoSidebar")
    sidebar.innerHTML += '<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>'
    poster = document.getElementById('poster');

    if (poster) { poster.remove() }


    // insert poster
    const link = document.createElement("img")
    console.log(url)
    if (url != null) {
        link.src = url
    }
    else {
        link.src = no_img_src
    }
    link.id = "poster"
    link.style.height = "375px"
    link.style.width = "250px"
    link.style.paddingLeft = "20px"
    link.style.display = "inline-block"
    sidebar.appendChild(link)

    // insert summary div
    let summary_wrapper = document.getElementById('summary_wrapper')
    if (summary_wrapper) { summary_wrapper.remove() }
    summary_wrapper = document.createElement("div")
    summary_wrapper.id = "summary_wrapper"
    summary_wrapper.style.display = "inline-block"
    summary_wrapper.style.paddingLeft = "20px"
    summary_wrapper.style.width = "70%"
    summary_wrapper.style.verticalAlign = "top"
    sidebar.appendChild(summary_wrapper)

    // insert title
    insertNavElement('header', 'h2', title, summary_wrapper)

    // insert overview
    insertNavElement('overview', 'p', overview_text, summary_wrapper)

    director_name = credits_info['crew'].filter(d => d.job == 'Director')[0].name
    insertNavElement('director', 'p', "Director: " + director_name, summary_wrapper)

    summary_wrapper.appendChild(document.createElement("br"))

    leading_star_name = credits_info['cast'][0].name
    element = insertNavElement('star', 'p', "Main star: " + leading_star_name, summary_wrapper, "0px")

    sidebar.style.width = "60%";
    sidebar.style.height = "430px";
    sidebar.style.right = "";
    sidebar.style.left = "-5px";
    link.style.paddingLeft = "25px"
    sidebar.style.top = "0"
}

function openNavActor(actor_info) {

    console.log(actor_info)
    url_path = actor_info['profile_path']

    if (url_path == null) {
        url = 'no-photo-available.jpg'
    }
    else {
        options = { size: 'w300', file: url_path }
        url = theMovieDb.common.getImage(options)
    }

    sidebar = document.getElementById("infoSidebar")
    sidebar.innerHTML += '<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>'
    poster = document.getElementById('poster');

    if (poster) { poster.remove() }


    // insert photo
    const link = document.createElement("img")
    console.log(url)
    if (url != null) {
        link.src = url
    }
    else {
        link.src = no_img_src
    }
    link.id = "poster"
    link.style.height = "375px"
    link.style.width = "250px"
    link.style.paddingLeft = "20px"
    link.style.display = "inline-block"
    sidebar.appendChild(link)

    // insert summary div
    let summary_wrapper = document.getElementById('summary_wrapper')
    if (summary_wrapper) { summary_wrapper.remove() }
    summary_wrapper = document.createElement("div")
    summary_wrapper.id = "summary_wrapper"
    summary_wrapper.style.display = "inline-block"
    summary_wrapper.style.paddingLeft = "20px"
    summary_wrapper.style.width = "50%"
    summary_wrapper.style.verticalAlign = "top"
    sidebar.appendChild(summary_wrapper)

    genders = ["Male", "Female"]

    // insert name
    insertNavElement('header', 'h2', actor_info['name'], summary_wrapper)
    summary_wrapper.appendChild(document.createElement("br"))

    // insert birthday
    insertNavElement('birthday', 'p', "Birthday: " + actor_info['birthday'], summary_wrapper)
    summary_wrapper.appendChild(document.createElement("br"))

    // insert birthplace
    insertNavElement('birthplace', 'p', "Place of birth: " + actor_info['place_of_birth'], summary_wrapper, "0px")
    summary_wrapper.appendChild(document.createElement("br"))

    // insert gender
    insertNavElement('gender', 'p', "Gender: " + genders[actor_info['gender']], summary_wrapper, "0px")
    summary_wrapper.appendChild(document.createElement("br"))

    // insert biography
    insertNavElement('popularity', 'p', "Popularity: " + actor_info['popularity'], summary_wrapper, "0px")

    sidebar.style.width = "40%";
    sidebar.style.height = "430px";
    sidebar.style.left = "";
    sidebar.style.right = "0";
    sidebar.style.top = "0";
}


function listNav(ids, left, down, genre, gender) {
    sidebar = document.getElementById("infoSidebar")
    sidebar.innerHTML += '<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>'
    posters = document.getElementsByClassName('poster');
    console.log(posters)
    if (posters.length > 0) {
        for (var i = posters.length - 1; i >= 0; --i) {
            posters[i].remove();
        }
    }

    const header = document.createElement("h1")
    header.innerText = "Top " + genre + " movies with " + gender + " stars"
    header.style.textAlign = "center"
    header.style.paddingRight = "30px"
    sidebar.appendChild(header)

    const wrapper = document.createElement("div")
    wrapper.style.paddingLeft = "30px"
    sidebar.appendChild(wrapper)
    ids = ids.slice(0, 5)
    ids.forEach(element => {
        theMovieDb.movies.getById({ 'id': element },
            (r) => {
                file = JSON.parse(r)['poster_path']
                if (file != null) {
                    options = { size: 'w300', file: file }
                    url = theMovieDb.common.getImage(options)
                }
                else {
                    url = no_img_src
                }

                const link = document.createElement("img")
                link.src = url
                link.style.display = "inline-block"
                link.className = "poster"

                link.style.height = "300px"
                link.style.width = "200px"
                wrapper.appendChild(link)
                link.style.paddingRight = "10px"

            },
            () => { console.log("f") })
    });
    sidebar.style.paddingLeft = "25px"
    if (left) {
        sidebar.style.width = "40%";
        sidebar.style.height = "430px";
        sidebar.style.left = "";
        sidebar.style.right = "0";
    }
    else {
        sidebar.style.width = "60%";
        sidebar.style.height = "430px";
        sidebar.style.right = "";
        sidebar.style.left = "-5px";
    }
    if (down) {
        sidebar.style.top = "435px"
    }
    // sidebar.style.transition = "0.5s"
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("infoSidebar").style.width = "0";
    document.getElementById("infoSidebar").innerHTML = ""
    document.getElementById("infoSidebar").style.paddingLeft = "0";
}

function scatter_click(d) {
    theMovieDb.movies.getById(d,
        (r1) => {
            movie_info = JSON.parse(r1)
            theMovieDb.movies.getCredits(d,
                (r2) => {
                    credits_info = JSON.parse(r2)
                    openNavMovie(movie_info, credits_info)
                },
                () => { console.log("f") })
            console.log(movie_info)
        },
        () => { console.log("f") })
}

function network_click(d) {
    console.log(d)
    theMovieDb.people.getById({ 'id': d.tmdbId },
        (r) => {
            actor_info = JSON.parse(r)
            openNavActor(actor_info)
        },
        () => { console.log("f") })
}

function getOffset(element) {
    var bound = element.getBoundingClientRect();
    var html = document.documentElement;

    return {
        top: bound.top + window.pageYOffset - html.clientTop,
        left: bound.left + window.pageXOffset - html.clientLeft
    };
}



class ScatterPlot {

    constructor(figure_element_id, dataset) {
        this.dataset = dataset
        this.year = document.getElementById("range").value
        this.datasetYear = this.dataset[this.year]
        this.figure_element_id = figure_element_id;
        this.svg = d3.select('#' + figure_element_id + ' svg');

        this.xAccessor = d => d.budget
        this.yAccessor = d => d.revenue
        this.rAccessor = d => d.popularity
        this.cAccessor = d => d.genderLead

        const svg_width = Number(this.svg.style("width").slice(0, -2))
        const svg_height = Number(this.svg.style("height").slice(0, -2))

        this.dimensions = {
            width: svg_width,
            height: svg_height,
            margin: {
                top: 0.02 * svg_height,
                right: 0.02 * svg_width,
                bottom: 0.1 * svg_height,
                left: 0.07 * svg_width,
            },
        }

        this.dimensions.boundedWidth = this.dimensions.width - this.dimensions.margin.left
            - this.dimensions.margin.right
        this.dimensions.boundedHeight = this.dimensions.height - this.dimensions.margin.top
            - this.dimensions.margin.bottom

        this.bounds = this.svg
            .append("g")
            .style("transform", `translate(${
                this.dimensions.margin.left
                }px, ${
                this.dimensions.margin.top
                }px)`)
            .style("width", "100%")
            .style("height", "100%")

        this.brush = d3.brush().extent([[0, 0], [this.dimensions.boundedWidth, this.dimensions.boundedHeight]]).on("end", this.brushended.bind(this))
        this.idleDelay = 350;
        this.idleTimeout = null;

        this.bounds.append("g")
            .attr("class", "brush")
            .call(this.brush);

        this.xScale = d3.scaleLinear()
            .domain(d3.extent(this.datasetYear, this.xAccessor))
            .range([0, this.dimensions.boundedWidth])
            .nice()
        this.yScale = d3.scaleLinear()
            .domain(d3.extent(this.datasetYear, this.yAccessor))
            .range([this.dimensions.boundedHeight, 0])
            .nice()
        this.rScale = d3.scaleLinear()
            .domain(d3.extent(this.datasetYear, this.rAccessor))
            .range([1, 10])

        this.yAxisGenerator = d3.axisLeft()
            .scale(this.yScale)
            .tickFormat(x => x / Math.pow(10, 6))
        this.yAxis = this.bounds.append("g")
            .call(this.yAxisGenerator)
        this.yAxisLabel = this.yAxis.append("text")
            .attr("x", -this.dimensions.boundedHeight * 0.5)
            .attr("y", -this.dimensions.margin.left + 20)
            .attr("fill", "black")
            .style("font-size", "1.4em")
            .style("transform", "rotate(-90deg)")
            .style("text-anchor", "middle")
            .text("Revenue (in million $)")

        this.xAxisGenerator = d3.axisBottom()
            .scale(this.xScale)
            .tickFormat(x => x / Math.pow(10, 6))
        this.xAxis = this.bounds.append("g")
            .call(this.xAxisGenerator)
            .style("transform", `translateY(${
                this.dimensions.boundedHeight
                }px)`)
        this.xAxisLabel = this.xAxis.append("text")
            .attr("x", this.dimensions.boundedWidth * 0.5)
            .attr("y", this.dimensions.margin.bottom - 10)
            .attr("fill", "black")
            .style("font-size", "1.4em")
            .text("Budget (in million $)")

        this.update()
    }

    update() {
        const t = d3.transition().duration(2000)

        this.datasetYear = this.dataset[this.year]

        this.xScale.domain(d3.extent(this.datasetYear, this.xAccessor)).nice()
        this.yScale.domain(d3.extent(this.datasetYear, this.yAccessor)).nice()
        this.rScale.domain(d3.extent(this.datasetYear, this.rAccessor))

        this.xAxis.transition(t).call(this.xAxisGenerator)
        this.yAxis.transition(t).call(this.yAxisGenerator)

        const scatter = this

        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const dots = this.bounds.selectAll("circle")
            .data(this.datasetYear)
        dots.exit()
            .transition(t)
            .attr("r", 0)
            .remove()
        dots
            .transition(t)
            .attr("cx", d => this.xScale(this.xAccessor(d)))
            .attr("cy", d => this.yScale(this.yAccessor(d)))
            .attr("r", d => this.rScale(this.rAccessor(d)))
            .attr("fill", d => fill(this.cAccessor(d)))
        dots.enter()
            .append("circle")
            .on("click", function (d) { scatter_click(d) })
            .on('mouseover', function (d) {
                let cx = parseInt(d3.select(this).attr("cx"))
                let cy = parseInt(d3.select(this).attr("cy"))
                let r = parseInt(d3.select(this).attr("r"))
                let new_cx = cx + 80
                let new_cy = cy - r - 25
                if (new_cy < 0) {
                    new_cy = cy + r + 30
                }
                scatter.bounds.selectAll("circle")
                    .transition()
                    .style("opacity", 0.3);
                d3.select(this).transition()
                    .duration('50')
                    .attr("r", scatter.rScale(scatter.rAccessor(d) * 1.8))
                    .style('cursor', 'pointer')
                    .style("opacity", 1);
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.originalTitle)
                    .style("left", new_cx + "px")
                    .style("top", new_cy + "px")
                    .style("white-space", "nowrap");
            })
            .on('mouseout', function (d) {
                console.log(scatter)
                scatter.bounds.selectAll("circle")
                    .transition()
                    .style("opacity", 1);

                d3.select(this).transition()
                    .duration('50')
                    .attr("r", scatter.rScale(scatter.rAccessor(d)))
                    .style('cursor', 'default')

                div.transition()
                    .duration(500)
                    .style("opacity", 0);


            })
            .attr("cx", d => this.xScale(this.xAccessor(d)))
            .attr("cy", d => this.yScale(this.yAccessor(d)))
            .attr("r", 0)
            .attr("fill", d => fill(this.cAccessor(d)))
            .transition(t)
            .attr("r", d => this.rScale(this.rAccessor(d)))
    }

    setYear(year) {
        this.year = year
        this.update()
    }

    brushended() {
        var s = d3.event.selection;
        if (!s) {
            if (!this.idleTimeout) return this.idleTimeout = setTimeout(this.idled.bind(this), this.idleDelay);
            this.xScale.domain(d3.extent(this.datasetYear, this.xAccessor)).nice()
            this.yScale.domain(d3.extent(this.datasetYear, this.yAccessor)).nice()
            this.rScale.domain(d3.extent(this.datasetYear, this.rAccessor))

            // this.xAxis.transition(t).call(this.xAxisGenerator)
            // this.yAxis.transition(t).call(this.yAxisGenerator)
        } else {

            this.xScale.domain([s[0][0], s[1][0]].map(this.xScale.invert, this.xScale));
            this.yScale.domain([s[1][1], s[0][1]].map(this.yScale.invert, this.yScale));
            this.bounds.select(".brush").call(this.brush.move, null);
        }
        this.zoom();
    }

    idled() {
        this.idleTimeout = null;
    }

    zoom() {
        const t = d3.transition().duration(2000)
        this.xAxis.transition(t).call(this.xAxisGenerator)
        this.yAxis.transition(t).call(this.yAxisGenerator)
        this.bounds.selectAll("circle").transition(t)
            .attr("cx", d => this.xScale(this.xAccessor(d)))
            .attr("cy", d => this.yScale(this.yAccessor(d)))
            .attr("r", d => {
                console.log(this.xScale(this.xAccessor(d)))
                console.log(this.dimensions.margin.left)
                console.log(this.xScale(this.xAccessor(d)) < this.dimensions.left)
                if (this.xScale(this.xAccessor(d)) < 0 || this.yScale(this.yAccessor(d)) > this.dimensions.boundedHeight) {
                    return 0
                }
                else {
                    return this.rScale(this.rAccessor(d))
                }
            })
    }
}

class BarPlot {

    constructor(figure_element_id, dataset, popularity_dataset) {
        this.category = 'genres'
        this.dataset = dataset
        this.popularity_dataset = popularity_dataset

        this.year = document.getElementById('range').value

        this.subgroups = ["Male", "Female"]

        this.figure_element_id = figure_element_id;
        this.svg = d3.select('#' + figure_element_id + ' svg');

        const svg_width = Number(this.svg.style("width").slice(0, -2))
        const svg_height = Number(this.svg.style("height").slice(0, -2))

        this.dimensions = {
            width: svg_width,
            height: svg_height,
            margin: {
                top: 0.02 * svg_height,
                right: 0.02 * svg_width,
                bottom: 0.11 * svg_height,
                left: 0.11 * svg_width,
            },
        }

        this.dimensions.boundedWidth = this.dimensions.width - this.dimensions.margin.left
            - this.dimensions.margin.right
        this.dimensions.boundedHeight = this.dimensions.height - this.dimensions.margin.top
            - this.dimensions.margin.bottom

        this.bounds = this.svg
            .append("g")
            .style("transform", `translate(${
                this.dimensions.margin.left
                }px, ${
                this.dimensions.margin.top
                }px)`)
            .style("width", "100%")
            .style("height", "100%")
        this.update()
    }

    update() {
        const t = d3.transition().duration(2000)

        this.selectedDataset = this.dataset[this.category][this.year]
        this.transformedData = Object.entries(this.selectedDataset).map(
            function (x) {
                return { "group": x[0], "Male": x[1]["Male"], "Female": x[1]["Female"] }
            })
        this.groups = Object.keys(this.selectedDataset).sort()

        const yScale = d3.scaleBand()
            .domain(this.groups)
            .range([0, this.dimensions.boundedHeight])
            .padding([0.3])

        if (this.yAxis) {
            this.yAxis.remove()
        }
        if (this.xAxis) {
            this.xAxis.remove()
        }
        this.yAxis = this.bounds.append("g").call(d3.axisLeft(yScale).tickSizeOuter(0))


        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, this.dimensions.boundedWidth]);

        this.xAxis = this.bounds.append("g")
            .style("transform", `translateY(${
                this.dimensions.boundedHeight
                }px)`).call(d3.axisBottom(xScale))

        this.yAxisLabel = this.yAxis.append("text")
            .attr("x", -this.dimensions.boundedHeight * 0.5)
            .attr("y", -this.dimensions.margin.left + 20)
            .attr("fill", "black")
            .style("font-size", "1.4em")
            .style("transform", "rotate(-90deg)")
            .style("text-anchor", "middle")
            .text(this.category)



        this.xAxisLabel = this.xAxis.append("text")
            .attr("x", this.dimensions.boundedWidth * 0.5)
            .attr("y", this.dimensions.margin.bottom - 10)
            .attr("fill", "black")
            .style("font-size", "1.4em")
            .text("Percent")


        this.stackedData = d3.stack().keys(this.subgroups)(this.transformedData)

        this.bounds.selectAll(".bars").selectAll("rect").remove().exit()
        this.bounds.selectAll(".bars").selectAll("g").remove().exit()

        this.rects = this.bounds.append("g")
            .attr("class", "bars")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(this.stackedData)
            .enter().append("g")
            .attr("fill", function (d) { return fill(d.key); })
            .selectAll("rect")

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // enter a second time = loop subgroup per subgroup to add all rectangles
        this.rects.data(function (d) { return d; })
            .enter()
            .append("rect")
            .on("click", d => this.onClick(this, d))
            .attr("y", function (d) { return yScale(d.data.group); })
            .attr("x", function (d) { if (d[0] == 0) { return xScale(d[0]); } else return xScale(d[1]); })
            .attr("width", function (d) { return 0; })
            .attr("height", yScale.bandwidth())
            .on('mouseover', function (d) {
                d3.selectAll(".bars rect")
                    .transition()
                    .style("opacity", 0.3);
                d3.select(this)
                    .transition()
                    .style("opacity", 1)
                    .style('cursor', 'pointer');
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(Math.round(Math.abs(d[0] - d[1]) * 10) / 10)
                    .style("left", d3.event.pageX + "px")
                    .style("top", (d3.event.pageY-40) + "px")
                    .style("white-space", "nowrap");
            })
            .on('mousemove', function (d) {
                div.html(Math.round(Math.abs(d[0] - d[1]) * 10) / 10 + "%")
                    .style("left", d3.event.pageX + "px")
                    .style("top", (d3.event.pageY-40) + "px")
                    .style("white-space", "nowrap");
            })
            .on('mouseout', function (d) {
                d3.selectAll("rect")
                    .transition()
                    .style("opacity", 1);
                d3.select(this)
                    .style('cursor', 'default');

                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })

        this.bounds.selectAll("rect")
            .transition()
            .duration(2000)
            .attr("x", function (d) { return xScale(d[0]); })
            .attr("width", function (d) { return xScale(d[1]) - xScale(d[0]); })
    }

    setYear(year) {
        this.year = year
        this.update()
    }

    setPopularityData(data) {
        this.popularity_dataset = data
    }

    onClick(object, d) {
        const selected_gender = d[0] == 0 ? 'Male' : 'Female'
        const ids = object.popularity_dataset[object.category][object.year][d.data.group][selected_gender]
        listNav(ids, false, true, d.data.group.toLowerCase(), selected_gender.toLowerCase())

    }
}

class Graph {
    constructor(figure_element_id, dataset) {
        this.dataset = dataset

        this.idAccessor = d => d.id
        this.colorAccessor = d => d.gender
        this.radiusAccessor = d => d.isDirector
        this.lineWidthAccessor = d => d.value
        this.radius = isDirector => isDirector == true ? 0 : 10

        this.figure_element_id = figure_element_id;
        this.svg = d3.select('#' + figure_element_id + ' svg');

        const svg_width = Number(this.svg.style("width").slice(0, -2))
        const svg_height = Number(this.svg.style("height").slice(0, -2))

        this.dimensions = {
            width: svg_width,
            height: svg_height,
        }
    }

    // TODO: transitions?
    update() {
        this.svg.selectAll("*").remove();

        this.endTime = Date.now() + 5000;

        this.datasetYear = this.dataset[this.year]

        this.nodes = this.datasetYear.nodes
        this.links = this.datasetYear.links

        this.wrapper = this.svg
            .call(d3.zoom().on("zoom", () => wrapper.attr("transform", d3.event.transform)))
            .append("g")
            .attr("width", this.dimensions.width)
            .attr("height", this.dimensions.height)

        this.lineWidthScale = d3.scaleLinear()
            .domain(d3.extent(this.links, this.lineWidthAccessor))
            .range([1, 10])

        this.link = this.wrapper.append("g")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.2)
            .selectAll("line")

        this.link = this.link.data(this.links)
            .enter().append("line")
            .attr("stroke-width", d => this.lineWidthScale(this.lineWidthAccessor(d)))

        this.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(d => this.idAccessor(d)).distance(0).strength(0.1))
            .force("charge", d3.forceManyBody().strength(-30))
            .force("center", d3.forceCenter(0.5 * this.dimensions.width, 0.5 * this.dimensions.height))
            .force("x", d3.forceX(0.5 * this.dimensions.width))
            .force("y", d3.forceY(0.5 * this.dimensions.height))
            .alphaTarget(1)
            .on("tick", this.ticked.bind(this))

        this.node = this.wrapper.append("g")
            .selectAll("rect")

        const graph = this
        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        this.node = this.node.data(this.nodes)
            .enter().append("rect")
            .on("click", function (d) { network_click(d) })
            .attr("x", -10).attr("y", -10)
            .attr("width", 20).attr("height", 20)
            .attr("rx", d => this.radius(this.radiusAccessor(d)) * 10)
            .attr("fill", d => fill(this.colorAccessor(d)))
            .on('mouseover', function (d) {
                let offset = getOffset(this)
                let new_cx = offset.left - 50
                let new_cy = offset.top - 35
                let person_name = d.id.split(",")[0]
                let person_profession = d.id.split(",")[1].trim()
                if (d.gender == "Female") {
                    if (person_profession == "Actor") {
                        person_profession = "Actress"
                    }
                    if (person_profession == "Director") {
                        person_profession = "Directress"
                    }

                }

                if (new_cy < 0) {
                    new_cy = new_cy + 60
                }
                graph.wrapper.selectAll("rect")
                    .transition()
                    .style("opacity", 0.3);
                graph.wrapper.selectAll("line")
                    .transition()
                    .style("stroke-opacity", 0.05);
                d3.select(this)
                    .transition()
                    .style("opacity", 1)
                    .style('cursor', 'pointer');
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(person_profession + ": " + person_name)
                    .style("left", new_cx + "px")
                    .style("top", new_cy + "px")
                    .style("white-space", "nowrap");
            })
            .on('mouseout', function (d) {
                graph.wrapper.selectAll("rect")
                    .transition()
                    .style("opacity", 1);
                d3.select(this)
                    .style('cursor', 'default');
                graph.wrapper.selectAll("line")
                    .transition()
                    .style("stroke-opacity", 0.2);
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })

        this.simulation.nodes(this.nodes)
        this.simulation.force("link").links(this.links)
    }

    ticked() {
        if (Date.now() < this.endTime) {
            const max_x = Math.max(...this.nodes.map(d => d.x))
            const min_x = Math.min(...this.nodes.map(d => d.x))
            const max_y = Math.max(...this.nodes.map(d => d.y))
            const min_y = Math.min(...this.nodes.map(d => d.y))
            this.xScale = d3.scaleLinear()
                .domain([min_x, max_x])
                .range([10, this.dimensions.width - 10]);
            this.yScale = d3.scaleLinear()
                .domain([min_y, max_y])
                .range([this.dimensions.height - 10, 10]);

            this.link.attr("x1", d => this.xScale(d.source.x))
                .attr("y1", d => this.yScale(d.source.y))
                .attr("x2", d => this.xScale(d.target.x))
                .attr("y2", d => this.yScale(d.target.y))

            this.node.attr("transform", d => `translate(${this.xScale(d.x)}, ${this.yScale(d.y)})`)
        } else {
            this.simulation.stop();
        }
    }

    setYear(year) {
        this.year = year
        this.update()
    }
}

class WordCloud {
    constructor(figure_element_id, dataset, color) {
        this.dataset = dataset
        this.tAccessor = d => d.text
        this.sAccessor = d => d.size
        this.color = color

        this.svg = d3.select("#" + figure_element_id)

        const svg_width = Number(this.svg.style("width").slice(0, -2))
        const svg_height = Number(this.svg.style("height").slice(0, -2))

        this.dimensions = {
            width: svg_width,
            height: svg_height,
        }

        this.colorScale = d3.scaleSequential(d3.interpolateRdBu)
        //.domain([0, 5])

        this.cloud = d3.layout.cloud();
    }

    update() {
        this.svg.selectAll("*").remove()
        this.datasetYear = this.dataset[this.year].slice(0, 50)

        this.fontSizeScale = d3.scaleLinear()
            .domain(d3.extent(this.datasetYear, this.sAccessor))
            .range([0, this.dimensions.height])

        this.layout = this.cloud
            .size([this.dimensions.width, this.dimensions.height])
            .words(this.datasetYear)
            .padding(5)
            .rotate(() => ~~(Math.random() * 2) * 45)
            .font('Impact')
            .fontSize(d => this.fontSizeScale(this.sAccessor(d)))
            .on('end', this.draw.bind(this))

        this.layout.start()
    }

    draw(words) {
        this.svg
            .append('g')
            .attr('transform', 'translate(' + [0.5 * this.dimensions.width, 0.5 * this.dimensions.height] + ')')
            .selectAll('text').data(words)
            .enter().append('text')
            .style('font-size', d => this.sAccessor(d) + 'px')
            .style('fill', (d, i) => this.color)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Impact')
            .attr('transform', d => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
            .text(d => this.tAccessor(d))
    }

    setYear(year) {
        this.year = year
        this.update()
    }
}



whenDocumentLoaded(() => {
    const
        range = document.getElementById('range'),
        rangeV = document.getElementById('rangeV'),
        setValue = () => {
            const
                newValue = Number((range.value - range.min) * 100 / (range.max - range.min)),
                newPosition = 10 - (newValue * 0.2);
            rangeV.innerHTML = `<span>${range.value}</span>`;
            rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
        };
    range.addEventListener('input', setValue);

    const sliderticks = document.getElementsByClassName("sliderticks")[0];

    for (let i = range.min; i <= range.max; i++) {
        const par = document.createElement("P");
        const t = document.createTextNode(i);
        par.appendChild(t);
        sliderticks.appendChild(par)
    }

    Promise.all([
        d3.json("data/gender-representation.json"),
        d3.json("data/bar-chart.json"),
        d3.json("data/collaborations.json"),
        d3.json("data/thematic-differences-male-lead.json"),
        d3.json("data/thematic-differences-female-lead.json"),
        d3.json("data/popular-movies.json")
    ]).then(function (files) {
        scatter_plot = new ScatterPlot("wrapper-gender-representation", files[0]);

        bar_plot = new BarPlot("wrapper-categories", files[1], files[5]);

        graph = new Graph("wrapper-collaborations", files[2]);

        male_cloud = new WordCloud("male-cloud", files[3], "#377eb8");

        female_cloud = new WordCloud("female-cloud", files[4], "#e41a1c");

        function update_years() {
            scatter_plot.setYear(range.value)
            bar_plot.setYear(range.value)
            graph.setYear(range.value)
            male_cloud.setYear(range.value)
            female_cloud.setYear(range.value)

        }
        range.addEventListener('input', update_years);
        update_years()

    })
});