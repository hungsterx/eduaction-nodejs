
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , Grid = require('gridfs-stream')
  , contactservice = require('./modules/contactdataservice_1')
  , contactservice_v2 = require('./modules/contactdataservice_2')
  , contacts = require('./modules/contacts')
  , url = require('url');

var app = express();

mongoose.connect('mongodb://localhost/contacts');
var mongodb = mongoose.connection;
		
var contactSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	title: String,
	company: String,
	jobtitle: String,
	primarycontactnumber: {type: String, index: {unique: true}},
	othercontactnumbers: [String],
	primarymailaddress: String,
	emailaddresses: [String],
	groups: [String]
});

var Contact = mongoose.model('Contact', contactSchema);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/v1/contacts/:number', function(request, response) {
	console.log(request.url + ' : querying for ' + request.params.number);
	contactservice.findByNumber(Contact, request.params.number, response);
});

app.put('/v1/contacts', function(request, response) {
	contactservice.create(Contact, request.body, response);
});

app.post('/v1/contacts', function(request, response) {
	contactservice.update(Contact, request.body, response);
});

app.del('/v1/contacts/:primaryContactNumber', function(request, response) {
	contactservice.remove(Contact, request.params.primaryContactNumber, response);
});

app.get('/v1/contacts', function(request, response) {
	console.log('Listing all contacts with ' + request.params.key + '=' + request.params.value);
	contactservice.list(Contact, response);
});

app.get('/contacts', function(request, response) {
	console.log('Testing new apis ' + request.params.key + '=' + request.params.value);
	var get_params = url.parse(request.url, true).query;
	if(Object.keys(get_params).length == 0) {
		console.log('no params');
		contactservice_v2.list(Contact, response);
	} else {
		var key = Object.keys(get_params)[0];
		var value = get_params[key];
		JSON.stringify(contactservice_v2.query_by_arg(Contact, key, value, response));
	}

});

app.get('/contacts/:number', function(request, response) {
	console.log(request.url + ' : querying for ' + request.params.number);
	contactservice_v2.findByNumber(Contact, request.params.number, response);
});

app.put('/contacts', function(request, response) {
	contactservice_v2.create(Contact, request.body, response);
});

app.post('/contacts', function(request, response) {
	contactservice_v2.update(Contact, request.body, response);
});

app.del('/contacts/:primaryContactNumber', function(request, response) {
	console.log(request.url + ' : querying for ' + request.params.number);
	contactservice_v2.remove(Contact, request.params.primaryContactNumber, response);
});

app.get('/contacts/:number/image', function(request, response) {
	console.log(request.url + ' : querying for ' + request.params.number);
	var gfs = Grid(mongodb.db, mongoose.mongo);
	contactservice_v2.getImage(gfs, request.params.number, response);
});

app.put('/contacts/:primaryContactNumber/image', function(request, response) {
	console.log(request.url + ' : querying for ' + request.params.number);
	var gfs = Grid(mongodb.db, mongoose.mongo);
	contactservice_v2.updateImage(gfs, request, response);
});

app.post('/contacts/:primaryContactNumber/image', function(request, response) {
	console.log(request.url + ' : querying for ' + request.params.primaryContactNumber);
	var gfs = Grid(mongodb.db, mongoose.mongo);
	contactservice_v2.updateImage(gfs, request, response);
});

app.del('/contacts/:primaryContactNumber/image', function(request, response) {
	var gfs = Grid(mongodb.db, mongoose.mongo);
	contactservice_v2.deleteImage(gfs, mongodb.db, request.params.primaryContactNumber, response);
});


//app.get('/contacts', function(request, response) {
//	response.writeHead(301, {'Location' : '/v1/contacts/'});
//	response.end('Version 1 is moved to /contacts/: ');
//});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){

  console.log('Express server listening on port 3 ' + app.get('port'));
});
