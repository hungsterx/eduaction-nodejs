/**
 * http://usejsdoc.org/
 */

function toContact(body, Contact) {
	return new Contact({
		firstname: body.firstname,
		lastname: body.lastname,
		title: body.title,
		company: body.company,
		jobtitle: body.jobtitle,
		primarycontactnumber: body.primarycontactnumber,
		othercontactnumbers: body.othercontactnumbers,
		primarymailaddress: body.primarymailaddress,
		emailaddresses: body.emailaddresses,
		groups: body.groups
	});
}

exports.remove = function(model, _primarycontactnumber, response) {
	console.log('Deleting contact with primary number: ' + _primarycontactnumber);
	model.findOne({primarycontactnumber: _primarycontactnumber},
			function(error, data) {
				if(error) {
					console.log(error);
					if(response != null) {
						response.writeHead(500, {'Content-Type' : 'text/plain'});
						response.end('Internal Server error');
					}
					return;
				} else {
					if(!data) {
						console.log('not found');
						if(response != null) {
							response.writeHead(404, {'Content-Type' : 'text/plain'});
							response.end('Not Found');
						}
						return;
					} else {
						data.remove(function(error) {
							if(!error) {
								data.remove();
							} else {
								console.log('error');
							}
						});
						
						if(response != null) {
							response.send('Deleted');
						}
						return;
					}
				}
			}
	);
};

exports.update = function(model, requestBody, response) {
	var primarycontactnumber = requestBody.primarycontactnumber;
	model.findOne({primarycontactnumber: primarycontactnumber},
			function(error, data) {
				if(error) {
					console.log(error);
					if(response != null) {
						response.writeHead(500, {'Content-Type' : 'text/plain'});
						response.end('Internal Server Error');
					}
					return;
				} else {
					var contact = toContact(requestBody, model);
					if(!data) {
						console.log('Contact with ' + primarycontactnumber + ' does not exist.' +
								' The contact will be created');
						contact.save(function(error) {
							if(!error) {
								contact.save();
							} else {
								console.log(error);
							}
						});
						
						if(response != null) {
							response.writeHead(201, {'Content-Type' : 'text/plain'});
							response.end('Created');
						}
						return;
					} else {
						data.firstname = contact.firstname;
						data.lastname = contact.lastname;
						data.title = contact.title;
						data.company = contact.company;
						data.jobtitle = contact.jobtitle;
						data.primarycontactnumber = contact.primarycontactnumber;
						data.othercontactnumbers = contact.othercontactnumbers;
						data.primarymailaddress = contact.primarymailaddress;
						data.emailaddresses = contact.emailaddresses;
						data.groups = contact.groups;
						data.save(function(error) {
							if(!error) {
								console.log('Successfully uppdated contact with primarynumber: ' +
										primarycontactnumber);
								data.save();
							} else {
								console.log('error on save');
							}
						});
						
						if(response != null) {
							response.send('Updated');
						}
					}
					
				}
			}
	);
};

exports.create = function(model, requestBody, response) {
	var contact = toContact(requestBody, model);
	var primarycontactnumber = requestBody.primarycontactnumber;
	contact.save(function(error) {
		if(!error) {
			contact.save();
		} else {
			console.log('checking if contact failed to save due to already exist a contact with ' +
					'primary number: ' + primarycontactnumber);
			model.findOne({primarycontactnumber: primarycontactnumber},
					function(error, data) {
						if(error) {
							console.log(error);
							if(response != null) {
								response.writeHead(500, {'Content-Type' : 'text/plain'});
								response.end('Internal Server Error');
							}
							return;
						} else {
							var contact = toContact(requestBody, model);
							if(!data) {
								console.log('Contact with ' + primarycontactnumber + ' does not exist.' +
										' The contact will be created');
								contact.save(function(error) {
									if(!error) {
										contact.save();
									} else {
										console.log(error);
									}
								});
								
								if(response != null) {
									response.writeHead(201, {'Content-Type' : 'text/plain'});
									response.end('Created');
								}
								return;
							} else {
								data.firstname = contact.firstname;
								data.lastname = contact.lastname;
								data.title = contact.title;
								data.company = contact.company;
								data.jobtitle = contact.jobtitle;
								data.primarycontactnumber = contact.primarycontactnumber;
								data.othercontactnumbers = contact.othercontactnumbers;
								data.primarymailaddress = contact.primarymailaddress;
								data.emailaddresses = contact.emailaddresses;
								data.groups = contact.groups;
								data.save(function(error) {
									if(!error) {
										console.log('Successfully uppdated contact with primarynumber: ' +
												primarycontactnumber);
										data.save();
									} else {
										console.log('error on save');
									}
								});
								
								if(response != null) {
									response.send('Updated');
								}
							}
							
						}
					}
			);
		}
	});
};

