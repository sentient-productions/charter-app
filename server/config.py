data_config = {
"employee_data" : 
{
"data_path": "data/AI_salaries.csv",
"data_header":  
"""\n
In [1]: import pandas as pd
In [2]: import plotly.express as px
In [3]: import numpy as np
In [4]: path = 'data/employee_salaries.csv'
In [5]: dataset = pd.read_csv(path)
In [6]: dataset.tail(3)
Out[6]: 
work_year experience_level employment_type              job_title   salary salary_currency  salary_in_usd employee_residence  remote_ratio company_location company_size
1192       2020               EN              FT         Data Scientist   105000             USD         105000                 US           100               US            S
1193       2020               EN              CT  Business Data Analyst   100000             USD         100000                 US           100               US            L
1194       2021               SE              FT   Data Science Manager  7000000             INR          94665                 IN            50               IN            L
""",
"base_question": "\n Q: 20 bin histogram of Data Scientist salaries, clip salaries to a max of 500k \n NeuralPlot:"
},
"stock_data" : 
{
"data_path": "data/AAPL.csv",
"data_header":  
"""\n
In [1]: import pandas as pd
In [2]: import plotly.express as px
In [3]: import numpy as np
In [4]: path = 'data/AAPL.csv'
In [5]: dataset = pd.read_csv(path)
In [6]: dataset.tail(3)
Out[6]: 
            date     open    high       low   close    volume  Name
1256  2018-02-05  159.100  163.88  156.0000  156.49  72738522  AAPL
1257  2018-02-06  154.830  163.72  154.0000  163.03  68243838  AAPL
1258  2018-02-07  163.085  163.40  159.0685  159.54  51608580  AAPL
""",
"base_question": "\n Q: The 5, 10, and 30 day moving averages \n NeuralPlot:"
},
"covid_data":
{
"data_path": "data/covid.csv",
"data_header":  
"""\n
In [1]: import pandas as pd
In [2]: import plotly.express as px
In [3]: import numpy as np
In [4]: path = 'data/covid.csv'
In [5]: dataset = pd.read_csv(path)
In [6]: dataset.tail(3)
Out[6]: 
         USMER  MEDICAL_UNIT  SEX  PATIENT_TYPE   DATE_DIED  INTUBED  PNEUMONIA  AGE  PREGNANT  DIABETES  COPD  ASTHMA  INMSUPR  HIPERTENSION  OTHER_DISEASE  CARDIOVASCULAR  OBESITY  RENAL_CHRONIC  TOBACCO  CLASIFFICATION_FINAL  ICU
1048572      2            13    2             1  9999-99-99       97          2   55        97         2     2       2        2             2              2               2        2              2        2                     7   97
1048573      2            13    2             1  9999-99-99       97          2   28        97         2     2       2        2             2              2               2        2              2        2                     7   97
1048574      2            13    2             1  9999-99-99       97          2   52        97         2     2       2        2             2              2               2        2              2        2                     7   97
""",
"base_question": "\n Q: Histogram of age for deceased \n NeuralPlot:"
},
"chess_data":
{
"data_path": "data/chess.csv",
"data_header":  
"""\n
In [1]: import pandas as pd
In [2]: import plotly.express as px
In [3]: import numpy as np
In [4]: path = 'data/covid.csv'
In [5]: dataset = pd.read_csv(path)
In [6]: dataset.tail(3)
Out[6]: 
       time_control             end_time  rated time_class  rules      gm_username   white_username  white_rating white_result   black_username  black_rating black_result
859367           60  2021-04-20 01:14:49   True     bullet  chess  zvonokchess1996  zvonokchess1996          2892          win       TampaChess          2726   checkmated
859368           60  2021-04-20 01:17:00   True     bullet  chess  zvonokchess1996       TampaChess          2721      timeout  zvonokchess1996          2899          win
859369           60  2021-04-20 01:19:13   True     bullet  chess  zvonokchess1996  zvonokchess1996          2906          win       TampaChess          2717     resigned
""",
"base_question": "\n Q: 20 bin Histogram of white minus black rating for games won by black  \n NeuralPlot:"
},
}
