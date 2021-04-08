# Views

Views are environment specific, meaning they implement the UI for a given delivery 
mechanism / kind of user interface. So a mobile app, a console app or a web page view
would each be a separate implementation of a view.

Views are expected to follow a reactive cycle, where they receive a new game state and
render / update the complete view for the user, which can happen at any time. And they
need to handle user input and send messages back to the game in a generic form.

## Browser View
The view is reactive in style, and written using [Snabbdom](https://github.com/snabbdom/snabbdom)
The code 