# Avalanche

A theme and directory organisation for [landslide](https://github.com/adamzap/landslide)

View an [example presentation](http://akrabat.github.com/avalanche/example.html)

### Improved JavaScript

The default theme's slides.js has been revamped as a jQuery plugin with a handful of fixes and improvements (many more to come!):

- Includes a clock in presenter view.
- 'p' properly toggles presenter view on _and_ off.
- 'b' (blank) in presenter mode blanks the main view but simply reduces the opacity of the active slide in the presenter view.
- Closing the main window will automatically close presenter view.
- Greatly improved previously buggy scaling support, allows for embedding of slides.
- Added support for more presenter remotes via additional shortcuts.
- Additional 'f' shortcut for JavaScript-induced full screen mode. This resolves an issue with OSX blanking out the other screen when using F11 for full screen.

## Creating a new presentation

* Create a new directory
* Place required markup files and any custom css and image files here
* Copy the `example_presentation/presentation.cfg` to here and change the filenames and paths as required

## Building the slides

* Install [landslide](https://github.com/adamzap/landslide).
* cd into the directory of the presentation that you want to create and run `landslide presentation.cfg`.
* Open up the newly created HTML file that is in the presentation directory.
