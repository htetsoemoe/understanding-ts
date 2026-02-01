let names: Array<string> = ["Anna", "Bob"]

type DataStore<T> = {
    [key: string]: T
}

let store: DataStore<string | boolean> = {}
store.name = 'Anna'
store.isActive = true

function merge<T>(a: T, b: T) {
    return [a, b]
}

// const ids = merge<number>(1, 2)
const ids = merge(1, 2)

function mergeObj<T extends object, U extends object>(a: T, b: U) {
    return {...a, ...b}
}

const merged = merge({name: 'Anna'}, {age: 27})

class User<T> {
    constructor(id: T) { }
}

const user = new User('001')
const bob = new User(101)
