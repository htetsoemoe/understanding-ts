interface Todo {
    title: string,
    description: string,
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>): Todo { // Partial makes all properties optional
    return {...todo, ...fieldsToUpdate}
}

const todo1: Todo = {
    title: 'Learn TypeScript',
    description: 'Learn TypeScript in depth',
}

const updatedTodo = updateTodo(todo1, {
    description: 'Learn TypeScript in depth - updated',
})

console.log(updatedTodo)