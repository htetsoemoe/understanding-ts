// Template Literal Types

const mainUserName = "Anna"
const greeting = `Hello, ${mainUserName}! Welcome back.`

type ReadPermissions = 'no-read' | 'read'
type WritePermissions = 'no-write' | 'write'

type FilePermissions = `${ReadPermissions}-${WritePermissions}`

type DataFile = {
    data: string,
    permissions: FilePermissions
}

type DataFileEventNames = `${keyof DataFile}Changed`

type DataFileEvents = {
    [Key in DataFileEventNames]: () => void
}

const myEventHandlers: DataFileEvents = {
    dataChanged: () => {
        console.log('Data changed event triggered.')
    },
    permissionsChanged: () => {
        console.log('Permissions changed event triggered.')
    }
}

myEventHandlers.dataChanged()
myEventHandlers.permissionsChanged()