# Tile App Game

This system is organized according to the 
[Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
and takes a good amount of inspiration from the [Dev-Mastery Example Project](https://github.com/dev-mastery/comments-api)
and [Video](https://www.youtube.com/watch?v=CnailTcJV_U). 

## Entities

The entities use a pseudo-class style, where raw data from a repository
can be passed to the corresponding entity class to get back an object
that has convenience methods on it. The data is automatically checked
against the JSON schema.

The entities keep their data private and have methods to mutate their state.
These methods will throw errors if their arguments or bad or something is wrong.

## Use Cases

Each use case returns an initializer function which is used to inject
it with the repositories it needs. These are always passed in as an
object. The return value of that function is a function that can be used
to execute the use case. These use case functions always just take plain
data as their arguments. They always return an object with a status and
some data, and should never throw errors.
