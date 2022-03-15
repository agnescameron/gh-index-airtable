function copyFormResponses(form_sheet, main_sheet) {
	var form_row = form_sheet.getRange(form_sheet.getLastRow(), 1, 1, form_sheet.getLastColumn()).getValues()[0];
	var shortnames = main_sheet.getRange(2, 3, main_sheet.getLastRow()-1).getValues().flat()
	console.log(shortnames)

	// create an array that matches the array of the source sheet
	// [0 UUID,	1 Title, 2 Shortname, 3 Website Link, 4 Citation, 5	API service, 
	// 6 Description, 7 Type, 8	Thumbnail URL, 9 Programmatic Access, 10 Notes, 11 Relationship description, 
	// 12 Relationships, 13 Related Publications, 14 Tags, 15	Point of Contact, 16 Record Last Updated]
	
	var new_row = new Array(form_sheet.getLastColumn())

	// uuid
	new_row[0] = Utilities.getUuid();

	// title
	new_row[1] = form_row[1].trim()

	// shortname
	if( form_row[2] && form_row[2].trim() !== '' ){
		if( shortnames.includes(form_row[2].trim()) ){
			console.log('sheet already contains row')
			new_row[2] = form_row[2].trim() + "_" + Utilities.getUuid().slice(0, 8);
		}

		else {
			new_row[2] = form_row[2].trim();
		}
	}

	// otherwise create shortname
	else {
		new_row[2] = form_row[1].trim().replace(/\s/g, '_').lower();
	}

	// website link
	new_row[3] = form_row[3];

	// API
	new_row[5] = form_row[4];

	// description
	new_row[6] = form_row[5];

	// tool type
	new_row[7] = form_row[6];

	// notes
	new_row[10] = form_row[11];

	// relationship description
	new_row[11] = form_row[7];

	// related publications
	new_row[13] = form_row[8];

	// tags
	new_row[14] = form_row[9];

	// point of contact
	new_row[15] = form_row[10];

	//timestamp (main sheet format not forms format)
	var d = new Date(form_row[0]);
	new_row[16] = d.toUTCString();
	console.log(new_row)

	main_sheet.appendRow(new_row)
}

function onFormSubmit(evt) {
	var ss = SpreadsheetApp.getActiveSpreadsheet();
	var form_sheet = ss.getSheetByName("Form Responses");
	var main_sheet = ss.getSheetByName("Tools");
	copyFormResponses(form_sheet, main_sheet);
}
