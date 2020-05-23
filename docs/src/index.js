function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
}

let selected_name = ""
let selected_movie = null
let selected_poster = null

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        selected_name = ""
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        const max_show = 15
        let shown = 0
        input_field = this
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            //   if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() && shown < max_show) {
            if (arr[i].toUpperCase().includes(val.toUpperCase()) && shown < max_show) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                indexOfSubstring = arr[i].toUpperCase().indexOf(val.toUpperCase())
                console.log(arr[i])
                console.log(arr[i].substr(0, indexOfSubstring))
                console.log(arr[i].substr(indexOfSubstring, val.length))
                console.log(arr[i].substr(indexOfSubstring + val.length))
                b.innerHTML = arr[i].substr(0, indexOfSubstring);
                b.innerHTML += "<strong>" + arr[i].substr(indexOfSubstring, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(indexOfSubstring + val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    selected_name = inp.value
                    console.log(inp.value.length)
                    input_field.style.width = Math.max(inp.value.length, 20) + "ch"
                    input_field.blur()
                    graph.update()
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
                shown++;
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
                selected_name = currentFocus
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    inp.addEventListener("focus", function (e) {
        this.value = ""
        selected_name = ""
        graph.update()
    })
}

let yearStart = 1990
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

function insertNavElement(element_id, element_type, content, parent, padTop = "30px") {
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

function openNavMovie(movie_info, credits_info, video_info) {

    url_path = movie_info['poster_path']
    title = movie_info['original_title']
    overview_text = movie_info['overview']

    options = { size: 'w300', file: url_path }
    url = theMovieDb.common.getImage(options)

    sidebar = document.getElementById("scatterPopup")
    sidebar.innerHTML += '<a href="javascript:void(0)" class="closebtn" onclick="closeNavMovie()">&times;</a>'
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
    link.style.paddingTop = "20px"
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
    insertNavElement('header', 'h3', title, summary_wrapper)

    // insert overview
    if (overview_text.length > 620) {
        overview_text = overview_text.slice(0, 620) + "..."
    }
    el = insertNavElement('overview', 'p', overview_text, summary_wrapper, "5px")
    el.style.paddingRight = "20px"
    el.style.textAlign = "justify"

    director_name = credits_info['crew'].filter(d => d.job == 'Director')[0].name
    el = insertNavElement('director', 'p', "<b>Director:</b> " + director_name, summary_wrapper, "10px")

    el.addEventListener("click", function(elem) {
        selected_name = director_name
        inp = document.getElementById("myInput");
        inp.value = director_name
        inp.style.width = Math.max(inp.value.length, 20) + "ch"
        inp.blur()
        graph.update()
    })
    el.style.cursor = "pointer"



    summary_wrapper.appendChild(document.createElement("br"))

    leading_star_name = credits_info['cast'][0].name
    el = insertNavElement('star', 'p', "<b>Main star:</b> " + leading_star_name, summary_wrapper, "0px")

    el.addEventListener("click", function(elem) {
        selected_name = leading_star_name
        inp = document.getElementById("myInput");
        inp.value = leading_star_name
        inp.style.width = Math.max(inp.value.length, 20) + "ch"
        inp.blur()
        graph.update()
    })

    el.style.cursor = "pointer"

    // insert trailer
    let video_trailer = document.getElementById('video_trailer')
    if (video_trailer) { video_trailer.remove() }
    video_trailer = document.createElement("iframe")
    video_trailer.id = "video_trailer"
    video_trailer.src = "https://www.youtube.com/embed/" + video_info.results[0].key
    video_trailer.style.width = "98%"
    video_trailer.style.height = "50%"
    video_trailer.frameBorder = "0"
    video_trailer.style.paddingLeft = "25px"
    video_trailer.style.paddingTop = "15px"
    summary_wrapper.style.display = "inline-block"

    sidebar.appendChild(video_trailer)

    sidebar.style.width = "100%";
    sidebar.style.height = "100%";
    link.style.paddingLeft = "25px"
    sidebar.style.top = "0"
}

function closeNavMovie() {
    document.getElementById("scatterPopup").style.width = "0";
    document.getElementById("scatterPopup").innerHTML = ""
}

function openNavActor(actor_info) {
    url_path = actor_info['profile_path']

    if (url_path == null) {
        url = 'no-photo-available.jpg'
    }
    else {
        options = { size: 'w300', file: url_path }
        url = theMovieDb.common.getImage(options)
    }

    sidebar = document.getElementById("graphPopup")
    sidebar.innerHTML += '<a href="javascript:void(0)" class="closebtn" onclick="closeNavActor()">&times;</a>'
    poster = document.getElementById('profilePhoto');

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
    link.id = "profilePhoto"
    link.style.height = "375px"
    link.style.width = "250px"
    link.style.paddingLeft = "20px"
    link.style.paddingTop = "20px"
    link.style.display = "inline-block"
    sidebar.appendChild(link)

    // insert summary div
    let summary_wrapper = document.getElementById('summary_wrapper_actor')
    if (summary_wrapper) { summary_wrapper.remove() }
    summary_wrapper = document.createElement("div")
    summary_wrapper.id = "summary_wrapper_actor"
    summary_wrapper.style.display = "inline-block"
    summary_wrapper.style.paddingLeft = "20px"
    summary_wrapper.style.width = "50%"
    summary_wrapper.style.verticalAlign = "top"
    sidebar.appendChild(summary_wrapper)

    genders = ["Male", "Female"]

    // insert name
    insertNavElement('header_actor', 'h2', actor_info['name'] ? actor_info['name'] : '/', summary_wrapper)
    summary_wrapper.appendChild(document.createElement("br"))

    // insert birthday
    insertNavElement('birthday', 'p', "<b>Birthday:</b> " + (actor_info['birthday'] ? actor_info['birthday'] : '/'), summary_wrapper)
    summary_wrapper.appendChild(document.createElement("br"))

    // insert birthplace
    insertNavElement('birthplace', 'p', "<b>Place of birth:</b> " + (actor_info['place_of_birth'] ? actor_info['place_of_birth'] : '/'), summary_wrapper, "0px")
    summary_wrapper.appendChild(document.createElement("br"))

    // insert gender
    insertNavElement('gender', 'p', "<b>Gender:</b> " + (genders[actor_info['gender']] ? genders[actor_info['gender']] : '/'), summary_wrapper, "0px")
    summary_wrapper.appendChild(document.createElement("br"))

    // insert biography
    insertNavElement('popularity', 'p', "<b>Popularity:</b> " + (actor_info['popularity'] ? actor_info['popularity'] : '/'), summary_wrapper, "0px")

    sidebar.style.width = "100%";
    sidebar.style.height = "100%";
    link.style.paddingLeft = "25px";
    sidebar.style.top = "0"
    sidebar.style.left = "";
    sidebar.style.right = "0";
}


function listNav(ids, genre, gender, role) {
    sidebar = document.getElementById("barPopup")
    sidebar.innerHTML += '<a href="javascript:void(0)" class="closebtn" onclick="closeNavBar()">&times;</a>'
    posters = document.getElementsByClassName('poster');
    console.log(posters)
    if (posters.length > 0) {
        for (var i = posters.length - 1; i >= 0; --i) {
            posters[i].remove();
        }
    }

    const header = document.createElement("h2")
    header.innerText = "Top " + genre + " movies with " + gender + " " + role
    header.style.textAlign = "center"
    header.style.paddingRight = "30px"
    header.style.paddingTop = "20px"
    sidebar.appendChild(header)

    const wrapper = document.createElement("div")
    wrapper.style.paddingLeft = "20px"
    wrapper.style.paddingTop = "15px"
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

                // link.style.height = "250px"
                link.style.width = "19%"
                wrapper.appendChild(link)
                link.style.marginRight = "1%"
                link.id = element + "-poster"
                link.addEventListener("click", function(elem){
                    if (selected_movie) {
                        selected_movie.style.strokeWidth = "0"
                        selected_poster.style.border = "none"
                    }
                    console.log(this.id)
                    console.log(this.id.split("-")[0])
                    selected_movie = document.getElementById(this.id.split("-")[0])
                    selected_movie.style.stroke = "#f4c20d"
                    selected_movie.style.strokeWidth = "5"
                    this.style.border = "4px solid #f4c20d"
                    selected_poster = this
                    
                })

                link.addEventListener("dblclick", function(elem){
                    selected_movie = document.getElementById(this.id.split("-")[0])
                    selected_movie.dispatchEvent(new Event('click')); 
                })

            },
            () => { console.log("f") })
    });

    sidebar.style.width = "100%";
    sidebar.style.height = "100%";
    sidebar.style.top = "0"
    sidebar.style.left = "";
    sidebar.style.right = "0";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNavActor() {
    document.getElementById("graphPopup").style.width = "0";
    document.getElementById("graphPopup").innerHTML = ""
}

