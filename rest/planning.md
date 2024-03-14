```mermaid
classDiagram
class Option {
    name
    label
    value
}

class Collection {
    name
    roleIds
    routes [{
        method
        path
        roleIds
    }]
}

class Writing {
    name
    label
    value
}
```

options

categories [novel, story, poem, not-story, anecdote]
