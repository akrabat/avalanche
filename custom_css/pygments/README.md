# pygments-styles-dump

This is simply a dump of all the CSS styles included with [Pygments][Pygments].

The following script was used to generate the contents of this repo.

~~~ { python }
#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from codecs import open
from os import getcwd, path

from pygments.formatters import HtmlFormatter
from pygments.styles import get_all_styles


cwd = getcwd()

for style in get_all_styles():
    with open(path.join(cwd, style + '.css'), 'w', encoding = 'utf-8') as f:
        f.write(HtmlFormatter(style = style).get_style_defs('.highlight') + '\n')
~~~


[Pygments]: http://pygments.org/
