// RKA Changes:
// * Removed context (c)
// * Renamed "Full screen slides" to "Auto scaling" stillon keyboard shortcut 'e'
//
// * Added clock
// * Added HTML fullscreen mode (f) - works better in Chrome and Safari for Mac if you want to use presenter mode
//
// * Changed: When showing the sidebar, don't move the main content
//


function main() {
    // Since we don't have the fallback of attachEvent and
    // other IE only stuff we won't try to run JS for IE.
    // It will run though when using Google Chrome Frame
    if (document.all) { return; }

    var currentSlideNo;
    var notesOn = false;
    var blanked = false;
    var scalingEnabled = true;
    var slides = document.getElementsByClassName('slide');
    var touchStartX = 0;
    var spaces = /\s+/, a1 = [''];
    var tocOpened = false;
    var helpOpened = false;
    var overviewActive = false;
    var modifierKeyDown = false;
    var scale = 1;
    var showingPresenterView = false;
    var presenterViewWin = null;
    var isPresenterView = false;

    var str2array = function(s) {
        if (typeof s == 'string' || s instanceof String) {
            if (s.indexOf(' ') < 0) {
                a1[0] = s;
                return a1;
            } else {
                return s.split(spaces);
            }
        }
        return s;
    };

    var trim = function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };

    var addClass = function(node, classStr) {
        classStr = str2array(classStr);
        var cls = ' ' + node.className + ' ';
        for (var i = 0, len = classStr.length, c; i < len; ++i) {
            c = classStr[i];
            if (c && cls.indexOf(' ' + c + ' ') < 0) {
                cls += c + ' ';
            }
        }
        node.className = trim(cls);
    };

    var removeClass = function(node, classStr) {
        var cls;
        if (!node) {
            throw 'no node provided';
        }
        if (classStr !== undefined) {
            classStr = str2array(classStr);
            cls = ' ' + node.className + ' ';
            for (var i = 0, len = classStr.length; i < len; ++i) {
                cls = cls.replace(' ' + classStr[i] + ' ', ' ');
            }
            cls = trim(cls);
        } else {
            cls = '';
        }
        if (node.className != cls) {
            node.className = cls;
        }
    };

    var getSlideEl = function(slideNo) {
        if (slideNo > 0) {
            return slides[slideNo - 1];
        } else {
            return null;
        }
    };

    var getSlideTitle = function(slideNo) {
        var el = getSlideEl(slideNo);
        if (el) {
            var headers = el.getElementsByTagName('header');
            if (headers.length > 0) {
                return el.getElementsByTagName('header')[0].innerText;
            }
        }
        return null;
    };

    var getSlidePresenterNote = function(slideNo) {
        var el = getSlideEl(slideNo);
        if (el) {
            var n = el.getElementsByClassName('presenter_notes');
            if (n.length > 0) {
                return n[0];
            }
        }
        return null;
    };

    var changeSlideElClass = function(slideNo, className) {
        var el = getSlideEl(slideNo);
        if (el) {
            removeClass(el, 'far-past past current future far-future');
            addClass(el, className);
        }
    };

    var updateSlideClasses = function(updateOther) {
        window.location.hash = (isPresenterView ? "presenter" : "slide") + currentSlideNo;

        for (var i=1; i<currentSlideNo-1; i++) {
            changeSlideElClass(i, 'far-past');
        }

        changeSlideElClass(currentSlideNo - 1, 'past');
        changeSlideElClass(currentSlideNo, 'current');
        changeSlideElClass(currentSlideNo + 1, 'future');

        for (i=currentSlideNo+2; i<slides.length+1; i++) {
            changeSlideElClass(i, 'far-future');
        }

        highlightCurrentTocLink();

        document.getElementsByTagName('title')[0].innerText = getSlideTitle(currentSlideNo);

        updatePresenterNotes();

        if (updateOther) { updateOtherPage(); }
    };

    var updatePresenterNotes = function() {
        if (!isPresenterView) { return; }

        var existingNote = document.getElementById('current_presenter_notes');
        var currentNote = getSlidePresenterNote(currentSlideNo).cloneNode(true);
        currentNote.setAttribute('id', 'presenter_note');

        existingNote.replaceChild(currentNote, document.getElementById('presenter_note'));
    };

    var highlightCurrentTocLink = function() {
        var toc = document.getElementById('toc');

        if (toc) {
            var tocRows = toc.getElementsByTagName('tr');
            for (var i=0; i<tocRows.length; i++) {
                removeClass(tocRows.item(i), 'active');
            }

            var currentTocRow = document.getElementById('toc-row-' + currentSlideNo);
            if (currentTocRow) {
                addClass(currentTocRow, 'active');
            }
        }
    };

    var updateOtherPage = function() {
        if (!showingPresenterView) { return; }

        var w = isPresenterView ? window.opener : presenterViewWin;
        w.postMessage('slide#' + currentSlideNo, '*');
    };

    var nextSlide = function() {
        if (currentSlideNo < slides.length) {
            currentSlideNo++;
        }
        updateSlideClasses(true);
    };

    var prevSlide = function() {
        if (currentSlideNo > 1) {
            currentSlideNo--;
        }
        updateSlideClasses(true);
    };

    var showNotes = function() {
        var notes = getSlideEl(currentSlideNo).getElementsByClassName('notes');
        for (var i = 0, len = notes.length; i < len; i++) {
            notes.item(i).style.display = (notesOn) ? 'none':'block';
        }
        notesOn = !notesOn;
    };

    var showSlideNumbers = function() {
        var asides = document.getElementsByClassName('page_number');
        var hidden = asides[0].style.display != 'block';
        for (var i = 0; i < asides.length; i++) {
            asides.item(i).style.display = hidden ? 'block' : 'none';
        }
    };

    var showSlideSources = function() {
        var asides = document.getElementsByClassName('source');
        var hidden = asides[0].style.display != 'block';
        for (var i = 0; i < asides.length; i++) {
            asides.item(i).style.display = hidden ? 'block' : 'none';
        }
    };

    var showToc = function() {
        if (helpOpened) {
                showHelp();
        }
        var toc = document.getElementById('toc');
        if (toc) {
            toc.style.marginLeft = tocOpened ? '-' + (toc.clientWidth + 20) + 'px' : '0px';
            tocOpened = !tocOpened;
        }
        updateOverview();
    };

    var showHelp = function() {
        if (tocOpened) {
                showToc();
        }

        var help = document.getElementById('help');

        if (help) {
            help.style.marginLeft = helpOpened ? '-' + (help.clientWidth + 20) + 'px' : '0px';
            helpOpened = !helpOpened;
        }
    };

    var showPresenterView = function() {
        if (isPresenterView) { return; }

        if (showingPresenterView) {
            presenterViewWin.close();
            presenterViewWin = null;
            showingPresenterView = false;
        } else {
            presenterViewWin = open(window.location.pathname + "#presenter" + currentSlideNo, 'presenter_notes',
                                                                    'directories=no,location=no,toolbar=no,menubar=no,copyhistory=no');
            showingPresenterView = true;
        }
    };

    var switch3D = function() {
        if (document.body.className.indexOf('three-d') == -1) {
            document.getElementsByClassName('presentation')[0].style.webkitPerspective = '1000px';
            document.body.className += ' three-d';
        } else {
            window.setTimeout('document.getElementsByClassName(\'presentation\')[0].style.webkitPerspective = \'0\';', 2000);
            document.body.className = document.body.className.replace(/three-d/, '');
        }
    };

    var toggleOverview = function() {
        if (!overviewActive) {
            addClass(document.body, 'expose');
            overviewActive = true;
        } else {
            removeClass(document.body, 'expose');
            overviewActive = false;
        }
        expandSlides();
        updateOverview();
    };

    var updateOverview = function() {
        try {
            var presentation = document.getElementsByClassName('presentation')[0];
        } catch (e) {
            return;
        }

        if (isPresenterView) {
            var action = overviewActive ? removeClass : addClass;
            action(document.body, 'presenter_view');
        }

        var toc = document.getElementById('toc');

        if (!toc) {
            return;
        }
    };

    var computeScale = function() {
        var cSlide = document.getElementsByClassName('presentation')[0];
        var sx = cSlide.clientWidth / window.innerWidth;
        var sy = cSlide.clientHeight / window.innerHeight;
        return 1 / Math.max(sx, sy);
    };

    var setScale = function(scale) {
        var presentation = document.getElementsByClassName('presentation')[0];
        var transform = 'scale(' + scale + ')';
        presentation.style.MozTransform = transform;
        presentation.style.WebkitTransform = transform;
        presentation.style.OTransform = transform;
        presentation.style.msTransform = transform;
        presentation.style.transform = transform;
    };

    var expandSlides = function() {
        if (overviewActive) {
            // RKA: Not sure why this is done as expose mode will work with scaling
            // setScale(1);
            // return;
        }
        if(scalingEnabled) {
            scale = computeScale();
        } else {
            scale = 1;
        }
        setScale(scale);
    };

    var toggleBlank = function() {
        blank_elem = document.getElementById('blank');

        blank_elem.style.display = blanked ? 'none' : 'block';

        blanked = !blanked;
    };

    var toggleFullScreen = function() {
        if (document.mozFullScreen !== undefined && !document.mozFullScreen) {
          document.body.mozRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen) {
          document.body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
          document.webkitCancelFullScreen() || document.mozCancelFullScreen();
        }
    };

    var isModifierKey = function(keyCode) {
        switch (keyCode) {
            case 16: // shift
            case 17: // ctrl
            case 18: // alt
            case 91: // command
                return true;
                break;
            default:
                return false;
                break;
        }
    };

    var checkModifierKeyUp = function(event) {
        if (isModifierKey(event.keyCode)) {
            modifierKeyDown = false;
        }
    };

    var checkModifierKeyDown = function(event) {
        if (isModifierKey(event.keyCode)) {
            modifierKeyDown = true;
        }
    };

    var handleContextMenu = function(event) {
        if (!modifierKeyDown) {
            event.preventDefault();
            return false;
        }
        modifierKeyDown = false;
    }

    var handleClick = function(event) {
        if (modifierKeyDown) {
            modifierKeyDown = false;
            return;
        }
        var clickType = 'LEFT';
        if (event.which) { 
            if (event.which==3) clickType='RIGHT';
            if (event.which==2) clickType='MIDDLE';
        }
        else if (event.button) {
            if (event.button==2) clickType='RIGHT';
            if (event.button==4) clickType='MIDDLE';
        }
        switch (clickType) {
            case 'LEFT':
                event.preventDefault();
                prevSlide();
                break;
            case 'RIGHT':
                event.preventDefault();
                nextSlide();
                break;
        }
    }

    var handleBodyKeyDown = function(event) {
        // console.log("Key Down: " + event.keyCode);
        switch (event.keyCode) {
            case 13: // Enter
                if (overviewActive) {
                    toggleOverview();
                }
                break;
            case 27: // ESC
                toggleOverview();
                break;
            case 37: // left arrow
            case 33: // page up
            case 38: // up arrow
                event.preventDefault();
                prevSlide();
                break;
            case 39: // right arrow
            case 32: // space
            case 34: // page down
            case 40: // down arrow
                event.preventDefault();
                nextSlide();
                break;
            case 50: // 2
                if (!modifierKeyDown) {
                        showNotes();
                }
                break;
            case 51: // 3
                if (!modifierKeyDown && !overviewActive) {
                    switch3D();
                }
                break;
            case 190: // .
            case 48: // 0
            case 66: // b
                if (!modifierKeyDown && !overviewActive) {
                    toggleBlank();
                }
                break;
            case 69: // e
                if (!modifierKeyDown && !overviewActive) {
                    scalingEnabled = !scalingEnabled;
                    expandSlides();
                }
                break;                
            case 72: // h
                showHelp();
                break;
            case 78: // n
                if (!modifierKeyDown && !overviewActive) {
                    showSlideNumbers();
                }
                break;
            case 80: // p
                if (!modifierKeyDown && !overviewActive) {
                    showPresenterView();
                }
                break;
            case 83: // s
                if (!modifierKeyDown && !overviewActive) {
                    showSlideSources();
                }
                break;
            case 84: // t
                showToc();
                break;

            // F: Toggle fullscreen
            case 70: 
               // From http://io-2012-slides.googlecode.com
               // Only respect 'f' on body. Don't want to capture keys from an <input>.
               // Also, ignore browser's fullscreen shortcut (cmd+shift+f) so we don't
               // get trapped in fullscreen!
              if (event.target == document.body && !modifierKeyDown) {
                  toggleFullScreen();
              }                
        }
    };

    var handleWheel = function(event) {
        if (tocOpened || helpOpened || overviewActive) {
            return;
        }

        var delta = 0;

        if (!event) {
            event = window.event;
        }

        if (event.wheelDelta) {
            delta = event.wheelDelta/120;
            if (window.opera) delta = -delta;
        } else if (event.detail) {
            delta = -event.detail/3;
        }

        if (delta && delta <0) {
            nextSlide();
        } else if (delta) {
            prevSlide();
        }
    };

    var addSlideClickListeners = function() {
        for (var i=0; i < slides.length; i++) {
            var slide = slides.item(i);
            slide.num = i + 1;
            slide.addEventListener('click', function(e) {
                if (overviewActive) {
                    currentSlideNo = this.num;
                    toggleOverview();
                    updateSlideClasses(true);
                    e.preventDefault();
                }
                return false;
            }, true);
        }
    };

    var addRemoteWindowControls = function() {
        window.addEventListener("message", function(e) {
            if (e.data.indexOf("slide#") != -1) {
                    currentSlideNo = Number(e.data.replace('slide#', ''));
                    updateSlideClasses(false);
            }
        }, false);
    };

    var addTouchListeners = function() {
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].pageX;
        }, false);
        document.addEventListener('touchend', function(e) {
            var pixelsMoved = touchStartX - e.changedTouches[0].pageX;
            var SWIPE_SIZE = 150;
            if (pixelsMoved > SWIPE_SIZE) {
                nextSlide();
            }
            else if (pixelsMoved < -SWIPE_SIZE) {
             prevSlide();
            }
        }, false);
    };

    var addTocLinksListeners = function() {
        var toc = document.getElementById('toc');
        if (toc) {
            var tocLinks = toc.getElementsByTagName('a');
            for (var i=0; i < tocLinks.length; i++) {
                tocLinks.item(i).addEventListener('click', function(e) {
                    currentSlideNo = Number(this.attributes['href'].value.replace('#slide', ''));
                    updateSlideClasses(true);
                    e.preventDefault();
                }, true);
            }
        }
    };

    startClock = function() {
        var addZero = function(num) {
          return num < 10 ? '0' + num : num;
        }
        setInterval(function() {
          var now = new Date();
          document.getElementById("hours").innerHTML = addZero(now.getHours());
          document.getElementById("minutes").innerHTML = addZero(now.getMinutes());
          document.getElementById("seconds").innerHTML = addZero(now.getSeconds());
        }, 1000);
      };

    // initialize

    (function() {
        if (window.location.hash == "") {
            currentSlideNo = 1;
        } else if (window.location.hash.indexOf("#presenter") != -1) {
            currentSlideNo = Number(window.location.hash.replace('#presenter', ''));
            isPresenterView = true;
            showingPresenterView = true;
            presenterViewWin = window;
            addClass(document.body, 'presenter_view');
        } else {
            currentSlideNo = Number(window.location.hash.replace('#slide', ''));
        }

        document.addEventListener('keyup', checkModifierKeyUp, false);
        document.addEventListener('keydown', handleBodyKeyDown, false);
        document.addEventListener('keydown', checkModifierKeyDown, false);
        document.addEventListener('DOMMouseScroll', handleWheel, false);
        // document.addEventListener('mousedown', handleClick, false);
        // document.addEventListener('contextmenu', handleContextMenu, false);

        window.onmousewheel = document.onmousewheel = handleWheel;
        window.onresize = expandSlides;

        for (var i = 0, el; el = slides[i]; i++) {
            addClass(el, 'slide far-future');
        }
        updateSlideClasses(false);

        // add support for finger events (filter it by property detection?)
        addTouchListeners();

        addTocLinksListeners();

        addSlideClickListeners();

        addRemoteWindowControls();
        
        expandSlides();

        startClock();
    })();
}
