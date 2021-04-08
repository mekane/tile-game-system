# Tile App Game

## Setup

   * `npm install`
   * `npm run build`


# Code Conventions and Types   

There are multiple styles of module and class constructor used throughout the project,
for which the following explanation and apology is offered: I wanted to avoid using a
heavyweight typing system that requires extra tooling, and take advantage of as many
standards-based JavaScript features as possible.

## JSON Schema
Important data structures (mainly the entities) are documented using JSON schema. These
are used at runtime to validate data passed into entity initializer / constructor functions.
These will throw runtime exceptions and provide a hard enforcement that data properly
matches expected type.

## JSDoc Comments
Certain methods, parameters and data structures (mainly smaller, intermediate) are
documented inline with [JSDoc](https://jsdoc.app/) which mainly enables type hinting
in an IDE. These are mostly here to help the human developer remember what fields are
available on a given variable.

## ES2015 Classes
Classes using the JavaScript `class` keyword are rare but are used in cases where
inheritance is valuable for sharing behavior and/or there are multiple implementations
of a base type. The JavaScript class functionality provides both the code sharing and
the soft type enforcement (mostly IDE-based) that makes this worthwhile in these cases.

A good example of this is `DataStore`, which has multiple implementations which all need
to conform to the same interface.

## Plain JavaScript Initializers
This is the most common convention in the game engine code. A given module will export
an object with (usually just one) key which is the (capitalized) name of the "class".
While not actually using the JavaScript `class` convention, the exported function acts
as a constructor and when called returns an instance object just like a constructor. The
initializer is used to inject dependencies, such as repositories and configuration.

Examples of this are `Repository` and entities such as `Game`.


# Game Engine Architecture

This system is organized according to the 
[Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
and takes a good amount of inspiration from the [Dev-Mastery Example Project](https://github.com/dev-mastery/comments-api)
and [Video](https://www.youtube.com/watch?v=CnailTcJV_U). 

See the README in _engine/_ for more details on each part.


# Game Definitions


# View

Views are expected to take a game state and render it for the user. They also need
to accept user input and translate it to a generic representation.

See the README in _view/_ for more details.


# Webpack Builds