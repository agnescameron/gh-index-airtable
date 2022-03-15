// AUTO GENERATE SIMPLE UNIQUE ID'S FOR NON-EMPTY ROWS
//
// Based on a script by Carlos Perez, clayperez@gmail.com
//
// REFERENCES:
// https://developers.google.com/apps-script/guides/triggers/events
// https://www.fiznool.com/blog/2014/11/16/short-id-generation-in-javascript/

var SHEETNAMES = ["Tools"] // change names!
var ID_COLUMN = 1;
var ID_LENGTH = 10;

// Thanks to Tom Spencer for this function
// Tom's website/blog is at fiznool.com
function generateUID () {
  return Utilities.getUuid();
}

function addMetadata(sheet, range, TIMESTAMP_COL) {
  var rangeValues = range.getValues();

  rangeValues.forEach(function(row,index,arr){
    var conc = row.join("").length;
    if(conc > 0) { // The current row edited is NOT empty. Proceed.
      var idRange = sheet.getRange( range.getRow() + index, ID_COLUMN ); 
      var idCell = idRange.getCell( 1, 1 );
      var idValue = idCell.getValue();
      if (idValue == "") {
        idCell.setValue( generateUID() );
      }

      var d = new Date();
      var timeStamp = d.toUTCString();

      var timeRange = sheet.getRange( range.getRow() + index, TIMESTAMP_COL );
      var editCell = timeRange.getCell( 1, 1 );
      if(range.getRow() !== 1){
        editCell.setValue(timeStamp);
       } 
    }
  });
  
}

function onEdit(evt) {
  var range = evt.range;
  var sheet = range.getSheet();
  var TIMESTAMP_COL = 17;

  if(!SHEETNAMES.includes(sheet.getSheetName()) ) return;
  if(sheet.getSheetName() === "Tools") addMetadata(sheet, range, TIMESTAMP_COL); // change name and timestamp cols!
}