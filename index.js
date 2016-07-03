var fs = require("fs");
var macOSSpaces = require("macos-spaces");
var exec = require("child_process").exec;
var db = require("./database");

var closeDbKillDock = function() {
  db.close();
  exec('/usr/bin/killall Dock');
};

var updateSpace = function(spaceUUID, wallpaper, callback) {
  macOSSpaces.spaces(function(spaces) {
    var space = spaces.find(function(s) {
      return s.spaceUUID === spaceUUID;
    });

    if (space) {
      db.updateSpaceWallpaper(space.displayUUID, space.spaceUUID, wallpaper, function(err) {
        if (err) return console.error(err);
        console.log(this.lastID);
        closeDbKillDock();
        if (callback) callback();
      });
    } else {
      return console.err('No known space with that id');
    }
  });
};

var updatePrimarySpace = function(wallpaper, callback) {
  updateSpace('', wallpaper, callback);
};

var updateAllSpaces = function(wallpapers, callback) {
  var done = 0;
  var doneLimit = 0;
  var closeIfDone = function() {
    if (done >= doneLimit) {
      closeDbKillDock();
      if (callback) callback();
    }
  };

  if (wallpapers.constructor !== Array) {
    wallpapers = [wallpapers];
  }

  var did, sid, wal;
  macOSSpaces.spaces(function(spaces) {
    doneLimit = spaces.length;
    for (var i = 0; i < spaces.length; i++) {
      did = spaces[i].displayUUID;
      sid = spaces[i].spaceUUID;
      wal = wallpapers[i % wallpapers.length];
      db.updateSpaceWallpaper(did, sid, wal, function(err) {
        if (err) return console.error(err);

        done++;
        closeIfDone();
      });
    }
  });
};

module.exports = {
  updateAllSpaces: updateAllSpaces,
  updateSpace: updateSpace,
  updatePrimarySpace: updatePrimarySpace
};
