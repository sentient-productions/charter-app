export const DATASET_QUERIES = { 
    "PLOT" : {
      "salaries.csv": "20 bin Histogram of salary, stacked by experience level",
      "AAPL.csv": "5d moving average of stock price for last 30 entries",
      "cars.csv": "Scatter plot of horsepower vs city mpg, colored by weight",
      "major_ports.csv": "Scatter plot of latitude vs. longitude for Brazilian ports",
      "2022_congress_fundraise.csv": "Box plot of cash on hand by party",
      "airbnb_listings.csv": "2d scatter plot of latitude vs longitude, weighted by average rating",
      "scooby.csv": "Time series of imdb score vs. date aired",
      "series.csv": "Scatter plot of Ratings vs cleaned Votes, clipped at 100k",
      "financial_sample.xlsx": "Histogram of gross sales, cleaned and clipped at 95th percentile",
    },
    "TABLE" : {
      "salaries.csv": "20 bin Histogram of salary, stacked by experience level",
      "AAPL.csv": "5d moving average of stock price for last 30 entries",
      "cars.csv": "Scatter plot of horsepower vs city mpg, colored by weight",
      "major_ports.csv": "Scatter plot of latitude vs. longitude for Brazilian ports",
      "2022_congress_fundraise.csv": "Box plot of cash on hand by party",
      "airbnb_listings.csv": "2d scatter plot of latitude vs longitude, weighted by average rating",
      "scooby.csv": "Time series of imdb score vs. date aired",
      "series.csv": "Scatter plot of Ratings vs cleaned Votes, clipped at 100k",
      "financial_sample.xlsx": "Histogram of gross sales, cleaned and clipped at 95th percentile",
    }
}

export const URL = "https://www.rango.run/"

export const QUERY_MODES = {
    PLOT: 0,
    TABLE: 1,
}
  
export const SQL_DUMMY = 
`SELECT tweet_url, text, like_count
FROM tweets
WHERE user_id = (SELECT user_id
                 FROM users
                 WHERE (lower(user_name) = lower('ilyasut'))
                 ORDER BY followers_count DESC
                 LIMIT 1)
ORDER BY like_count DESC
LIMIT 10`
