# VM LINK: 
https://gabrij2.eastus.cloudapp.azure.com/ITWS-2110-F24-gabrij2/quiz1/


In order to combined this quiz work with my previous lab work with the weather and quotes api, I first copied my lab 2 code and worked on including all frank api functionality in the quiz1 function in the javascript. 

I added a new asyncronous function that runs after my weather api calls to fetch the frank API data, store it in a new mysql database called quiz1, then retrieve it and display it on the webpage. 

I ran into trouble creating the new quiz1 database on my VM. When I went to the phpmyadmin page to enter in the SQL command CREATE DATABASE quiz1, my user gabrij2@localhost had invalid permissions and I was unable start up the database and thus have my app connect to it properly. 


# Sources
Much of php code and javascript code was reused from labs 2 and 3. 

Openweather API and Zenquotes API

Frankfurt api and documentation https://api.frankfurter.app/latest