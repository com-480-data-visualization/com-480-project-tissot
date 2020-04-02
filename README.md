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

### 1.4 Related work



## Milestone 2 (Friday 1st May, 5pm)

**10% of the final grade**




## Milestone 3 (Thursday 28th May, 5pm)

**80% of the final grade**

