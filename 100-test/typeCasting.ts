type User = {
    id: number;
    name: string;
}

// JSON.parse return 'any' type
const responseData = JSON.parse('{"id": 1, "name": "Anna"}')

const user = responseData as User;
console.log(user)