exports.findByNumber = function(model, _primarycontactnumber, response) {
	model.findOne({primarycontactnumber: _primarycontactnumber},
			function(error, result) {
				if(error) {
					console.log(error);
					if(response != null) {
						response.writeHead(500, {'Content-Type' : 'text/plain'});
						response.end('Internal Server Error');
					}
					return;
				} else {
					if(!result) {						
						if(response != null) {
							response.writeHead(404, {'Content-Type' : 'text/plain'});
							response.end('Not Found');
						}
						return;
					}
					
					if(response != null) {
						response.setHeader('Content-Type', 'application/json');
						response.send(result);
					}
					console.log(result);
				}
			}
	);
};

exports.list = function(model, response) {
	model.find({}, function(error, result) {
		if(error) {
			console.log(error);
			return null;
		}
		
		if(response != null) {
			response.setHeader('Content-Type', 'application/json');
			response.end(JSON.stringify(result));
		}
		
		return JSON.stringify(result);
	});
};

exports.query_by_arg = function (model, key, value, response) {
	var filterArg = '{\"' +key + '\":' + '\"' + value + '\"}';
	var filter = JSON.parse(filterArg);
	model.find(filter, function(error, result) {
		if(error) {
			console.log(error);
			response.writeHead(500, {'Content-Type' : 'text/plain'});
			response.end('Internal Server Error');
			return;
		} else {
			if(!result) {
				if(response != null) {
					response.writeHead(404, {'Content-Type' : 'text/plain'});
					response.end('Not Found');
				}
				return;
			}
			if(response != null) {
				response.setHeader('Content-Type', 'application/json');
				response.send(result);
				
			}
		}

	});
};

exports.updateImage = function(gfs, request, response) {
	var _primarycontactnumber = request.params.primarycontactnumber;
	console.log('Updating image for primary contact number:' + _primarycontactnumber);
	request.pipe(gfs.createWriteStream({
		_id : _primarycontactnumber,
		filename : 'image',
		mode : w
	}));
	response.send("Successfully uploaded image for primary contact number: " + _primarycontactnumber);
}

exports.getImage = function(gfs, _primarycontactnumber, response) {
	console.log('Requesting image for primary contact number:' + _primarycontactnumber);
	
	var imageStream = gfs.createReadStream({
		_id : _primarycontactnumber,
		filename : 'image',
		mode : r
	});

	imageStream.on('error', function(error) {
		response.send('404', 'Not Found');
		return;
	});
	response.setHeader('Content-Type', 'image/jpeg');
	imageStream.pipe(response);
}

exports.deleteImage = function(gfs, mongodb, _primarycontactnumber, response) {
	console.log('Delete an image for primary contact number:' + _primarycontactnumber);
	var collection = mongodb.collection('fs.files');
	
	collection.remove({_id : _primarycontactnumber, filename: 'image'}, function(error, contact) {
		if(error) {
			console.log('error');
			return;
		}
		
		if(contact === null) {
			response.send('404', 'Not Found');
			return;
		} else {
			console.log('Successfully deleted an image for primary contact number: ' + _primarycontactnumber);
		}
	});
	
	response.send('Successfully deleted an image for primary contact number: ' + _primarycontactnumber);
}