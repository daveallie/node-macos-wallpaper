var fs = require("fs");
var macOSSpaces = require("macos-spaces");
var exec = require("child_process").exec;
var db = require("./database");

var restartDock = function() {
  exec('/usr/bin/killall Dock');
};

var updateSpace = function(spaceUUID, wallpaper, callback) {
  macOSSpaces.spaces(function(spaces) {
    var space = spaces.find(function(s) {
      return s.spaceUUID === spaceUUID;
    });

    if (space) {
      db.updateSpaceWallpaper(space.displayUUID, space.spaceUUID, wallpaper, function(err) {
        restartDock();
        if (callback) {
          callback(err);
        } else if (err) {
          console.error(err);
        }
      });
    } else {
      err = 'No known space with that id';
      if (callback) {
        callback(err);
      } else {
        console.error(err);
      }
    }
  });
};

var updatePrimarySpace = function(wallpaper, callback) {
  updateSpace('', wallpaper, callback);
};

var updateAllSpaces = function(wallpapers, callback) {
  var done = 0;
  var doneLimit = 0;
  var lastErr;
  var closeIfDone = function() {
    if (done >= doneLimit) {
      restartDock();
      if (callback) {
        callback(lastErr);
      } else if (lastErr) {
        console.error(lastErr);
      }
    }
  };

  if (wallpapers.constructor !== Array) {
    wallpapers = [wallpapers];
  }

  var updateSpaceCallback = function(err) {
    if (err) lastErr = err;
    done++;
    closeIfDone();
  };

  var did, sid, wal;
  macOSSpaces.spaces(function(spaces) {
    doneLimit = spaces.length;
    for (var i = 0; i < spaces.length; i++) {
      did = spaces[i].displayUUID;
      sid = spaces[i].spaceUUID;
      wal = wallpapers[i % wallpapers.length];
      db.updateSpaceWallpaper(did, sid, wal, updateSpaceCallback);
    }
  });
};

module.exports = {
  updateAllSpaces: updateAllSpaces,
  updateSpace: updateSpace,
  updatePrimarySpace: updatePrimarySpace
};
