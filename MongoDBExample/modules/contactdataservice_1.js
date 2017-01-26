/**
 * http://usejsdoc.org/
 */

function toContact(body, Contact) {
	return new Contact({
		primaryContactNumber: body.primaryContactNumber,
		firstname: body.firstname,
		lastname: body.lastname,
		title: body.title,
		company: body.company,
		jobtitle: body.jobtitle,
		othercontactnumbers: body.othercontactnumbers,
		primaryEmailaddress: body.primaryEmailaddress,
		emailaddress: body.emailaddress,
		groups: body.groups
	});
}

exports.remove = function(model, _primarycontactnumber, response) {
	console.log('Deleting contact with primary number: ' + _primarycontactnumber);
	model.findOne({primaryContactNumber: _primarycontactnumber},
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
	var primarycontactnumber = requestBody.primaryContactNumber;
	model.findOne({primaryContactNumber: primarycontactnumber},
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
						data.primaryContactNumber = contact.primaryContactNumber;
						data.firstname = contact.firstname;
						data.lastname = contact.lastname;
						data.title = contact.title;
						data.company = contact.company;
						data.jobtitle = contact.jobtitle;
						data.othercontactnumbers = contact.othercontactnumbers;
						data.primaryEmailaddress = contact.primaryEmailaddress;
						data.emailaddress = contact.emailaddress;
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
	var primarycontactnumber = requestBody.primaryContactNumber;
	contact.save(function(error) {
		if(!error) {
			contact.save();
		} else {
			console.log('checking if contact failed to save due to already exist a contact with ' +
					'primary number: ' + primarycontactnumber);
			model.findOne({primaryContactNumber: primarycontactnumber},
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
								data.primaryContactNumber = contact.primaryContactNumber;
								data.firstname = contact.firstname;
								data.lastname = contact.lastname;
								data.title = contact.title;
								data.company = contact.company;
								data.jobtitle = contact.jobtitle;
								data.othercontactnumbers = contact.othercontactnumbers;
								data.primaryEmailaddress = contact.primaryEmailaddress;
								data.emailaddress = contact.emailaddress;
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

exports.findByNumber = function(model, _primaryContactNumber, response) {
	model.findOne({primaryContactNumber: _primaryContactNumber},
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
