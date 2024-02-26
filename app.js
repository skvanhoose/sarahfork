// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Static Files
app.use(express.static('public'));

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

PORT = 21789;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

/*
   LOCATIONS ROUTES
*/
app.get('/', function(req, res)
    {  
        let query1 = "SELECT * FROM Locations;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query


app.post('/add-location-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Parse integers
    //let idLocation = parseInt(data.idLocation);
    let zipcode = parseInt(data.zipcode);


    // Create the query and run it on the database
    query1 = `INSERT INTO Locations (locationName, streetAddress, city, state, zipcode) VALUES ('${data.locationName}', '${data.streetAddress}', '${data.city}', '${data.state}', ${zipcode})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Locations;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-location-ajax/', function(req,res,next){
    let data = req.body;
    let locationID = parseInt(data.idLocation)
    let deleteLocation = `DELETE FROM Locations WHERE idLocation = ?`; /* We'll let Cascade delete 
    take care of the Sessions and Routes tables */
          // Run the 1st query
          db.pool.query(deleteLocation, [locationID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {       
                res.sendStatus(204);  
              }     
            })
    });

app.put('/put-location-ajax', function(req,res,next){
    let data = req.body;
    
    let location = parseInt(data.locationName);
    let address = data.streetAddress;
    
    let queryUpdateAddress = `UPDATE Locations SET Locations.streetAddress = ? WHERE Locations.idLocation = ?`;
    let selectAddress = `SELECT Locations.streetAddress FROM Locations WHERE Locations.idLocation = ?`;
    
            // Run the 1st query
            db.pool.query(queryUpdateAddress, [address, location], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);

                } else 
                {
                // Run the second query
                db.pool.query(selectAddress, [location], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

/*
   ROUTES ROUTES
*/

app.get('/routes.hbs', function(req, res)
    {  
        let getRoutes = "SELECT idRoute, routeName, DATE_FORMAT(dateSet, '%Y-%m-%d') AS dateSet, routeGrade, active, idLocation, idRouteSetter, idRouteType FROM Routes;";               // Define our query

        db.pool.query(getRoutes, function(error, rows, fields){    // Execute the query

            res.render('routes', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

/*
   ROUTE TYPES ROUTES
*/

app.get('/routetypes.hbs', function(req, res)
    {  
        let getTypes = "SELECT * FROM RouteTypes;";               // Define our query

        db.pool.query(getTypes, function(error, rows, fields){    // Execute the query

            res.render('routetypes', {data: rows});                  
        })                                                      
    });    

app.post('/add-routetype-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
  
        // Create the query and run it on the database
        routeInsert = `INSERT INTO RouteTypes (routeType) VALUES ('${data.routeType}')`;
        db.pool.query(routeInsert, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on bsg_people
                routeShow = `SELECT * FROM RouteTypes;`;
                db.pool.query(routeShow, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

app.delete('/delete-routetype-ajax/', function(req,res,next){
    let data = req.body;
    let routeTypeID = parseInt(data.idRouteType);
    let deleteRouteType = `DELETE FROM RouteTypes WHERE RouteTypes.idRouteType = ?`;
    
            // Run the 1st query
            db.pool.query(deleteRouteType, [routeTypeID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                else
                {
                    res.sendStatus(204);
                }
            })
    });
    
/*
   ROUTE SETTERS ROUTES
*/

app.get('/routesetters.hbs', function(req, res)
    {  
        let getSetters = "SELECT * FROM RouteSetters;";               // Define our query

        db.pool.query(getSetters, function(error, rows, fields){    // Execute the query

            res.render('routesetters', {data: rows});                  
        })                                                      
    });     
    


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});