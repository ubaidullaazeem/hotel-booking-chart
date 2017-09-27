(function() {
	'use strict';
	angular
		.module('core.constant', [])
		//.constant('GOOGLE_CLIENT_ID', '228725713486-eng36vttlj0c1pt3nor8nti4j5i2laqu.apps.googleusercontent.com') //development
		.constant('GOOGLE_CLIENT_ID', '483617748399-qg8u4g1ohm0kt9idj1kbnb7d8o35kh0m.apps.googleusercontent.com') // live
		.constant('GOOGLE_SCOPES', 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly')
		.constant('GOOGLE_DISCOVERY_DOCS', ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"])
		//.constant('AUTHORISED_EMAIL', 'kumar@riverstonetech.com')//development
		.constant('AUTHORISED_EMAIL', 'mirthchennai@gmail.com')//live
		.constant('DATA_BACKGROUND_COLOR', 'blue')
		.constant('HARDCODE_VALUES', ['others'])
		.constant('CALENDAR_CHANGE_VIEW', ['agendaDay', 'agendaWeek', 'month'])
		.constant('CGST', 'CGST')
		.constant('SGST', 'SGST')
		.constant('INVOICE', 'invoice')
		.constant('RECEIPT', 'receipt')
		.constant('CLEANING_HOURS', 3)
		.constant('PAYMENT_STATUS', ['Advance Paid', 'Fully Paid'])
		.constant('TAX_TYPES', ['CGST', 'SGST'])
		.constant('BILL_TYPES', ['booking_form', 'receipt', 'invoice'])
		.constant('GOOGLE_CALENDAR_COLOR_IDS', {
			'GREEN': 10,
			"RED": 11
		})
		.constant('MESSAGES', {
			'ERR_MSG_UNAUTHORISED_USER': 'You are not authorized to use this application.',
			'ERR_MSG_PRIMARY_EMAIL': 'Primary email not found.',
			'ERR_MSG_GET_USER_INFO': 'Error occured, please try again later.',
			'ERR_MSG_PAST_DATE': 'Please select the current or future dates for the new bookings.',
			'ERR_MSG_NO_HALLS': 'Please add halls in settings.',
			'ERR_MSG_NO_EVENT_TYPE': 'Please add event names in settings.',
			'ERR_MSG_NO_PAYMENT_STATUS': 'Please add payment colors in settings.',
			'ERR_MSG_NO_TAXES': 'Please add both CGST and SGST tax rate.',
			'ERR_MSG_NO_REC_INV_NO': 'Please add Receipt/Invoice start number in settings.',
			'ERR_MSG_DUPLICATE_EVENT_TYPE': 'Name already exists.',
			'ERR_MSG_DUPLICATE_HALL_NAME': 'Name already exists.',
			'ERR_MSG_NO_EFFECTIVE_DATE_HALL': 'Effective date is not found for ',
			'ERR_MSG_NO_EMAIL_ID': 'Email id not found.',
			'ERR_MSG_UNSUPPORTED_FILE': 'Unsupported file.',
			'ERR_MSG_NO_CGST_FOR_TODAY': 'CGST tax rate is not found for today.',
			'ERR_MSG_NO_SGST_FOR_TODAY': 'SGST tax rate is not found for today.',
			'ERR_MSG_INVALID_BOOKING_DATA': 'Please enter valid data.',
			'ERR_MSG_GET_GOOGLE_CAL_HALLS': 'Unable to fetch the halls from Google Calendar.',
			'ERR_MSG_ADD_EVENT_TO_GOOGLE_CAL': 'Unable to add the event in ',
			'ERR_MSG_UPDATE_EVENT_IN_GOOGLE_CAL': 'Unable to update the event in ',
			'ERR_MSG_UPDATE_GOOGLE_CAL_DETAILS': 'Unable to update the Google calendar event details in database.',
			'ERR_TITLE_NO_HALLS': 'Halls Error',
			'ERR_TITLE_NO_EVENT_TYPE': 'Event Error',
			'ERR_TITLE_NO_PAYMENT_STATUS': 'Payment Status Error',
			'ERR_TITLE_NO_REC_INV_NO': 'Receipt/Invoice Start Number Error',
			'ERR_TITLE_UPDATE_RATE_SUMMARY': 'Update Rate Summary Error',
			'ERR_TITLE_EMAIL_SEND': 'Email Failed To Send',
			'ERR_TITLE_DELETE_HALL': 'Delete Hall Error',
			'ERR_TITLE_DELETE_EVENT': 'Delete Event Error',
			'SUCCESS_MSG_AUTH': 'Authorized successfully.',
			'SUCCESS_MSG_ACT_CHARGES_UPDAED': 'Actual charges updated successfully.',
			'SUCCESS_MSG_BOOKING_CREATED': 'Booked successfully.',
			'SUCCESS_MSG_BOOKING_UPDATED': 'Updated successfully.',
			'SUCCESS_TITLE_AUTH': 'Success',
			'SUCCESS_TITLE_EMAIL_SENT': 'Email dropped successfully',
		})
		.constant('PAY_MODES', ['Cheque', 'DD', 'Cash', 'NEFT']);
}).call(this);