// these constants are used throughout the app
export const DATASET_QUERIES = {
  0: {
    'salaries.csv':
      'plot 20 bin histogram of salary, stacked by experience level',
    'AAPL.csv': 'plot 5d moving average of stock price for last 30 entries',
    'cars.csv': 'scatter plot of horsepower vs city mpg, colored by weight',
    'major_ports.csv':
      'scatter plot of latitude vs. longitude for Brazilian ports',
    '2022_congress_fundraise.csv': 'box plot of cash on hand by party',
    'airbnb_listings.csv':
      '2d scatter plot of latitude vs longitude, weighted by average rating',
    'scooby.csv': 'time series of imdb score vs. date aired',
    'series.csv': 'scatter plot of ratings vs cleaned Votes, clipped at 100k',
    'financial_sample.xlsx':
      'plot histogram of gross sales, cleaned and clipped at 95th percentile'
  },
  1: {
    'salaries.csv': 'aggregate average salary by experience level',
    'AAPL.csv': 'aggregate average close price by month',
    'cars.csv': 'Scatter plot of horsepower vs city mpg, colored by weight',
    'major_ports.csv':
      'Scatter plot of latitude vs. longitude for Brazilian ports',
    '2022_congress_fundraise.csv': 'Box plot of cash on hand by party',
    'airbnb_listings.csv':
      '2d scatter plot of latitude vs longitude, weighted by average rating',
    'scooby.csv': 'Time series of imdb score vs. date aired',
    'series.csv': 'Scatter plot of Ratings vs cleaned Votes, clipped at 100k',
    'financial_sample.xlsx':
      'Histogram of gross sales, cleaned and clipped at 95th percentile'
  }
};

// export const URL = 'https://www.rango.run/';
export const URL = 'flask-env-5.eba-stwbput5.us-east-1.elasticbeanstalk.com/'; // dev
// export const URL = "http://127.0.0.1:5000/"
// export const URL = 'https://flask-env-5.eba-stwbput5.us-east-1.elasticbeanstalk.com/';

export const NAME = 'Grappler';

export const QUERY_MODES = {
  PLOT: 0,
  TABLE: 1
};
