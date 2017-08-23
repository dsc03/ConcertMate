const Sequelize = require('sequelize');

const seq = new Sequelize(process.env.DATABASE_NAME, process.env.DATABESE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const Events = seq.define('events', {
  displayName: Sequelize.STRING,
  headline: Sequelize.STRING,
  uri: Sequelize.STRING,
  time: Sequelize.STRING,
  date: Sequelize.STRING,
  venue: Sequelize.STRING,
  latitude: Sequelize.STRING,
  longitude: Sequelize.STRING
});

Events.sync({force: false}).then(() => {
	console.log('Created "events" table');
});


seq
  .authenticate()
  .then(() => {
    console.log('connection granted');
  })
  .catch(err => {
    console.log('error connecting to DB ', err);
  });

let createEvent = (event) => {
	return Events.create({
		displayName: event.displayName,
	  headline: event.performance[0].displayName,
	  uri: event.uri,
	  time: event.start.time,
	  date: event.start.date,
	  venue: event.venue.displayName,
	  latitude: event.location.lat,
	  longitude: event.location.lng
	});
} 

let getEvents = (date, callback) => {
	return Events.findAll({
		where: {
			date: date
		},
		raw: true
	})
	.then((data) => {
		callback(data);
	})
	.catch((error) => {
		console.log("Error getting events: ", error);
	})
};

module.exports.createEvent = createEvent;
module.exports.getEvents = getEvents;