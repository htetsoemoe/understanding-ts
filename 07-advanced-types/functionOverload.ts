function getLength(val: string | any[]) {
    if (typeof val === "string") {
        const numberOfWords = val.split(" ").length
        return `${numberOfWords} words`
    }
    return val.length
}

const numOfWords = getLength('Does this work?')
const numItems = getLength(['Books', 'Guitar'])
