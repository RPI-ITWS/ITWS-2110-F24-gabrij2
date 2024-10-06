https://gabrij2.eastus.cloudapp.azure.com/ITWS-2110-F24-gabrij2/labs/lab3/

I started this lab by enhancing the CSS styling for the main weather app element. I also resolved CORS issues when calling the ZenQuotes API by moving the fetch request from client-side JavaScript to PHP.

I added a button that fetches weather data from the OpenWeatherMap API. This button then makes another fetch request to the PHP server to store the JSON data into my SQL database. The database consists of one table with three columns: Date (as the primary key), Weather Data (directly from OpenWeatherMap), and TroyDayResults (generated by my JavaScript). Displaying this information on the webpage is managed by a modified displayResults function that fetches data from the PHP backend, which in turn queries the database and populates the page with the Troy Day results JSON data.

Next to the button that retrieves today's weather, there's a second button labeled "View Historical Data." When clicked, it takes the user to a page listing all date entries from the MySQL database. Clicking on a specific date opens up a form where these historical values can be edited—for example, if the wind speed for that day was recorded incorrectly. This feature provides a useful overview of past Troy Days, especially since one of the characteristics of Troy Weather is having many Troy Days in a row.

A major challenge of this lab was setting up the MySQL database on the Linux VM. Initially, the MySQL service was broken and kept giving socket errors. I fixed this by purging the MySQL package and reinstalling it successfully.

Still left to do for this web application is implementing caching for quote results so that the ZenQuotes API doesn't need to be called every time.

SOURCES:
Article used to help set up PHP and MySQL on my VM: https://www.digitalocean.com/community/tutorials/how-to-install-lamp-stack-on-ubuntu

I utilized JavaScript modules to organize my code: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

To ensure correct API calls to ZenQuotes, I referred to their API documentation: https://docs.zenquotes.io/

Intro to ITWS Code used for PHP reference: https://github.com/jcg517/itws1100-gabrij2