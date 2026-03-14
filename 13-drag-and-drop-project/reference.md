## Commands
```
tsc -w
```

## Project Logic and Flow

This project builds a small project-management UI from HTML templates and TypeScript classes. The main runtime flow starts in [`src/app.ts`](d:\understanding-ts\13-drag-and-drop-project\src\app.ts), where three objects are created:

- `new ProjectInput()`
- `new ProjectList('active')`
- `new ProjectList('finished')`

These instances wire the form and the two project lists into the DOM.

## High-Level Flow

1. The browser loads [`index.html`](d:\understanding-ts\13-drag-and-drop-project\index.html) and then executes `dist/app.js`.
2. `ProjectInput` clones the `#project-input` template and inserts the form into `#app`.
3. Two `ProjectList` instances clone the `#project-list` template and create:
   - `active-projects`
   - `finished-projects`
4. When the form is submitted, input values are collected and validated.
5. If validation passes, a new project object is added to the shared `ProjectState`.
6. `ProjectState` notifies every registered listener.
7. Both project lists receive the updated project array and re-render their `<li>` items.

## Core Pieces

### 1. `ProjectState`

`ProjectState` is the central data store for the app.

- It uses the singleton pattern through `static getInstance()`.
- It keeps:
  - `listeners`: functions to call whenever data changes
  - `projects`: the current project objects
- `addProject(title, description, numOfPeople)` creates a project object and pushes it into `projects`.
- After adding a project, it loops over all listeners and passes a copy of the projects array using `slice()`.

Why this matters:
- UI classes do not own the data.
- State changes happen in one place.
- Any UI section can subscribe and react when data changes.

### 2. `ProjectInput`

`ProjectInput` is responsible for the form.

Responsibilities:
- Clone the `#project-input` template
- Read form field values
- Validate user input
- Submit valid projects to `ProjectState`
- Clear the form afterward

Important methods:

- `configure()`
  - attaches the `submit` event listener
- `gatherUserInput()`
  - reads `title`, `description`, and `people`
  - builds validation objects
  - returns `[title, description, people]` if valid
  - otherwise shows an alert
- `submitHandler(event)`
  - prevents default form submission
  - gets validated input
  - sends it to `projectState.addProject(...)`
  - clears the form

### 3. `ProjectList`

`ProjectList` is responsible for rendering a project section.

Each instance:
- clones the `#project-list` template
- gets a `type` of either `'active'` or `'finished'`
- inserts itself into the DOM
- subscribes to `projectState`

When state changes:
- the listener receives the full projects array
- `assignedProjects` is updated
- `renderProjects()` appends `<li>` elements to that list

Current behavior:
- both `active` and `finished` lists receive the same projects
- there is no filtering by status yet

## Validation Logic

The `Validatable` interface defines possible validation rules:

- `required`
- `minLength`
- `maxLength`
- `min`
- `max`

The `validate()` function checks the provided rules and returns `true` or `false`.

Current form rules:
- `title`: required
- `description`: required and minimum length of `5`
- `people`: required, between `1` and `50`

## `autobind` Decorator

The `@autobind` decorator is used on `submitHandler`.

Purpose:
- it automatically binds `this` to the class instance
- this avoids losing context when the method is passed as an event callback

Without it, `this.element.addEventListener('submit', this.submitHandler)` would not reliably point to the `ProjectInput` instance.

## DOM Template Usage

The HTML uses `<template>` elements so the structure can be defined once and cloned in TypeScript.

Templates:
- `#project-input`: the form
- `#project-list`: the list section
- `#single-project`: declared, but not used yet in the current TypeScript code

This keeps HTML structure separate from rendering logic.

## Important Note About Drag and Drop

Despite the folder name, the current code does not yet implement drag-and-drop logic.

Missing pieces would normally include:
- drag event interfaces
- draggable project items
- drop targets for active/finished columns
- project status switching when an item is dropped

So the current project is best described as:
- template-based rendering
- singleton state management
- form input and validation
- reactive list updates

not a full drag-and-drop workflow yet.
