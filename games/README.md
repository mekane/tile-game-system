# Game Definitions

Each subdirectory is a unique game definition, which can include scenarios 
(lists of encounters), additional rules and actions, customized styles, and
additional UI elements.

To build a game you need an adapter, which provides access to the use cases,
and you need a view. The "main" module connects these two together with an event
loop, which sends actions from the UI to the game core via the adapter, gets the
updated game state, and renders that with the view.

Styles are customized by simply including CSS stylesheets to override the base styles.
Additional UI elements can be added via the html of index.html

Custom rules and actions must be defined in JavaScript and passed into the main module
at initialization.
