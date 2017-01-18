
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoosehandler = require('./modules/mongoosehandler');

var app = express();
var Contact = mongoosehandler.Contact;
var john_douglas = new Contact({
	firstname: "John",
	lastname: "Douglas",
	title: "Mr.",
	company: "Dev Inc",
	jobtitle: "Developer",
	primarycontactnumber: "+46703909488",
	othercontactnumbers: [],
	primaryEmailaddress: "john.diuglas@xyz.com",
	emailaddress: ["j.diuglas@xyz.com"],
	groups: ["Dev"]
});
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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
