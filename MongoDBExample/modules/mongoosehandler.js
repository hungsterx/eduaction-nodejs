/**
 * http://usejsdoc.org/
 */

var mongoose = require('mongoose');

var contactschema = new mongoose.Schema({
	primaryContactNumber: {type: String, index: {unique: true}},
	firstname: String,
	lastname: String,
	title: String,
	company: String,
	jobtitle: String,
	othercontactnumbers: [String],
	primaryEmailaddress: String,
	emailaddress: [String],
	groups: [String]
});

module.exports.Contact = mongoose.model('Contact', contactschema);