var sqlite3 = require("sqlite3").verbose();
var path = require("path");
var dbFile = process.env.HOME + '/Library/Application Support/Dock/desktoppicture.db';

var open = function() {
  return new sqlite3.Database(dbFile);
};

var getDataIDs = function(db, displayUUID, spaceUUID, callback) {
  var displayPart, spacePart;

  var queryDataIDs = function() {
    db.get("SELECT ROWID FROM pictures WHERE " + displayPart + " AND " + spacePart, function(err, row) {
      if (err) return callback(err);
      db.all("SELECT data_id FROM preferences WHERE picture_id = ?", row.rowid, function(err, rows) {
        if (err) return callback(err);
        callback(null, rows.map(function(r) {return r.data_id;}));
      });
    });
  };

  db.get('SELECT ROWID FROM spaces WHERE space_uuid = ?', spaceUUID, function(err, spaceRow) {
    if (err) return console.error(err);
    spacePart = 'space_id = ' + spaceRow.rowid;

    if (displayUUID === 'Main') {
      displayPart = 'display_id IS NULL';
      queryDataIDs();
    } else {
      db.get('SELECT ROWID FROM displays WHERE display_uuid = ?', displayUUID, function(err, displayRow) {
        if (err) return callback(err);
        displayPart = 'display_id = ' + diplayRow.rowid;
        queryDataIDs();
      });
    }
  });
};

var updateSpaceWallpaper = function(displayUUID, spaceUUID, wallpaper, callback) {
  var wallpaperPath = path.resolve(wallpaper);
  var db = open();

  getDataIDs(db, displayUUID, spaceUUID, function(err, dataIDs) {
    if (err) return callback(err);
    db.run("UPDATE data SET value = ? WHERE ROWID IN (" + dataIDs.join(',') + ")", wallpaperPath, function(err) {
      db.close();
      if (callback) callback(err);
    });
  });
};


module.exports = {
  updateSpaceWallpaper: updateSpaceWallpaper
};
