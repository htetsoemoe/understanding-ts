## Commands

```bash
tsc -w
```

## Project Overview

This project builds a small project-management UI with:

- HTML `<template>` elements
- TypeScript classes
- a shared singleton state store
- form validation
- drag-and-drop between `Active` and `Finished` project lists

The app starts from `src/app.ts` and renders into the `#app` element in `index.html`.

## Main Runtime Flow

When `dist/app.js` runs, these objects are created:

- `new ProjectInput()`
- `new ProjectList('active')`
- `new ProjectList('finished')`

This creates:

- the form at the top
- one list for active projects
- one list for finished projects

## Program Flow

### 1. App startup

The browser loads `index.html`, then loads `dist/app.js`.

At the bottom of `src/app.ts`, three class instances are created:

- `ProjectInput`
- `ProjectList('active')`
- `ProjectList('finished')`

Each class extends the generic `Component<T, U>` base class, which:

- finds a `<template>`
- clones it with `document.importNode(...)`
- attaches the new element into the host element

### 2. User adds a project

`ProjectInput` handles form submission.

Flow:

1. The user enters `title`, `description`, and `people`.
2. `submitHandler(event)` runs on form submit.
3. `gatherUserInput()` reads the values.
4. `validate()` checks the rules.
5. If valid, `projectState.addProject(...)` creates a new `Project`.
6. The new project is added with status `ProjectStatus.Active`.
7. `ProjectState` calls all registered listeners.

### 3. Lists react to state updates

Each `ProjectList` registers a listener with `projectState.addListener(...)`.

When state changes:

- the active list keeps only projects with `ProjectStatus.Active`
- the finished list keeps only projects with `ProjectStatus.Finished`
- `renderProjects()` clears the current `<ul>`
- a new `ProjectItem` is created for each assigned project

This makes the UI reactive: the DOM is rebuilt from the latest state whenever data changes.

## Core Classes

### `Project`

Represents one project item.

Properties:

- `id`
- `title`
- `description`
- `people`
- `status`

### `ProjectState`

This is the shared app state.

Responsibilities:

- store all project objects
- add new projects
- move projects between `Active` and `Finished`
- notify UI listeners after every change

Important methods:

- `addProject(title, description, numOfPeople)`
  - creates a new project with `Active` status
- `moveProject(projectId, newStatus)`
  - finds the project by `id`
  - updates its status
  - notifies listeners if the status changed
- `updateListeners()`
  - sends a copied projects array to every listener

This uses the singleton pattern through `ProjectState.getInstance()`, so every component works with the same shared data source.

### `ProjectInput`

Handles the form UI and validation.

Responsibilities:

- render the input form
- listen for `submit`
- collect field values
- validate input
- add a new project to state
- clear the form

Important methods:

- `configure()`
- `gatherUserInput()`
- `clearInputs()`
- `submitHandler(event)`

### `ProjectList`

Represents one drop area and one rendered project list.

Each instance is created with:

- `'active'`
- or `'finished'`

Responsibilities:

- render the section title and `<ul>`
- subscribe to state updates
- filter projects by status
- render `ProjectItem` instances
- act as a drag target

Important methods:

- `configure()`
- `renderContent()`
- `renderProjects()`
- `dragOverHandler(event)`
- `dropHandler(event)`
- `dragLeaveHandler(event)`

### `ProjectItem`

Represents a single draggable `<li>` project.

Responsibilities:

- render the project title, people count, and description
- make the item draggable
- place the project `id` into `dataTransfer` during drag start

Important methods:

- `dragStartHandler(event)`
- `dragEndHandler(event)`
- `renderContent()`

## Drag-and-Drop Feature

Drag-and-drop is implemented with two interfaces:

- `Draggable`
- `DragTarget`

### `Draggable`

Implemented by `ProjectItem`.

Methods:

- `dragStartHandler(event: DragEvent)`
- `dragEndHandler(event: DragEvent)`

Behavior:

- when dragging starts, the project id is stored with:
  - `event.dataTransfer!.setData('text/plain', this.project.id)`
- `effectAllowed` is set to `'move'`

This allows the drop target to know which project was dragged.

### `DragTarget`

Implemented by `ProjectList`.

Methods:

- `dragOverHandler(event: DragEvent)`
- `dropHandler(event: DragEvent)`
- `dragLeaveHandler(event: DragEvent)`

Behavior:

- `dragOverHandler(...)`
  - checks whether the drag payload contains `'text/plain'`
  - calls `event.preventDefault()`
  - adds the `droppable` CSS class to highlight the target list
- `dropHandler(...)`
  - reads the dragged project id from `dataTransfer`
  - calls `projectState.moveProject(...)`
  - removes the highlight class
- `dragLeaveHandler(...)`
  - removes the highlight if the cursor leaves the drop zone

## Drag-and-Drop Program Flow

This is the actual flow when moving a project from `Active` to `Finished`:

1. The user starts dragging a `ProjectItem`.
2. `dragStartHandler()` stores the project id in `dataTransfer`.
3. The dragged item is moved over the `Finished` list.
4. `ProjectList.dragOverHandler()` runs repeatedly.
5. Because the payload contains `'text/plain'`, `event.preventDefault()` allows dropping.
6. The `droppable` CSS class is added to the target `<ul>`.
7. The user releases the mouse.
8. `dropHandler()` reads the project id.
9. `projectState.moveProject(projectId, ProjectStatus.Finished)` updates the project status.
10. `ProjectState` notifies all listeners.
11. The active list re-filters and removes that project.
12. The finished list re-filters and renders that project.

The reverse flow is the same when dragging from `Finished` back to `Active`.

## Validation Logic

The `Validatable` interface supports:

- `required`
- `minLength`
- `maxLength`
- `min`
- `max`

The `validate()` function applies these checks and returns `true` or `false`.

Current rules:

- `title`: required
- `description`: required, minimum length `5`
- `people`: required, minimum `1`, maximum `5`

## `autobind` Decorator

The `@autobind` decorator is used so event handler methods keep the correct `this` value.

This matters for callbacks such as:

- `submitHandler`
- `dragStartHandler`
- `dragOverHandler`
- `dropHandler`
- `dragLeaveHandler`

Without `@autobind`, `this` would often refer to the DOM element instead of the class instance.

## Template Structure

The HTML templates used by the app are:

- `#project-input`
- `#project-list`
- `#single-project`

Usage:

- `#project-input` creates the form
- `#project-list` creates each project section
- `#single-project` creates each draggable `<li>`

This keeps structure in HTML and behavior in TypeScript.
