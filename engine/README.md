# Game Engine

This directory contains generic application components for running a tile-based game. 
The parts are listed from "inner-most" going outwards. Each layer wraps the inner and
hides internal details, while exposing the appropriate amount to the next layer up.


## Entities

Track the core data structures, state, actions and state transitions that can take 
place during a game. All of the core logic for running a game lives here.

The entities use a pseudo-class style, where raw data from a repository
can be passed to the corresponding entity class to get back an object
that has convenience methods on it. The data is automatically checked
against the JSON schema.

The entities keep their data private and have methods to mutate their state.
These methods will throw errors if their arguments or bad or something is wrong.

### Schema
The _schema_ directory contains JSON schema to define and validate various entities
and data structures in the system.


## Use Cases

Wrap the entities and define operations that can take place. They are injected
with repositories to handle fetching and saving data. Their purpose is to expose
specific game actions in easily-invoked packages, which are made available to the
user interface via adapters.

Each use case returns an initializer function which is used to inject
it with the repositories it needs. These are always passed in as an
object. The return value of that function is a function that can be used
to execute the use case. These use case functions always just take plain
data as their arguments. They always return an object with a status and
some data, and should never throw errors.


## Repositories
The _repository_ directory has code for persisting entities so that games can stick
around and be resumed later.


## Adapters
There are _adapters_ for connecting the internals of the application to an external 
transport mechanism.


At the top level there are a few utility type source files with miscellaneous code.
Virtually all code in this directory is testable, and should be covered by unit tests.
Additions and modifications are made using TDD - write the test first and then make the
change.
