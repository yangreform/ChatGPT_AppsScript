function sheet( sent_txt, reply_txt ) {
  var spreadsheet = SpreadsheetApp.openById('ID');
  var sheet = spreadsheet.getSheetByName('工作表1');
  Logger.log(sheet.getRange('A1').getValue());
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow+1,1).setValue(Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss")); // 將 B1 儲存格寫入時間
  sheet.getRange(lastRow+1,2).setValue(sent_txt); // 將 B2 儲存格寫入1
  sheet.getRange(lastRow+1,3).setValue(reply_txt); // 將 B3 儲存格寫入2
}

//sheet( '1', '2' )
