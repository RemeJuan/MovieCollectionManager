# Movie Collection Manager

A small web app running on Node/Express/Mongo sourcing data from TMDB.

You can use this locally or online, I am using Heroku, to manage your own personal movie collection.

More basic features are in place now, searching TMDB, adding and modifying data in your local collection.

[![Join the chat at https://gitter.im/RemeJuan/MovieCollectionManager](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/RemeJuan/MovieCollectionManager?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![Stable](https://img.shields.io/badge/Status-Stable-blue.svg)
![License - MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

[Demo](http://mcm.remelehane.me/)

![Media Collection Manager - Home](https://dl.dropboxusercontent.com/u/6374897/mcm/mcm_home.jpg)
![Media Collection Manager - List View](https://dl.dropboxusercontent.com/u/6374897/mcm/mcm_list.jpg)
![Media Collection Manager - Detail View](https://dl.dropboxusercontent.com/u/6374897/mcm/mcm_detail.jpg)

## Dependancies
* Node.JS v12.X
* MongoDB 2.6+

## Setup details

Clone repo

run:
`npm install` from comman-line

To Launch:

Ensure Mongo is running

`npm start`

## Features
* Search TMDB for movies
* Add Movies to your collection
* Update own detail from within collection

## Change Log

v0.5.1: 
* Deleting a title now also deletes its associated images

v0.5.0:
* Added genreas as 'tags' on list view for a tag based search.
* Added Location, Watched and Quality tags for additional filter options

v0.4.0:
* Images for movies are now automatically download
* If a collection title's image has been downloaded the local one will be loaded instead of TMDB's

v0.3.0:
* Added localisation of all language keys
* Enhanced views
* Changed details view to now use a manu for its main options
* Delete items from your collection

v0.2.0
* New Home screen
* Better distinction and seperation of user data and TMDB data.

v0.1.0:
* Initial
