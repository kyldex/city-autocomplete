# City autocomplete

Begin to type the name of a French city to see if it appears in the autocomplete block.  
Try it directly here : https://city-autocomplete.rg-dev.fr/  
Data are raw text that search.php will unserialize.  

## Build

Check request url at the end of getResults() in main.js  
Check scripts used in index.html before use in production  
$ npm run build:js  
$ npm run build:css  
Output : dist folder  
