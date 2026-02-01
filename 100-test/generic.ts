const identity = <T>(value: T): T => {
    return value    
}

console.log(identity("Identity"))

console.log(identity(123))


const successResponse = <T>(data: T): {success: boolean, data: T } => {
    return {
        success: true,
        data: data
    }
}

successResponse({id: 1, name: 'Joe', age: 25})

successResponse("success")


// Generic Type
type MyResponse<T> = {
    success: boolean;
    data: T;
}

const numberRes: MyResponse<number> = {
    success: true,
    data: 10,
}