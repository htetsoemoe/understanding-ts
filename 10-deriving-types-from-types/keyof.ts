type User = {
    name: string;
    age: number;
}

type UserKey = keyof User

let validKey: UserKey

validKey = 'name'
validKey = 'age'

function getProp<T extends object, K extends keyof T>(obj: T, key: K) {
    const val = obj[key]

    if (val === undefined || val === null) {
        return new Error('Accessing undefined or null value.')
    }

    return val
}

const data = {
    id: 1,
    isStored: false,
    value: [1, 2, 3]
}
const id = getProp(data, 'id')
const isStored = getProp(data, 'isStored')
const value = getProp(data, 'value')

const user = {
    name: 'Anna',
    age: 30,
}
const employeeName = getProp(user, 'name')
