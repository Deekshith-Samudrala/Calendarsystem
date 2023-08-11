Calendar Appointment System Backend Project:

This project is a backend implementation of a calendar appointment system using Node.js/Express.js and MongoDB. The system allows users to view free slots of Dr. John and book appointments during his available times.

Description:

The goal of this project was to build a calendar appointment backend system that integrates with MongoDB to store events and display availabe slots for Dr. John. Users can view available time slots for booking appointments.

Installation:

Clone this repository to your local machine.
Run npm install to install the required dependencies.
Set up your MongoDB database and configure the connection.
Configure static config variables (Start Hours, End Hours, Duration, Time Zone) in the app.

Usage:

Use npm start to run front-end.
Run node app to start the server.

UI:
A React.js UI has been implemented for this project with the following pages:

Dashboard:

THis page displays a table with the constants that are configured in the constants file in back-end.

Book Event:

Name and Contact input, 
Date picker,
Time zone dropdown,
"Show Available Slots" button to fetch and display available slots. Clicking on a slot creates an event.
(Duration input from the user was not implemented due to lack of time but my logic is ready to handle custom duration input given by user).

Show Events:

Date range picker,
Displays all events within the selected date range.

API Endpoints:

Free Slots:

Endpoint: /api/free-slots ::
Description: Returns an array of available free slots for a given date and time zone.
(The logic to retrieve booked events is an O(n*n) logic which is not optimal, it can be optimized easily which was not implemented due to time constraint).

Create Event:

Endpoint: /api/bookslot ::
Description: Creates an event and stores it in the MongoDB document. 
(The logic to retrieve booked events is also used here which is O(n*n) which can be optimized easily).

Get Events:

Endpoint: /api/slotsinrange ::
Description: Returns all events between the given start and end dates.

Technologies Used:
Node.js,
Express.js,
MongoDB,
Formik (for forms),
Yup (for validation),
React.js (for UI).

Thank you going throught the Documentation !
have a good day !
