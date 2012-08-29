
# An example presentation 

Rob Allen & Evan Coury

PHPNW, October 2012

.notes: Pressing 2 will display these fascinating notes

.fx: titleslide


# presenter notes
Some notes go here including this list:

* one
* two
* three

And this final line.

---

# A title slide

---

# A full-screen image

<img src="elephpant.jpg" />


.fx: imageslide white

---


# Rob Allen (Akrabat)

* @akrabat
* http://akrabat.com/
* Zend Framework Education Advisory Board



# Evan Coury (EvanDotPro)

* @EvanDotPro
* http://blog.evan.pro/
* Zend Certified Engineer


#presenter notes

Some notes for the presenter display only

*we can do italics too*

And a list:

* item 1
* item 2
* item 3

Some other line

---

# This is a title

.notes: These are some more notes that are really fascinating and I really want to display them!


This is just a paragraph of text that is quite long so that it probably goes over multiple lines. As such it should still look okay though!

>We shall defend our island, whatever the cost may be, we shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender.

<div class="cite">&mdash; <cite>Winston Churchill</cite></div>


---

# This is a very long title here to ensure it wraps correctly

This is just a paragraph of text that is quite long so that it probably goes over multiple lines. As such it should still look okay though!


---

# This is a list

* The first item
* The second item with some `preformatted` text
* The third item  
   with a new line

---

# Another slide

This a line of text

## This is a sub-title

1. item 1
2. item 2
3. item 3

---

# Some interesting code here

    !php
    class TheatreController extends AbstractActionController
    {
        protected $theatreMapper;

        public function indexAction()
        {
            $mapper = $this->getTheatreMapper();
            $theatres = $mapper->fetchAll();

            return new ViewModel(array('theatres' => $theatres));
        }

---

# A title with an image

<img src="elephpant.jpg" width="700" />


---
# Thank you



