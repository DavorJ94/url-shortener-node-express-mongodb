# URL Shortener Microservices API

Mini challenge completed for FCC in regards to learning APIs and microservices (for this challenge, Node/Express/MongoDB are used for API creation, Nodemon is used for live reloading, with allowed CORS policy).

A database is set up so when the user types url in the input box and clicks "Post URL", the POST method is invoked and url shortener is implemented. When the user goes to endpoint /api/shorturl/:<short_url_num> the user is redirected to the original url that was typed.
Short url numbers are received by basic counting of all documents in a collection from the database. There is no option to delete the documents, so that way of enumerating shortened urls is just fine in this case.

Also, a function is invoked which will first check if the url already exists in the database, and if it does, that document from the collection is returned, new document is not created (in case that some url is typed in more than once).

Link to the project challenge: [URL Shortener Microservice](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice)
