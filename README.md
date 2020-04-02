# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Blagoj Mitrevski | 295003 |
| Martin Milenkoski | 295000 |
| Mladen Korunoski | 309531 |

[Milestone 1](#milestone-1-friday-3rd-april-5pm) • [Milestone 2](#milestone-2-friday-1st-may-5pm) • [Milestone 3](#milestone-3-thursday-28th-may-5pm)

## Milestone 1 (Friday 3rd April, 5pm)

**10% of the final grade**

### 1.1 Dataset

For this project, we are using the [TMDb 5000 Movie Dataset](https://www.kaggle.com/tmdb/tmdb-movie-metadata), a metadata for around 5000 movies from TMDb. It contains two data sources: for *movies* and *credits*. The *movies* dataset has more columns (20) than the credits (4). The sources are in CSV format, however many of the cells contain JSON objects. For that, we need to parse the values and produce normalised tables. Most of the data, relevant for this study, is contained in the JSON objects, so we can safely discard any missing values. We plan to generate the necessary files for our visualisations (ex. with Pandas) and directly handle them with D3.

The *credits* dataset, although narrower, has most of the relevant data for this study. In the `cast` column, for each movie we have a list of characters and the actors portraying them, alongside personal information, such as `gender`. They are sorted depending on the role: main, supporting, etc. The `crew` column contains similar data, but regarding the crew members for a particular movie. They are also sorted in the same way they appear on the credits screen. The *movies* dataset has data for `genres`, `keywords`, `language`, `production`, etc. They are presented as arrays that we could aggregate. There are several numerical columns, such as: `budget`, `popularity`, `runtime`, and `vote` that we could incorporate in our study.

A lot of info can be inferred from the data. For example, we could infer the movie category from the crew's job title. Also, we could use the TMDb's API to further enrich the data.

Overall the data is pretty clean and ready for processing.


### 1.2 Problematic

The main axis we want to explore is gender equality along different dimensions. Some example questions we are interested in are:

 - Does gender equality improve over time?
 - What is the state of the gender distribution in different movie genres?
 - What is the state of the gender distribution in different countries?
 - Are there some production companies that are biased towards casting actors from a particular gender?
 - Are there directors who prefer working with male or female actors? 
 - Are there clusters of actors and directors who often work together?
 - Does the popularity/rating of a movie depend on the gender of the leading actor?

There has been a big movement towards gender equality in Hollywood in recent years, so we believe that our project will answer some interesting questions for the movie audience and the general public.

Apart from gender equality, we plan to also explore the other dimensions of the data and look for interesting patterns that we can show through a visualization. 


### 1.3 Exploratory Data Analysis

The dataset contains metadata for 4 803 movies including metadata for the actors and the crew of the movies. For the actors, there is metadata for a total of 48 291 male actors, and 24 168 female actors. Similarly, for the crew there is metadata for a total of 43 000 male crew personnel, and 11 764 female personnel. We created a few plots to get more insight in the data, and see if there is enough information to answer our questions.

This word cloud plot is a visual representation of the movie genres in our dataset. The most common movie genres are comedy, drama, thriller, action, etc.


<p align="center">
  <img src="img/wordcloud_genre.png" alt="drawing" width="600"/>
</p>

From these two plots we can see the ten most popular movies, and the gender representation in these movies. As we can see from the second plot, in all the movies there are more actors than actresses.

<p align="center">
  <img src="img/most_popular_movies.png" alt="drawing" width="1000"/>
</p>

<p align="center">
  <img src="img/gender_of_actors_in_the_most_popular_movies.png" alt="drawing" width="1000"/>
</p>

From these two plots we can see the ten movies with highest revenue, and the gender representation in these movies. Similarly as with the most popular movies, in all the movies there are more actors than actresses.

<p align="center">
  <img src="img/highest_revenue_movies.png" alt="drawing" width="1000"/>
</p>

<p align="center">
  <img src="img/gender_of_actors_in_highest_revenue_movies.png" alt="drawing" width="1000"/>
</p>

We also investigated the gender distribution in the top ten production companies. Here again we clearly see an overrepresentation of the actors over the actresses.

<p align="center">
  <img src="img/gender_in_top_10_production_companies_actors.png" alt="drawing" width="1000"/>
</p>

As the next plot shows, the similar trend is also observed in the gender distribution of the crew in the top ten production companies.

<p align="center">
  <img src="img/gender_in_top_10_production_companies_crew.png" alt="drawing" width="1000"/>
</p>

Finally, we looked at the gender distribution of the crew by departments in the movie industry. Here, we see that the male crew members are overrepresented in all the departments, except the costume and makeup department where we see more female crew members.

<p align="center">
  <img src="img/gender_of_crew_by_department.png" alt="drawing" width="1000"/>
</p>

These results are strong enough to point us to a conclusion that there is gender bias in Hollywood and the movie industry in general. This gives us an additional motivation to further investigate gender bias, and the recent movement towards gender equality in Hollywood.

### 1.4 Related work

The dataset is published on Kaggle, and there are around 1,500 kernels related to it. The authors of these kernels explore many different topics and dimensions of the dataset. Some popular topics include exploratory data analysis, recommendation engines, rating prediction and many others. As an example, in this [Kaggle kernel](https://www.kaggle.com/gsdeepakkumar/movie-mania-exploring-the-movie-database) we found various visualizations exploring this dataset. The kernel includes visualizations about popularity of the movies, most common keywords, correlations between popularity and revenue, etc. 

However, to the best of our knowledge, there is no kernel that explores the gender inequality and the questions we are interested in. Moreover, the kernels at Kaggle are static notebooks that lack interactivity. Therefore, our approach is unique in the sense that it will address an unexplored dimension of the dataset, and it will also provide more interactive visualizations using D3.js.

One interesting source of inspiration is [this](https://www.theatlantic.com/business/archive/2018/01/the-brutal-math-of-gender-inequality-in-hollywood/550232/) article that addresses the issue of underrepresentation of women in key behind-the-camera roles. The article also contains a visualization to support its claims. As mentioned before, we would like to create more thorough analysis of this phenomenon supported by more interactive and better visualizations. 

Another source of inspiration was [this](https://exploringcomics.github.io/src/app/index.html?fbclid=IwAR0frEn46nzQFLah-BOkK7qGuKagq2uUa6IRhM9y3SjrinzpZ77cHs2eCpU) project from the last year's course. The project contains some very interesting visualizations that explore the diversity in comics. This inspired us to look into gender diversity in movies. 


## Milestone 2 (Friday 1st May, 5pm)

**10% of the final grade**




## Milestone 3 (Thursday 28th May, 5pm)

**80% of the final grade**