function closeNavBar() {
    document.getElementById("barPopup").style.width = "0";
    document.getElementById("barPopup").innerHTML = ""
    if (selected_movie) {
        selected_movie.style.strokeWidth = "0"
        selected_poster.style.border = "none"
    }
}

function scatter_click(d) {
    theMovieDb.movies.getById(d,
        (r1) => {
            movie_info = JSON.parse(r1)
            theMovieDb.movies.getCredits(d,
                (r2) => {
                    credits_info = JSON.parse(r2)
                    theMovieDb.movies.getVideos(d, (r3) => {
                        video_info = JSON.parse(r3)
                        openNavMovie(movie_info, credits_info, video_info)
                    },
                        () => { console.log("f") })
                },
                () => { console.log("f") })
        },
        () => { console.log("f") })
}

function network_click(d) {
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

    constructor() {

    }

    initialize(figure_element_id, dataset) {
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
            .attr("fill", d => fill(this.cAccessor(d)))
            .attr("r", d => this.rScale(this.rAccessor(d)))
            .attr("id", d => d.id)

        dots.enter()
            .append("circle")
            .attr("id", d => d.id)
            .on("click", function (d) { scatter_click(d) })
            .on('mouseover', function (d) {
                console.log(d.id)
                let offset = getOffset(this)
                let new_cx = offset.left
                let new_cy = offset.top - 40
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

    setColorSelector(role) {
        if (role == 'director') {
            this.cAccessor = d => d.genderDirector
        }
        else if (role == 'actor') {
            this.cAccessor = d => d.genderLead
        }
        this.bounds.selectAll("circle")
            .data(this.datasetYear)
            .transition()
            .duration(300)
            .attr("r", 0)
            .transition()
            .duration(300)
            .attr("r", d => this.rScale(this.rAccessor(d)))
            .attr("fill", d => fill(this.cAccessor(d)))

    }

    brushended() {
        var s = d3.event.selection;
        if (!s) {
            if (!this.idleTimeout) return this.idleTimeout = setTimeout(this.idled.bind(this), this.idleDelay);
            this.xScale.domain(d3.extent(this.datasetYear, this.xAccessor)).nice()
            this.yScale.domain(d3.extent(this.datasetYear, this.yAccessor)).nice()
            this.rScale.domain(d3.extent(this.datasetYear, this.rAccessor))
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
        this.xAxis.transition().duration(2000).call(this.xAxisGenerator)
        this.yAxis.transition().duration(2000).call(this.yAxisGenerator)
        this.bounds.selectAll("circle").transition("zoomCircles").duration(2000)
            .attr("cx", d => this.xScale(this.xAccessor(d)))
            .attr("cy", d => this.yScale(this.yAccessor(d)))
            .attr("r", d => {
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

    constructor() {

    }

    initialize(figure_element_id, dataset, popularity_dataset) {
        this.role = 'actor'
        this.dataset = dataset
        this.popularity_dataset = popularity_dataset

        this.year = document.getElementById('range').value

        this.subgroups = ["Female", "Male"]

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

        this.selectedDataset = this.dataset[this.year][this.role]
        this.transformedData = Object.entries(this.selectedDataset).map(
            function (x) {
                return { "group": x[0], "Female": x[1]["Female"], "Male": x[1]["Male"] }
            }).sort((a, b) => b['Female'] - a['Female']).slice(0, 20)
        this.groups = this.transformedData.map(x => x['group'])

        const yScale = d3.scaleBand()
            .domain(this.groups)
            .range([0, this.dimensions.boundedHeight])
            .padding([0.3])

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
            .text("Genres")

        this.xAxisLabel = this.xAxis.append("text")
            .attr("x", this.dimensions.boundedWidth * 0.5)
            .attr("y", this.dimensions.margin.bottom - 10)
            .attr("fill", "black")
            .style("font-size", "1.4em")
            .text("Percent")
        this.update()
    }

    update() {
        const t = d3.transition().duration(1500)

        this.selectedDataset = this.dataset[this.year][this.role]
        this.transformedData = Object.entries(this.selectedDataset).map(
            function (x) {
                return { "group": x[0], "Female": x[1]["Female"], "Male": x[1]["Male"] }
            }).sort((a, b) => b['Female'] - a['Female']).slice(0, 20)
        this.groups = this.transformedData.map(x => x['group'])

        const yScale = d3.scaleBand()
            .domain(this.groups)
            .range([0, this.dimensions.boundedHeight])
            .padding([0.3])

        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, this.dimensions.boundedWidth]);

        this.xAxis.transition(t).call(d3.axisBottom(xScale))
        this.yAxis.transition(t).call(d3.axisLeft(yScale).tickSizeOuter(0))

        this.stackedData = d3.stack().keys(this.subgroups)(this.transformedData)

        this.bounds.selectAll(".bars").selectAll("rect").remove()
        this.bounds.selectAll(".bars").selectAll("g").remove()

        this.rects = this.bounds.append("g")
            .attr("class", "bars")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(this.stackedData)
            .enter()
            .append("g")
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
            .attr("y", function (d) { return yScale(d.data.group) + yScale.bandwidth(); })
            .attr("x", function (d) { return xScale(d[0]); })
            //.attr("x", function (d) { if (d[0] == 0) { return xScale(d[0]); } else return xScale(d[1]); })
            .attr("width", function (d) { return xScale(d[1]) - xScale(d[0]); })
            .attr("height", 0)
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
                    .style("top", (d3.event.pageY - 40) + "px")
                    .style("white-space", "nowrap");
            })
            .on('mousemove', function (d) {
                div.html(Math.round(Math.abs(d[0] - d[1]) * 10) / 10 + "%")
                    .style("left", d3.event.pageX + "px")
                    .style("top", (d3.event.pageY - 40) + "px")
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
            .sort((a, b) => { return a.data['Female'] - b.data['Female'] })

        this.bounds.selectAll("rect")
            .transition("barFadeIn")
            .duration(1000)
            .attr("height", yScale.bandwidth())
            .attr("y", function (d) { return yScale(d.data.group); })
    }

    setYear(year) {
        this.year = year
        this.update()
    }


    setRole(role) {
        this.role = role
        this.update()
    }

    setPopularityData(data) {
        this.popularity_dataset = data
    }

    onClick(object, d) {
        const selected_gender = d[0] == 0 & d[1] != 100 ? 'Female' : 'Male'
        const ids = object.popularity_dataset['genres'][object.year][d.data.group][this.role][selected_gender]
        listNav(ids, d.data.group.toLowerCase(), selected_gender.toLowerCase(), this.role == 'actor' ? 'stars' : 'directors')

    }
}

class Graph {

    constructor() {

    }

    initialize(figure_element_id, dataset) {
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

        this.male_director = true
        this.female_director = true
        this.male_actor = true
        this.female_actor = true
        let names = Array.from(new Set(Object.values(this.dataset).map(x => x.nodes).flat().map(x => x.id.split(',')[0])))
        autocomplete(document.getElementById("myInput"), names);
    }

    update() {
        this.svg.selectAll("*").remove()
        this.simulation = null
        let director_genders = []
        if (this.male_director) {
            director_genders.push("Male")
        }
        if (this.female_director) {
            director_genders.push("Female")
        }

        let actor_genders = []
        if (this.male_actor) {
            actor_genders.push("Male")
        }
        if (this.female_actor) {
            actor_genders.push("Female")
        }
        this.svg.selectAll("*").remove();

        this.endTime = Date.now() + 5000;

        this.datasetYear = this.dataset[this.year]


        this.nodes = []

        this.nodes = this.datasetYear.nodes.filter(d => d.isDirector && director_genders.includes(d.gender) ||
            !d.isDirector && actor_genders.includes(d.gender))
        let node_ids = this.nodes.map(d => d.id)


        this.links = this.datasetYear.links.filter(d => node_ids.includes(d.source) && node_ids.includes(d.target))



        if (this.links.length == 0) {
            this.links = this.datasetYear.links.filter(d => node_ids.includes(d.source.id) && node_ids.includes(d.target.id))
        }

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
            .attr("stroke-opacity", 0.5)
            .selectAll("line")

        this.link = this.link.data(this.links)
            .enter().append("line")
            // .attr("stroke-width", d => this.lineWidthScale(this.lineWidthAccessor(d)))
            .attr("stroke-width", 3)


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
            .enter()
            .append("image")
            .attr("xlink:href", function (d) {
                if (d.isDirector) {
                    console.log(d.id.split(",")[0])
                    if (d.gender == 'Male') {
                        return "male_director.png"
                    }
                    else {
                        return "female_director.png"
                    }
                }
                else {
                    if (d.gender == 'Male') {
                        return "male_actor.png"
                    }
                    else {
                        return "female_actor.png"
                    }
                }

            })
            .on("click", function (d) { network_click(d) })
            .attr("x", -10).attr("y", -10)
            .attr("width", 20)
            .attr("height", 20)
            .attr("rx", d => this.radius(this.radiusAccessor(d)) * 10)
            .attr("fill", d => fill(this.colorAccessor(d)))
            .attr("class", d => d.isDirector ? 'director' : 'actor')
            .attr("class", d => d.id.split(",")[0] == selected_name ? (d.gender == 'Male' ? 'selectedMale' : 'selectedFemale') : 'nonSelected')
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
                graph.wrapper.selectAll("image")
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
                graph.wrapper.selectAll("image")
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
            this.node.attr("transform", d => `translate(${this.xScale(d.x)}, ${this.yScale(d.y)})`)
        } else {
            this.simulation.stop();
        }
    }

    setYear(year) {
        this.year = year
        this.update()
    }

    updateFilters(female_director, male_director, female_actor, male_actor) {
        this.female_director = female_director
        this.male_director = male_director
        this.female_actor = female_actor
        this.male_actor = male_actor
        this.update()
    }
}

let scatter_plot = new ScatterPlot();

let bar_plot = new BarPlot();

let graph = new Graph();

function networkButtonClick(_this) {
    if (_this.classList.contains("active")) {
        _this.classList.remove("active")
    }
    else {
        _this.classList.add("active")
    }
    female_director = document.getElementById("femaleDirectorButton").classList.contains("active")
    male_director = document.getElementById("maleDirectorButton").classList.contains("active")
    female_actor = document.getElementById("femaleActorButton").classList.contains("active")
    male_actor = document.getElementById("maleActorButton").classList.contains("active")
    graph.updateFilters(female_director, male_director, female_actor, male_actor)
}

function reset_buttons() {
    document.getElementById("femaleDirectorButton").classList.add("active")
    document.getElementById("maleDirectorButton").classList.add("active")
    document.getElementById("femaleActorButton").classList.add("active")
    document.getElementById("maleActorButton").classList.add("active")
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
        scatter_plot.initialize("wrapper-gender-representation", files[0]);

        bar_plot.initialize("wrapper-categories", files[1], files[5]);

        graph.initialize("wrapper-collaborations", files[2]);

        const scatterCheckbox = document.getElementById("scatterCheckbox")

        scatterCheckbox.addEventListener('change', function () {
            if (this.checked) {
                scatter_plot.setColorSelector('director')
            }
            else {
                scatter_plot.setColorSelector('actor')
            }
        })

        const barCheckbox = document.getElementById("barCheckbox")

        barCheckbox.addEventListener('change', function () {
            if (this.checked) {
                bar_plot.setRole('director')
            }
            else {
                bar_plot.setRole('actor')
            }
        })

        function update_years() {
            //reset_buttons()
            scatter_plot.setYear(range.value)
            bar_plot.setYear(range.value)
            graph.setYear(range.value)

        }
        range.addEventListener('input', update_years);
        update_years()



    })
});