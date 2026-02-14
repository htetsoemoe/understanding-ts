// function logger(target: any, ctx: ClassDecoratorContext) {
//     console.log('logger decorators');
//     console.log(target);
//     console.log(ctx);
// }

// @logger
// class User {
//     name = 'Bob';

//     greet() {
//         console.log(`Hi, I am ${this.name}`);
//     }
// }

/**
$ node ./firstDecorator.js
logger decorators
[class User]
{
  kind: 'class',
  name: 'User',
  metadata: undefined,
  addInitializer: [Function (anonymous)]
}
 */

// logger accepts any number of constructor arguments
function alogger<T extends new (...args: any[]) => any>( 
    target: T, 
    ctx: ClassDecoratorContext
) {
    console.log('logger decorators');
    console.log(target);
    console.log(ctx);

    return class extends target {
        age = 35;
    }
}

@alogger
class User {
    name = 'Bob';

    greet() {
        console.log(`Hi, I am ${this.name}`);
    }
}

const user = new User()
console.log(user);
user.greet()

/**
$ node ./firstDecorator.js
logger decorators
[class User]
{
  kind: 'class',
  name: 'User',
  metadata: undefined,
  addInitializer: [Function (anonymous)]
}
User { name: 'Bob', age: 35 }
Hi, I am Bob
 */