// const appUser = {
//     name: 'Anna',
//     age: 35,
//     permission: [{id: 'p1', title: 'admin', description: 'admin access'}],
// }


// type AppUser = typeof appUser


type AppUser = {
    name: string,
    age: number,
    permissions: {
        id: string,
        title: string,
        description: string,
    } []
}

type Perms = AppUser['permissions']
type Perm = Perms[number] // Use 'number' to extract the element type from an array // object

const anna: AppUser = {
    name: 'Anna',
    age: 35,
    permissions: [
        {id: 'p1', title: 'admin', description: 'admin access'},
        {id: 'p2', title: 'user', description: 'user access'},
    ]
}

// const firstPerm: Perm = anna.permissions[0]
// const secondPerm: Perm = anna.permissions[1]

const appUser: Perm = {
    id: "01",
    title: "basic user",
    description: "basic user access"
}

const firstPerm: Perm = anna.permissions[0]

const firstPermId: Perm['id'] = 'a1'
const firstPermTitle: Perm['title'] = 'super-admin'
const firstPermDesc: Perm['description'] = 'super admin access'

const firstObjectInPermsArray: Perms[0] = {id: 'p1', title: 'admin', description: 'admin access'}
const secondObjectInPermsArray: Perms[1] = {id: 'p2', title: 'user', description: 'user access'}
