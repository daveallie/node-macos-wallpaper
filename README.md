# macOS Wallpaper

Sets wallpapers for individual spaces in macOS

## Usage

```javascript
var macOSWallpaper = require("macos-wallpaper");

// Updates a single space with a wallpaper
macOSWallpaper.updateSpace('60776AC5-A552-4A66-87FD-B4DF2C195DA2', '/path/to/wallpaper.png', function(err) {
  console.log('done');
});

// Updates the primary space with a wallpaper (same as updateSpace('', wallpaper))
macOSWallpaper.updatePrimarySpace('/path/to/wallpaper.png', function(err) {
  console.log('done');
});

// Updates all spaces with a single wallpaper
macOSWallpaper.updateAllSpaces('/path/to/wallpaper.png', function(err) {
  console.log('done');
});

// Updates all spaces with wallpapers from an array
macOSWallpaper.updateAllSpaces(['/path/to/wallpaper1.png', '/path/to/wallpaper2.png', ...], function(err) {
  console.log('done');
});
```
