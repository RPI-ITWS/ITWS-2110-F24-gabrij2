New! Keyboard shortcuts … Drive keyboard shortcuts have been updated to give you first-letters navigation

The idea for this lab came from a running joke my friends and I have about the weather in Troy. In the winter here, the weather can be almost comically depressing: completely cloudy skies (everything looks grey), rainy, cold, windy and it gets dark it 4pm. We would call these kind of days "Troy Days". 

The point of this lab is to come up with a critera and scale for determining wether a day is a "Troy Day" and using the Open Weather API to automate this by gathering data on the current day. I came up with 10 categories and thresholds for what makes up a Troy Day which are listed below. If any day has at least 6/10 of these then it is considered a Troy Day.

    Location:       Troy  (or Watervliet on Open Weather map)
    Temperature:    Freezing or below
    Feels Like:     Freezing or below
    Cloudy:         Cloud Coverage is >= 50%
    Overcast:       Cloud Coverage is >= 85%
    Daylight Hours: Under 11 hrs between sunrise and sunset
    Wet:            Either misty, foggy or hazy. 
    Rain/snow:      Raining, drizzling or snowing.
    Storming:       Currently a Thunderstorm
    Windy:          Wind speed > 5mph

If the app determines that it is infact a Troy Day, the second API will fetch a random quote from Russion Novelist Dostoyevsky and display it on the screen. If it is not a not a Troy Day, a random quote with the take of "happiness" or inspiration will be fetched and displayed.

SOURCES:
Open Weather: Current Weather API DOCS: 
https://openweathermap.org/current 

MDN Docs for Geolocation API
https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

For the quotes API I used:
https://zenquotes.io/ 

I also used the boot strap documentation for badges, card elements and layout features
https://getbootstrap.com/docs/5.3/components/badge/ 
https://getbootstrap.com/docs/5.3/layout/columns/
