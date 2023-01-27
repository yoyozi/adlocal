# Node and Express Knowledge base

## Node

To run a cli with node:

```
node
```

Hit tab to see all variables. \_ refers to last output/result. If we type String and then tab we can see all methods related to String. cntrl D to exit.

```
> String.
String.__proto__             String.hasOwnProperty
String.isPrototypeOf         String.propertyIsEnumerable
String.toLocaleString        String.valueOf

String.apply                 String.arguments
String.bind                  String.call
String.caller                String.constructor
String.toString

String.fromCharCode          String.fromCodePoint
String.length                String.name
String.prototype             String.raw
```

## npm

### Versions

The node package manager holds many modules/packages called using : npm i package -D

D: only a development package

```
  "devDependencies": {
    "nodemon": "^1.18.11"
  }
```

The versioning is as follows:

1: major version, will usually break if using 1 and going to 2
18: minor version, is an updated version but maintains backward capability
11: these are patches

### Updating

```
npm outdated // We can see which packages are outdated
npm i slugify@1.18.12   // Installs the patched version 12 from 11
```

To update to newer minor releases use ^1.18.11, if you want to be safer then you can use: ~1.18.11. This means it will only get patch releases. Using \*1.18.11 gives us he ability to update all versions: that is patches, minor and major.

Example

```
npm outdated

// we get
Package  Current  Wanted  Latest  Location              Depended by
slugify    1.4.7   1.4.7   1.6.5  node_modules/slugify  Express-Schmedman
```

We can update to 1.4.7 when we run:

```
npm update slugify
```

To install a particular version

```
npm i slugify@1.4

// gives us
  "dependencies": {
    "slugify": "~1.3.4"
  },
```

### Sharing

**If you want to reconstruct the project you must share both the package.json and the package-lock.json**

## A BASIC Node server : Routing Requests

```
const http = require("http");
const url = require("url");

const server = http.createServer(function (req, res, next) {
    //console.log(req.url);
    let parsedURL = url.parse(req.url, true);
    let path = parsedURL.pathname;
    // parsedURL.pathname  parsedURL.query
    // standardize the requested url by removing any '/' at the start or end
    // '/folder/to/file/' becomes 'folder/to/file'
    // if it starts with one or more / or has / at the end replace with "" nought
    path = path.replace(/^\/+|\/+$/g, "");
    console.log(path);
    let qs = parsedURL.query;
    let headers = req.headers;
    let method = req.method.toLowerCase();

    req.on("data", function () {
        console.log("got some data");
        //if no data is passed we don't see this messagee
        //but we still need the handler so the "end" function works.
    });
    req.on("end", function () {
        //request part is finished... we can send a response now
        console.log("send a response");
        //we will use the standardized version of the path
        let route =
        // routes["notFound"]; gets sent back if its not found in the routes defined below
            typeof routes[path] !== "undefined" ? routes[path] : routes["notFound"];
        let data = {
            path: path,
            queryString: qs,
            headers: headers,
            method: method
        };
        //pass data incase we need info about the request
        //pass the response object because router is outside our scope
        route(data, res);
    });
});

server.listen(1234, function () {
    console.log("Listening on port 1234");
});

//define functions for the different Routes
//This object and the functions could be defined in another file that we import
//Each route has a function that takes two parameters
//data: the info about the request
//callback: the function to call to send the response
let routes = {
    kenny: function (data, res) {
        // this function called if the path is 'kenny'
        let payload = {
            name: "Kenny"
        };
        let payloadStr = JSON.stringify(payload);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200);
        res.write(payloadStr);
        res.end("\n");
    },
    cartman: function (data, res) {
        // this function called if the path is 'cartman'
        let payload = {
            name: "Cartman"
        };
        let payloadStr = JSON.stringify(payload);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200);
        res.write(payloadStr);
        res.end("\n");
    },
    "kenny/is/mysterion": function (data, res) {
        //this function called if path is 'kenny/is/mysterion'
        let payload = {
            name: "Mysterion",
            enemy: "The Coon",
            today: +new Date()
        };
        let payloadStr = JSON.stringify(payload);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200);
        res.write(payloadStr);
        res.end("\n");
    },
    notFound: function (data, res) {
        //this one gets called if no route matches
        let payload = {
            message: "File Not Found",
            code: 404
        };
        let payloadStr = JSON.stringify(payload);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(404);

        res.write(payloadStr);
        res.end("\n");
    }
};
```

## Exporting / Importing modules

### How node decides which module to load

1. Starts with core modules
2. If begins with ./ or ../ then imports developer module
3. If no file found tries in the local file itself
4. Else goes to node modules

### What happens when we require a module

The modules go through a wrapping that keeps them private and also gives us access to the following:

```
require:    // function to require modules
module:     // referance to the current module
exports:    // a referance to module exports used to export objects from a module
__filename: // absolute path to the module
__dirname:  // directory name of the current module

(function exports require module __filename __dirname {
    // module code lives here
}
```

### Example of module loading:

file: modules.js

```
console.log(arguments);

// Now the output is: ➜  final node modules.js
[Arguments] {
  '0': {},
  '1': [Function: require] {
    resolve: [Function: resolve] { paths: [Function: paths] },
    main: Module {
      id: '.',
      path: '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/2-how-node-works/final',
      exports: {},
      filename: '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/2-how-node-works/final/modules.js',
      loaded: false,
      children: [],
      paths: [Array]
    },
    extensions: [Object: null prototype] {
      '.js': [Function (anonymous)],
      '.json': [Function (anonymous)],
      '.node': [Function (anonymous)]
    },
    cache: [Object: null prototype] {
      '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/2-how-node-works/final/modules.js': [Module]
    }
  },
  '2': Module {
    id: '.',
    path: '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/2-how-node-works/final',
    exports: {},
    filename: '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/2-how-node-works/final/modules.js',
    loaded: false,
    children: [],
    paths: [
      '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/2-how-node-works/final/node_modules',
      '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/2-how-node-works/node_modules',
      '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/node_modules',
      '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/node_modules',
      '/home/craig/000-DEVonCorgi/KB/z-projects/node_modules',
      '/home/craig/000-DEVonCorgi/KB/node_modules',
      '/home/craig/000-DEVonCorgi/node_modules',
      '/home/craig/node_modules',
      '/home/node_modules',
      '/node_modules'
    ]
  },
  '3': '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/2-how-node-works/final/modules.js',
  '4': '/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/2-how-node-works/final'
}
```

The actual wrapper we can see:

```
console.log(require("module").wrapper);

➜  final node modules.js
[
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
]
```

#### Example 1 (exporting single module as Class)

file: test-module-1.js

```
class Calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
}

module.exports = Calculator;
```

execution code in modules.js

```
const C = require("./test-module-1");
const calc1 = new C();
console.log(calc1.add(2, 5));
```

We can call it anything we want, we called it C (is a class so we use uppercase)

#### Example 2 (exporting single module as a Class expression)

file: test-module-1.js

```
module.exports = class {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
};
```

execution code in modules.js

```
const C = require("./test-module-1");
const calc1 = new C();
console.log(calc1.add(2, 5));
```

These are the same. Get (7)

#### Example 3 (adding properties to the exports)

file: test-module-2.js

```
exports.add = (a, b) => a + b;
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => a / b;
```

execution code in modules.js

```
const calc2 = require("./test-module-2");
console.log(calc2.multiply(2, 5));
```

or destructuring the object:

```
const { add, multiply, divide } = require("./test-module-2");
console.log(multiply(2, 5));
```

We only have to import those which we need and not all three of them.

#### Example 4 Caching

file: test-module-3.js

```
console.log("Hello from the module");

module.exports = () => console.log("Log this beautiful text 😍");
```

execution code in modules.js

```
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
```

This returns the function called 3 times but the high level function only once!!

```
➜  final node modules.js
Hello from the module
Log this beautiful text 😍
Log this beautiful text 😍
Log this beautiful text 😍:
```

## Dealing with asynchrounous code

This was traditionally dealt with in javascript using call back functions but now we have two new ways:

### Promisses and Async/Await

Explanation by application: using a public API (https://dog.ceo/dog-api/) we are going to get random images of a dog with the breed we specify in the file dog.txt. We use a package called superagent. Url we need to hit as in docs is: https://dog.ceo/api/breed/${breed}/images/random.

File: dog.txt (change to see a random image of this dog, get list of breeds : https://dog.ceo/api/breeds/list/all)

```
retriever
```

file: index.js

```
const fs = require('fs');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed: ${data}`);
})
```

Run it: node index.js

```
➜  starter node index.js
Breed: retriever
```

Lets setup node with npm:

```
npm init -y
```

Lets get the superagent package and require it in the code

```
npm i superagent

// and in index.js
const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Bree: ${data}`);
})
```

We want to now use the API on: https://dog.ceo/api/breed/${breed}/images/random and get the random image

```
const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed: ${data}`);

    superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
        console.log(res.body);
    })

});
```

we run: node index.js

```
➜  starter node index.js
Breed: retriever
{
  message: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5876.jpg',
  status: 'success'
}
```

One can see from the above returned object we have a message as the image and the status as status.

```
const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed: ${data}`);

    superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)
        .end((err, res) => {

            if (err) return console.log(err.message);;

            console.log(res.body.status);

            fs.writeFile('dog-img.txt', res.body.message, err => {
                console.log('Saved to file');
            });
    });
});
```

And in the dog-img.txt:

```
https://images.dog.ceo/breeds/retriever-flatcoated/n02099267_5551.jpg
```

**This (the index.js above) is callback HELL! We should fix this.**

We have a callback within a callback within a callback.

Superagent has PROMISSES build in we just need to use them. We will however have to build our promisses in the future ourselves.

```
superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)

```

This is a promiss and as stated is built into superagent. We just need to consume it in a way that caters for the returned data after the promiss.

So the way to write it so as to expect the returned err or message is: **FIRST CHANGE**

```
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed: ${data}`);

    superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)
        .then(res => {
            if (err) return console.log(err.message); // if error returnand console.log(err.messa..

            console.log(res.body.status);

            fs.writeFile('dog-img.txt', res.body.message, err => {
                console.log('Saved to file');
        });
    });
});
```

The above doesnt handle the case where the breed name is spelt wrong. So we need to handle this case. To do this we use **catch: SECOND CHANGE**

```
const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed: ${data}`);

    superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)
        .then(res => {
            if (err) return console.log(err.message); // if error returnand console.log(err.messa..

            fs.writeFile('dog-img.txt', res.body.message, err => {
               if (err) return console.log(err.message);
               console.log('Saved to file')
            })
        })
        .catch(err => {
            console.log(err.message);
    });
});
```

Now we get:

```
➜  starter node index.js
Breed: poodlen
Not Found
```

We can even do better: **we can make the readFile a function that take in the "file" and use a PROMISS!.**

**We can also make the writeFile a PROMISE function.**

```
**const readFilePromiss = file => {
    return new Promise((resolve, reject) => {**
        fs.readFile(file, (err, data) => {
            if (err) reject('I could not find that file!');
            resolve(data);
        });
    });
}

const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) reject('Could not write file');
            resolve('success'); // we dont have to return anything as there is no data to write
        });
    });
};
```

The superagent returns a PROMISE already but we need to add the return to the front of it.

```
Promise.then()
Promise.then()
Promise.then()
.catch()
```

**The FINAL two PROMMISSES with the returned superagent**

```
const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
            if (err) reject('I could not find that file!');
            resolve(data);
        });
    });
};

const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) reject('Could not write file');
            resolve('success'); // we dont have to return anything as there is no data to write
        });
    });
};

readFilePromise(`${__dirname}/dog.txt`)
    .then(data => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    })
    .then((res) => {
        console.log(res.body.message);
        return writeFilePromise('dog-img.txt', res.body.message);
    })
    .then(() => {
        { console.log('Randon dog image saved to file') }
    })
    .catch((err) => {
        console.log(err.message)
});

```

We can even do better with !

#### Async / Await (New in ES8)

We add the async keyword in our function and then the await in front of our promise. We then tiw it up with a try and catch the exception.

```
const getDogPic = async () ={
    try {
    // Code goes here
    } catch(err) {
        console.log(err.message)
}
```

Now we can put it all together:

```
const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject('I could not find that file!');
            resolve(data);
        });
    });
};

const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) reject('Could not write file');
            resolve('success'); // we dont have to return anything as there is no data to write
        });
    });
};

// Async and Await

const getDogPic = async () => {
    try {
        const data = await readFilePromise(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);

        const image = await writeFilePromise('dog-img.txt', res.body.message);

        { console.log('Randon dog image saved to file') }
    } catch (err) {
        console.log(err);
    }

};

// Now we need to call it
getDogPic(0);
```

#### Returning values from async functions

Take this example: it wont work as this is non blocking REMEMBER

```
console.log('Started getting picture');
getDogPic(0);
console.log('Got pictures');

// what is returned, in the wrong order:

➜  starter node index.js
Started getting picture
Got pictures
Breed: poodle
https://images.dog.ceo/breeds/poodle-toy/n02113624_1178.jpg
Randon dog image saved to file
```

We need to run it like this to get the order correct: however it will always work even when there is an error

```
const getDogPic = async () => {
    try {
        const data = await readFilePromise(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);

        const image = await writeFilePromise('dog-img.txt', res.body.message);

        { console.log('Randon dog image saved to file') }
    } catch (err) {
        console.log(err);
    }
    return '2: Ready'
};

// Now we need to call it
console.log('1. Started getting picture');
getDogPic().then(x => {
    console.log(x);
    console.log('3. Got pictures');
});
```

To get around the errors not showing we can do this:

```
const getDogPic = async () => {
    try {
        const data = await readFilePromise(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);

        const image = await writeFilePromise('dog-img.txt', res.body.message);

        { console.log('Randon dog image saved to file') }
    } catch (err) {
        console.log(err);

        throw err; // marks the promiss as rejected

    }

    return '2: Ready'
};

// Now we need to call it
console.log('1. Started getting picture');
getDogPic()
    .then(x => {
    console.log(x);
    console.log('3. Got pictures');
    }).catch(err => {
        console.log('ERROR');
});
```

**However we are back to using async and then etc: not so great. There is a better way.
**

#### the Ife (imediately envoked function expression)

Using an ife we can get the result we are looking for:

```
const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject('I could not find that file!');
            resolve(data);
        });
    });
};

const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) reject('Could not write file');
            resolve('success'); // we dont have to return anything as there is no data to write
        });
    });
};

// Async and Await

const getDogPic = async () => {
    try {
        const data = await readFilePromise(`${__dirname}/dogg.txt`);
        console.log(`Breed: ${data}`);

        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);

        const image = await writeFilePromise('dog-img.txt', res.body.message);

        { console.log('Randon dog image saved to file') }
    } catch (err) {
        console.log(err);
        throw err; // marks the promiss as rejected
    }
    return '2: Ready'
};


(async () => {
    try {
        console.log('1. Started getting picture');
        const x = await getDogPic();
        console.log(x);
        console.log('3. Got pictures');
    } catch(err) {
        console.log('ERROR');
    };
})();
```

If we change the readfile name so it breaks:

```
➜  starter node index.js
1. Started getting picture
I could not find that file!
ERROR
```

If we change the breed to be invalid:

```
➜  starter node index.js
message: 'Breed not found (master breed does not exist)',
```

If it all works as it should:

```
➜  starter node index.js
1. Started getting picture
Breed: african
https://images.dog.ceo/breeds/african/n02116738_4335.jpg
Randon dog image saved to file
2: Ready
3. Got pictures
```

#### Three images at once asynchronously

Promis.all

```
const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file 😢');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject('Could not write file 😢');
      resolve('success');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    **const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map(el => el.body.message);
    console.log(imgs);**

    await writeFilePro('dog-img.txt', imgs.join('\n'));
    console.log('Random dog image saved to file!');
  } catch (err) {
    console.log(err);

    throw err;
  }
  return '2: READY 🐶';
};

(async () => {
  try {
    console.log('1: Will get dog pics!');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics!');
  } catch (err) {
    console.log('ERROR 💥');
  }
})();
```

And the result:

```
➜  final node index.js
1: Will get dog pics!
Breed: labrador
[
  'https://images.dog.ceo/breeds/labrador/n02099712_2228.jpg',
  'https://images.dog.ceo/breeds/labrador/n02099712_3500.jpg',
  'https://images.dog.ceo/breeds/labrador/n02099712_5648.jpg'
]
Random dog image saved to file!
2: READY 🐶
3: Done getting dog pics!
```

## Dot env with Node

### Files

.env
server-env.js
package.json

.env

```
HOST=localhost
PORT=1234
```

server-env.js

```
const http = require("http");

require("dotenv").config(); // File can go inside the () however default is .env

let server = http.createServer( (req, res) =>{
    console.log("Thanks for batting");
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('You Rock');
});

// The dotenv allows us to assign from process.env as they are read in as env vars
let port = process.env.PORT;
let host = process.env.HOST

server.listen(port, host, () => {
    console.log(`Server is listening on ${host}:${port}`);
});
```

package.json

```
{
  "name": "dotenv",
  "version": "1.0.0",
  "description": "How to handle dotenv in node",
  "main": "server-env.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^8.2.0"
  }
}
```

## Node Server crash course

### Basic server and files

```
{
  "name": "node-crash-course",
  "version": "1.0.0",
  "description": "traversey",
  "main": "index.js",
  "scripts": {
    "start": "node index",
    "dev": "nodemon index"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "uuid": "^8.1.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.4"
  }
}
```

```
// Require what is needed from Node
const http = require('http');
const path = require('path');
const fs = require('fs');

// Create a server object
const server = http.createServer((req, res) => {

    // To test what is being requested lets console log the url
    // console.log(req.url);
    // GIVES back / localhost:5000/about SENDS back /about.html

    // Make public folder with index.html and 404.html and about.html
    // Using Ternery handle the req filpath by
    // Getting the filePath
    // Build file path dynamically using ternary if / then index.html else give file asked for "req.url" whatever the file was called
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url );

    //console.log(filePath);
    //res.end();
    // SENDS back: /Users/craigleppan/Local/Local-Dev/www-dev/TUTS/NodeCrashCourse/public/about.html

    // So we need to return the correct content type to the browser to read
    // what was requested
    let extname = path.extname(filePath);
    //console.log(extname);
    // Sends back .html

    // // Intitial content type
    let contentType = 'text/html';

    // EVALUATE the extension using a switch (set) type
    switch (extname) {
       case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
        contentType = "image/jpg";
        break;
    }

    // Read the file requested
    fs.readFile(filePath, (err, content) => {
        if(err) {
            if(err.code == 'ENOENT') {
                // Page not found Add 404 html in public
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                   res.writeHead(200, { 'Content-Type': 'text/html' });
                   res.end(content, 'utf8');
                })
            } else {
                // Some server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
        // If successfull then return 200 as status code and return file with type set
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content,'utf8');
        }
    });
});

// Set the PORT number as variable/constant
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
```

### Events Emmiter

```
// The Eventys module
const EventEmitter = require('events');

// Create an emitter CLASS
class MyEmitter extends EventEmitter {}

// Initialise object NOT the same as the CLASS MyEmitter
const myEmitter = new MyEmitter();

// event listener
myEmitter.on('event', () => console.log('Event Fired'))

// to fire the event we pass it 'event'
myEmitter.emit('event');
```

### Logging and Logger

```
const EventEmitter = require('events');
const uuid = require('uuid'); // creates id's


//console.log(uuid.v4());

// create a Class that is an extension of eventEmitter
// this pertains to the CLASS

class Logger extends EventEmitter {
    log(msg) {
        // Call event
        this.emit('message', { id: uuid.v4(), msg});
    }
}

// export the created Logger
module.exports = Logger;
```

#### Logger

```
const Logger = require('./logger');

// Logger is a class so it needs to be instandtiated
const logger = new Logger();

// Then call Logger on message
logger.on('message', data => console.log('Called Listener on:', data));

logger.log('Helloooo there');
logger.log('Hey there');
logger.log('Moo there');
logger.log('Yu there');
```

### FS Demo

```
// File system module
const fs = require('fs');
const path = require('path');

// Asynchronously creates a directory
fs.mkdir(path.join(__dirname, '/test'), {}, function(err) {
    if(err) throw err;
    console.log('Folder created');
});

// Above but now using arrow functions
fs.mkdir(path.join(__dirname, '/test'), {}, (err) => {
    if(err) throw err;
    console.log('Folder created');
};

// You can open a file or use write to open and write to it
// fs.writeFile(file, data[, options], callback)
fs.writeFile(path.join(__dirname, '/test', 'hello.txt'), 'Hello this is the stuff I wrote into the file', (err) => {
    if (err) throw err;
    console.log('File open and written to');
});

// To append to the file
// fs.appendFile(path, data[, options], callback)
fs.appendFile(path.join(__dirname, '/test', 'hello.txt'), 'Hello this is the stuff I appended!', (err) => {
    if (err) throw err;
    console.log('File appended to');
});

// Make the file then append in the callback
fs.writeFile(path.join(__dirname, '/test', 'hello.txt'), 'Hello this is the stuff I wrote into the file.     ', (err) => {
    if (err) throw err;
    console.log('File open and written to');

    // And here in the callback add the append
    fs.appendFile(path.join(__dirname, '/test', 'hello.txt'), 'Hello this is the stuff I appended!', (err) => {
        if (err) throw err;
        console.log('File appended to');
    });
});

// To read a file
// fs.readFile(path[, options], callback)
fs.readFile(path.join(__dirname, '/test', 'hello.txt'), 'utf8', (err, data) => {
    if(err) throw err;
    console.log(data);
});


// Rename a file
// fs.rename(oldPath, newPath, callback)
fs.rename(path.join(__dirname, '/test', 'hello.txt'), path.join(__dirname, '/test', 'hellooo.txt'), (err) => {
         if (err) throw err;
         console.log('File renamed');
     });

```

### More on FS

Blocking and non blocking: index.js - to run use: node index.js

```
const fs = require('fs');

// BLOCKING / synchronous
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File written!');
```

## Callback hell

```
const fs = require('fs');

// Non-blocking, asynchronous way

fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  if (err) return console.log('ERROR! 💥');

  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log(data2);
    fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
      console.log(data3);

      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
        console.log('Your file has been written 😁');
      })
    });
  });
});
console.log('Will read file!');
```

### HTTP demo

```
// Bare minimum http server
const http = require('http');

// Create a server object
// in docs is: http.createServer([options][, requestListener])
http
    .createServer((req, res) => {
    // Write response
    res.write('Hello world'); // write() -- this just outputs to the browser
    res.end();
})
.listen(5000, () => console.log('Server running...'));
```

### OS Demo

```
const os = require('os');

// Get the platform
console.log(os.platform())

// Get the CPU Architeture
console.log(os.arch());

// CPU core info
console.log(os.cpus());

// Free memory
console.log(os.freemem());

// Total memory
console.log(os.totalmem());

// Home directory
console.log(os.homedir());

// Uptime
console.log(os.uptime()/3600);
```

### Path Demo

```
// Require the module first, its a core module so we domt have to install it
const path = require('path');

// Base file name
console.log(path.basename(__filename));
// output --- path_demo.js

console.log(__filename);
// out --- /Users/craigleppan/Local/Local-Dev/www-dev/TUTS/NodeCrashCourse/referance/path_demo.js

// Directory name
console.log(path.dirname(__filename));
//out --- /Users/craigleppan/Local/Local-Dev/www-dev/TUTS/NodeCrashCourse/referance

// File extension
console.log(path.extname(__filename));
// out --- .js

// Create path object
console.log(path.parse(__filename));

// Can access any part of this object
console.log(path.parse(__filename).base);
// out --- path_demo.js

// Can join paths
console.log(path.join(__dirname, 'test', 'hello.html'));
// out --- /Users/craigleppan/Local/Local-Dev/www-dev/TUTS/NodeCrashCourse/referance/test/hello.html
```

### URL Demo

```
const url = require('url');

const myURL = new URL('http://mywebsite.com/hello.html?id=109444&status=active');

// Get the serialised url
console.log(myURL.href);
console.log(myURL.toString()); // same

// get the hostname
console.log(myURL.hostname);
console.log(myURL.host); // gets port
console.log(myURL.pathname);
console.log(myURL.search); // returns object so

// we can also add parameters dynamically
myURL.searchParams.append('ABS', '123');
console.log(myURL.searchParams);

// Loop through params
myURL.searchParams.forEach((value, name) =>   console.log(`${value}: ${name}`));
```

## Express

### Why use it?

1. Higher level of abstraction
2. Handles complex routing
3. Allows rapid development
4. MVC architecture is possible

```
npm init
npm i express
```

Create the file app.js

```
const express = require('express')

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello World!',
        app: 'Natours'
    });
});

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('listening on port ' + port)
});
```

Output using Postman : get localhost:5000

```
{
    "message": "Hello World!",
    "app": "Natours"
}
```

### REST

Representational state transfer principals:

1. Seperate API into logical resources
2. Use HTTP methods
3. Expose structures resource based urls
4. Send data as json
5. **Be STATELESS**

http methods map well to the CRUD methods: create, read, update and delete

```
POST        /tours              Create
GET         /tours/7            Read
PUT         /tours/7            Update
PATCH       /tours/7            Update
DELETE      /tours/7            Delete

GET         /users/3/tours      possibilities are endless
DELETE      /users/3/tours/9    possibilities are endless
```

Install nodemon to ensure the system reads changes and reloads properly.

```
sudo npm i -g nodemon

// Edit the package.json file
 "scripts": {
    "start": "nodemon app.js"
  },

npm run start // Start nodemon
```

### GET

In our app.js we specify the route: get

```
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: { tours },
    });
});
```

### POST

We not only receive the data but write it to the file as a new object.

```
app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    // push into array
    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );
    // NB! not synchronous writeFileSyn as we dont want blocking.
});
```

### GET one

request params: if we console log the request params after sending localhost:5000/api/v1/tours/44 we get [ id: '44'] with the following config.

```
app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params);
    res.status(200).json({
        // status: 'success',
        // data: theId,
    });
});

// Or multiple
app.get('/api/v1/tours/:id/:x/:y', (req, res) => {
    console.log(req.params);
    res.status(200).json({
        // status: 'success',
        // data: theId,
    });
});
```

sent: localhost:5000/api/v1/tours/44/micky/mouse
got: { id: '44', x: 'micky', y: 'mouse' }

In the above if the url doenst match the route it will fail: UNLESS we use an optional parameter. So below the url can be: /api/v1/tours/22/33 or with the other /api/v1/tours/22/33/12

```
// Or multiple
app.get('/api/v1/tours/:id/:x/:y?', (req, res) => {
    console.log(req.params);
    res.status(200).json({
        // status: 'success',
        // data: theId,
    });
});
```

```
app.get('/api/v1/tours/:id', (req, res) => {
    // console.log(req.params);
    // NB the params ARE STRINGS just * 1 to get to Number
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (!tour) {
    //if (id > tours.length) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        })
    }

    res.status(200).json({
        status:'success',
        status: 'success',
        data: tour,
    });
});
```

### PATCH

To update the object when only receiving the items to be updated is a PATCH request. A PUT sends all items even those not being changed: we will use a PATCH.

### DELETE

## MIDDLEWARE

The middleware stack is whats installed as middleware in your app and its order in the stack is important. Everything is middleware even routers, they are usually first in the stack and only apply to a certain url.

The total cycle from beginning to end is called the request response cycle

```
REQUEST -->
Middleware1 -->
next()
Middleware2 -->
next()
RESPONSE -->
```

### Our own middleware function

To start milleware we call it using app.use. The next arguments req, res and next can be called anything but is usually just kept as req, res and next. If we dont call the next function we just hang so we need to call it to move on to the next part of middleware.

```
app.use((req, res, next) => {
    console.log('Hello from MW');
    next();
});

app.use((req, res, next) => {
    **req.requestTime = new Date().toISOString();**
    next();
});


const getAllTours = (req, res) => {
    **console.log(req.requestTime);**

    res.status(200).json({
        **requestedAt: req.requestTime,**
        status: 'success',
        result: tours.length,
        data: { tours },
    });
};
```

Each route brings the request response cycle to an end and we just return status code and message.

### MIDDLEWARE: MORGAN

Logging midlleware that can be used in production and hence not a dev dependancy plugin. We can replace the 'dev' with tiny and make it 'tiny' for a differant logger.

```
const morgan = require('morgan');

app.use(morgan('dev'));
```

## MOUNTING MULTIPLE ROUTES

Creating multiple routes: one per res. We can create one router per resource.

```
// Routes declaring
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/')
    .get(getAllTours)
    .post(createTour);

tourRouter.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

userRouter.route('/')
    .get(getAllUsers)
    .post(createUser);

userRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

// Routes for matching url's
app.use('/api/v1/tour', tourRouter)
app.use('/api/v1/users', userRouter)
```

Now we can move to seperate files just leaving the mounts in the calling file.

### BETTER FILE STRUCTURE

We create a routes folder and a userRouter.js file. We do the same for all resources. Then we import and export.

```
// app.js
const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes')

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('listening on port: ' + port);
});
```

The one router file looks like this:

```
// userRoutes.js
const express = require('express');

const userRouter = express.Router();

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};


userRouter.route('/')
    .get(getAllUsers)
    .post(createUser);

userRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

    module.exports = userRouter;
```

### SERVER.js

We now move all code related to the server into server.js and then export the app. We import app from server and this becomes our entry point.

```
  "scripts": {
    "start": "nodemon server.js"
  },
```

```
// server.js
const app = require('./app');

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('listening on port: ' + port);
});
```

## PARAM MIDDLEWARE

Middleware that only runs for certain parameters. We can check that the tours id is valid before going far into the code and replace all the times its checking this as its then if it has an id is checked if valid.

```
// We can stop all the wrong id's coming through
router.param('id', tourController.checkId);

exports.checkId =  (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);
    if (val > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id',
        });
    }
    next();
}
```

### CHAINING THE MIDDLEWARE

We can write some middleware that chacks that some parameters are sent and if not fail with message, else next.

```
// in the controller
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price',
        });
    }
    next();
}

// in the router
router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody).post(tourController.createTour);

```

## SERVING STATIC FILES

When we just want to serve some static file we can just add the build in:

```
app.use(express.static(`${__dirname}/public`))
```

Now all files are accessable by adding the name of the file to the hostname. Public folder is set to root folder.

## ENVIRONMENT VARIABLES

Storing configurations and settings or any other variables are best stored in env variables. By default express sets the environment to development.

To see the environment

```
console.log(app.get('env'));
```

Node also sets a lot of env variables. These variables are seen using the following:

```
console.log(process.env);
```

When we stqart express using the nodemon package we can actually set variables:

```
NODE_ENV=development nodemon server.js

// to access
process.env.NODE_ENV
```

We can create a file called .env or config.env and set these variables:

```
PORT=5000
NODE_ENV=development
USER=craig
PASSWORD=craigpw
```

For this file to be read we need a package called dotenv

```
npm i dotenv

// to setup in server.js
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
```

Make Morgan logging only run in dev.

```
// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
```

```
  "scripts": {
    "start:dev": "nodemon server.js",
    "start:prod": "NODE_ENV=production nodemon server.js"
  },
```

## ESLINT & PRETTIER IN NODE & VSCODE

Using VsCode: install the packages ESLINT and Prettier via extensions. Then install them as node_modules.

In your node project:

```
npm install eslint prettier eslint-config-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y

// package.json
{
  "name": "natours",
  "version": "1.0.0",
  "description": "learning node express and mongo DB",
  "main": "index.js",
  "scripts": {
    "start:dev": "nodemon server.js",
    "start:prod": "NODE_ENV=production nodemon server.js"
  },
  "keywords": [
    "Node",
    "express",
    "mongo"
  ],
  "author": "Craig",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "eslint": "^8.28.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-jsx-a11y": "^6.6.1",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-prettier": "^4.2.1",
    "nodemon": "^2.0.20",
    "prettier": "^2.8.0"
  }
}
```

Create an eslint and prettier configuration file

```
// prettierrc configuration
{
  "singleQuote": true,
  "tabWidth": 4,
  "printWidth": 80
}
```

```
// Eslint configuration
{
  "extends": ["airbnb", "prettier", "plugin:node/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-param-reassign": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }]
  }
}
```

## MONGODB

Start mongo shell and create DB

```
mongo
use natours-test
```

To create a collection in the DB, we use the db command and then the collection name and then witht the insertOne keyword can then just add an object to the collection. NB use double quotes for values that are strings!! You can "insertMany" as well.

### Inserting documents (one and many)

```
db.tours.insertOne({ name: "The Forest Hiker", price: 297, rating: 4.7})
{
	"acknowledged" : true,
	"insertedId" : ObjectId("637f0c3fa2c5634aa40d507a")
}
```

To view our collection

```
db.tours.find()
{ "_id" : ObjectId("637f0c3fa2c5634aa40d507a"), "name" : "The Forest Hiker", "price" : 297, "rating" : 4.7 }

 db.tours.insertMany([{ name: "The Sea Explorer", price: 497, rating: 4.8}, { name: "The Snow Adventurure", price: 997, rating: 4.9, difficulty: "easy"}])
{
	"acknowledged" : true,
	"insertedIds" : [
		ObjectId("637f0f183f5d72c471437a8f"),
		ObjectId("637f0f183f5d72c471437a90")
	]
}
```

### Viewing databases

```
> show dbs
admin         0.000GB
config        0.000GB
local         0.000GB
natours-test  0.000GB
> show collections
tours
```

### Querying the collections

lte: less than and equal to
lt: less than

Find docs with a price less then 500

```
db.tours.find({ price: {$lte: 500} })

{ "_id" : ObjectId("637f0c3fa2c5634aa40d507a"), "name" : "The Forest Hiker", "price" : 297, "rating" : 4.7 }
{ "_id" : ObjectId("637f0f183f5d72c471437a8f"), "name" : "The Sea Explorer", "price" : 497, "rating" : 4.8 }
```

Find docs with price less than 500 **AND** the rating greater then 4.8

```
db.tours.find({ price: {$lt: 500}, rating: {$lt: 4.8} } )

{ "_id" : ObjectId("637f0c3fa2c5634aa40d507a"), "name" : "The Forest Hiker", "price" : 297, "rating" : 4.7 }
```

Find docs with price less than 500 **OR** the rating greater then 4.8 (accepts an array of conditions)

```
db.tours.find({ $or: [ {price: {$lt: 500}}, {rating: {$lt: 4.8}} ] })

{ "_id" : ObjectId("637f0c3fa2c5634aa40d507a"), "name" : "The Forest Hiker", "price" : 297, "rating" : 4.7 }
{ "_id" : ObjectId("637f0f183f5d72c471437a8f"), "name" : "The Sea Explorer", "price" : 497, "rating" : 4.8 }
```

We can only select particular output, lets say we just want the name

```
db.tours.find({ $or: [ {price: {$lt: 500}}, {rating: {$lt: 4.8}} ] }, {name: 1})

{ "_id" : ObjectId("637f0c3fa2c5634aa40d507a"), "name" : "The Forest Hiker" }
{ "_id" : ObjectId("637f0f183f5d72c471437a8f"), "name" : "The Sea Explorer" }
```

### Updating

```
db.tours.updateOne({ name: "The Snow Adventurure"}, { $set: {price: 597} })

{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }
```

### Updating many

Use the filter to get many then update multiple. If we used updateOne and the filrter returned more than one doc then ONLY first would be set.

```
db.tours.updateMany({ price: {$gt: 500}, rating: {$gte: 4.8} }, { $set: {premium: true}})

{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }
```

### Replace one or many is the same as above

### Delete one and many

```
db.tours.deleteMany({ rating: {$lt: 4.8} })
{ "acknowledged" : true, "deletedCount" : 1 }
```

### Delete all

```
db.tours.deleteMany({})
```

## MONGO TO EXPRESS

### CLOUD based mongodb: ATLAS

Get the connction string from the app

```
const mongoose = require("mongoose");

const app = require("./app");

// to see the env variables
//console.log(process.env);

//MongoDB connect
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

const Connect = async () => {
  const url = process.env.DB_URL;

  try {
    await mongoose.connect(url, {
      authSource: process.env.DB_AUTHSOURCE,
      user: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database is connected!");
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
};
Connect();
```

The dotenv file:

```
# DATABASE = "mongodb://localhost:27017/adlocal";
DB_URL=mongodb://localhost:27017/dbnamegoeshere
DB_AUTHSOURCE=admin
DB_USERNAME= username
DB_PASSWORD='pw'
```

### Mongo driver: MONGOOSE (ODM library)

Install

```
npm i mongoose
```

Models

```
// shema and model: Tour
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'A tour must have a name' ],
        unique: true,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        required: [ true, 'A tour must have a price.']
    }
});

const Tour = mongoose.model('Tout', 'tourSchema');
```

## IMPORTING DATA - SEEDING

Simple way:

```
const mongoose = require('mongoose');
const Member = require('./models/member');

mongoose.connect('mongodb://localhost:27017/testDB',
  {
    useNewUrlParser: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const members = [
    {
        name: 'Craig Leppan',
        company: 'Netsecurity',
        number: '0637317733',
        email: 'craig@netsecurity.co.za',
        status: 'active'
    },
    {
        name: 'Tanya',
        company: 'Dirty Doggie',
        number: '0828685588',
        email: 'craig@yoyozi.com',
        status: 'active'
    }
];


const seedDB = async () => {
    await Member.deleteMany({});
    await Member.insertMany(members);
};

seedDB().then(() => {
    mongoose.connection.close();
});
```

Another way using process.argv arguments

```
const fs = require('fs');
const Tour = require('./../../models/tourModel');

const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './../../.env' });

// This connect method returns a promise..
mongoose.connect('mongodb://localhost:27017/natours').then(() => {
    console.log('DB connection successful!');
});

// Read the data from readFileSync: this is .json so we need to change it into a JSON object with JSON parse. This creates an array of javascript objects we can pass into the below function.
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import into DATABASE_LOCAL
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data imported successfully!');
    } catch (e) {
        console.log(e.message);
    }
    process.exit();
};

// Delete existing collection in DB using mongoose deleteMany
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data deleted successfully!');
    } catch (e) {
        console.log('Error deleting data:' + e.message);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
```

## FILTERING DATA - QUERY STRINGS

A typical query string:

```
https://localhost/api/v1/tours?duration=5&difficulty=easy
```

Accessing the query strings in express is already taken care of. We do this filtering in the get all route so usually the listing route. It is automatically in a field called query:

```
console.log(req.query);
// we get object:
{ difficulty: 'easy' }
```

There are two ways to read data from the database in mongoose:

1. Filter object like we use in the mongo shell

```
const tours = await Tour.find({
    duration: 5,
    difficulty: 'easy'
})
```

2. Using specific mongoose methods

```
const tours = await Tour.find()
    .where('duration')
    .equals(5)
    .where('difficulty')
    .equals('easy');
```

The re.query looks like 1. Thats why we can just use it like:

```
const tours = await Tour.find(req.query);
```

We change the GET list route to cater for these filters:

```
exports.getAllTours = async (req, res) => {
    try {
        // build query
        // 1) filtering
        const queryObj = { ...req.query };
        // Exclude the following fields as we dont want them in there: like pagination : page, sort limit etc
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 2) advanced filtering
        // convert the query object into a string
        let queryStr = JSON.stringify(queryObj);
        // using regext relpace lte or likes with $lte
        // use \b as we only want to match the exact words
        // g at end means multiple occurences of matches, then add a $ to it
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Now we want the object back so:
        console.log(JSON.parse(queryStr));

        const query = Tour.find(JSON.parse(queryStr));

        // sent: GET /api/v1/tours?difficulty=easy&page=2&rating[gte]=4.6
        // made into: { difficulty: 'easy', rating: { '$gte': '4.6' } }


        // EXECUTE QUERY
        const tours = await query;

        // send response
        res.status(200).json({
            status: 'success',
            number: tours.length,
            data: tours,
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            status: 'fail',
            message: e.message,
        });
    }
};
```

### SORTING

To sort by price:

```
/api/v1/tours?difficulty=easy&page=2&rating[gte]=4.6?sort=price
```

```
exports.getAllTours = async (req, res) => {
    try {
        // build query
        // 1A) filtering
        const queryObj = { ...req.query };
        // Exclude the following fields as we dont want them in there: like pagination : page, sort limit etc
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 1B) advanced filtering
        // convert the query object into a string
        let queryStr = JSON.stringify(queryObj);
        // using regext relpace lte or likes with $lte
        // use \b as we only want to match the exact words
        // g at end means multiple occurences of matches, then add a $ to it
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Now we want the object back so:
        console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr));

        // sent: GET /api/v1/tours?difficulty=easy&page=2&rating[gte]=4.6
        // made into: { difficulty: 'easy', rating: { '$gte': '4.6' } }

        // 2) Sorting
        // if req.query has the sort property then lets sort base on the value (default smal to large). If we make it -price then its descending
        // localhost:5000/api/v1/tours?difficulty=easy&page=2&rating[gte]=4.4&price[lt]=2500&sort=-price,ratingsAverage
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            console.log(sortBy);
            query = query.sort(sortBy);
            // add a default sort if not given
        } else {
            query = query.sort('createdAt');
        }

        // EXECUTE QUERY
        const tours = await query;

        // send response
        res.status(200).json({
            status: 'success',
            number: tours.length,
            data: tours,
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            status: 'fail',
            message: e.message,
        });
    }
};
```

### LIMITING

We can limit the data send by field limiting: fields=name,duration,difficuly,price

```
        // 2) Sorting
        // if req.query has the sort property then lets sort base on the value (default smal to large). If we make it -price then its descending
        // localhost:5000/api/v1/tours?difficulty=easy&page=2&rating[gte]=4.4&price[lt]=2500&sort=-price,ratingsAverage
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            console.log(sortBy);
            query = query.sort(sortBy);
            // add a default sort if not given
        } else {
            query = query.sort('createdAt');
        }

        // 3) Limiting fields (PROJECTING)
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }
```

We can also hardcode what must not be shown: we can do this in the Schema

```
const mongoose = require('mongoose');

// shema and model: Tour
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
    },
...
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        **select: false,**
    },
    startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
```

### PAGINATION

Pagination is done using the page key with value as the number and limit"

```
/api/v1/tours?page=2&limit=2
```

```
        // 4) Pagination
        // https://localhost:5000/api/v1/tours?page=2&limit=10
        // the above means for batches of 10 show the 2nd batch/page
        // so skips 10 and show/limit 10 (pg1 = 1 - 10, pg2 = 11 - 20)
        // convert page to number and set if not sent to 1, do with limit as well
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does NOT exist');
        }
```

### DEFAULT ALIAS ROUT

We want to show the five best tours (cheapest and most rated). So we create a default alias route

```
// in controller

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
```

Now we add this into the router:

```
const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();

// We can stop all the wrong id's coming through
// router.param('id', tourController.checkId);

**// Creaqting a default route
router.route('/top5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);**

router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
```

## Object oriented API getall.

To see the functional project where we dont use OO features: /home/craig/000-DEVonCorgi/KB/Templates/Express-API-Functional.

We are now going to add a Class where each of the features becomes a method of the Class. This allows us to use the class over all other resources: example the users.

We add the Class in the Controller but export later
We add a meathod for each of the API features
The Class takes in two variables that are acted on in the constructor function when the Class is used:

```
// utils/APIFeatures.js
// Class takes in mongo query string and then the queryString passed by the client
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // method filter
    filter() {
        // Replace the constructors
        // create a copy from the query string
        const queryObj = { ...this.queryString };

        // Remove the actions from the queryString
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        // Change the lte to $lte etc
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    // method Sorting
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy);
            this.query = this.query.sort(sortBy);
            // add a default sort if not given
        } else {
            this.query = this.query.sort('createdAt');
        }

        return this;
    }

    // method Limiting
    limitField() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    //method Paginate
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;
```

Now we can use it on any resource in the controller

```
exports.getAllTours = async (req, res) => {
    try {
        // EXECUTE QUERY using the CLass methods below
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitField()
            .paginate();
        const tours = await features.query;

        // send response
        res.status(200).json({
            status: 'success',
            number: tours.length,
            data: tours,
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            status: 'fail',
            message: e.message,
        });
    }
};
```

## MONGODB AGGREGATION PIPELINE

We can use this pipeline to calculate verages, totals and more

```
exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            // we can now group by difficulty
            // {
            //     $group: {
            //         _id: '$ratingsAverage',
            //         numTours: { $sum: 1 },
            //         avgRating: { $avg: '$ratingsAverage' },
            //         avgPrice: { $avg: '$price' },
            //         minPrice: { $min: '$price' },
            //         maxPrice: { $max: '$price' },
            //         numRatings: { $sum: '$ratingsQuantity' },
            //     }
            // }
            // we can now group by difficulty
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    numRatings: { $sum: '$ratingsQuantity' },
                }
            },
            {
                $sort: { avgPrice: -1 }
            },
            // {
            //     $match: { _id: { $ne: 'EASY' }}
            // }
            // {
            //     $group: {
            //         _id: 'null',
            //         numTours: { $sum: 1 },
            //         avgRating: { $avg: '$ratingsAverage' },
            //         avgPrice: { $avg: '$price' },
            //         minPrice: { $min: '$price' },
            //         maxPrice: { $max: '$price' },
            //         numRatings: { $sum: '$ratingsQuantity' },
            //     }
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats,
            },
        });
    } catch (e) {
        res.status(500).json({
            status: 'fail',
            message: e.message,
        });
    }
}
```

Check out the docs for more: https://www.mongodb.com/docs/

```
// router
router.route('/tour-stats')
    .get(tourController.getTourStats);
```

## MONGO: VIRTUAL PROPERTIES

These are properties that can be derived. For instance we dont nee3d to save hw many litres we have if we already are storing milliliters we can just derive the **value: virtual property**

```
const mongoose = require('mongoose');

// shema and model: Tour
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
...
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
    },
    {
        // These are the options we can pass in (usually left blank but here we want to tell mongo to use the virtuals: durationWeeks)
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// This now gives us a new field called durationWeeks
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
```

## MONGOOSE MIDDLEWARE

Pre and post saving actions or called pre and post hooks. Four types document, query, aggregate and model middleware.

### Document middleware

Acts on a document and defined in the Schema/model. We also need to call on next(), just like in express.

To test:

```
// MONGO MIDDLEWARE document type. Runs before save and create: but NOT on insertMany
tourSchema.pre('save', function(){
    console.log(this);
});
```

So lets use this middleware function to add a slug into the database. Install slugify:

```
npm i slugify
```

We need to add the element to the model:

```
const slugify = require('slugify');

```

Update the pre-hook to add another item into the resultand model. NB we also call next for it to continie.

```
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true });
    next();
});

// Add into the schema/model

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
```

Output with the new item in the dicument:

```
{
    "status": "success",
    "data": {
        "tour": {
            "name": "Testing mongo MIDDLEWARE2",
            "duration": 10,
            "maxGroupSize": 12,
            "difficulty": "difficult",
            "ratingsAverage": 4.5,
            "ratingsQuantity": 0,
            "price": 1234,
            "summary": "An adventure that stops your heart",
            "imageCover": "tour-heart-cover.jpg",
            "images": [],
            "createdAt": "2022-11-26T16:19:50.623Z",
            "startDates": [],
            "_id": "63823ca8d7bb3edea82c7e07",
            **"slug": "testing-mongo-middleware2",**
            "__v": 0,
            "durationWeeks": 1.4285714285714286,
            "id": "63823ca8d7bb3edea82c7e07"
        }
    }
}
```

### QUERY MIDDLEWARE

This runs before or after a query: the query can be whats defined: add secretTour into model to test.

```
// MONGO MIDDLEWARE query type. Runs when we run find or findOne
tourSchema.pre(/^find/, function(next) {
    this.find({secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    console.log(docs);
    next();
})
```

### AGGREGATION MIDDLEWARE

Allows us to add hooks before and after an aggregation happens. Our query middleware hid the secretTours docs. BUT! NOT when we use the aggregator to get the stats. So to hide the secretTours in aggregator we can use the aggregator middleware.

```
// MONGO MIDDLEWARE aggregation type. Runs before or after aggregation
tourSchema.pre('aggregate', function(next) {
    //console.log("Aggregator started");
    // We add the secretTour to true in the array using unshift
    this.pipeline().unshift({ $match: { secretTour: { $ne
    : true } } })
    next();
})
```

Now when we run our tour-stats we see one less as its not included in the output.

## DATA VALIDATION IN MONGOOSE

Validators that come with mongoose:

required
maxlength and minlength on Strings only

```
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxLength: [40, 'A tour name must have 40 characters or less']
            minLength: [10, 'A tour name must have 10 characters or more']
        },
```

min and max values

```
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1'],
            max: [5, 'Rating cannot be greater then 5.0']
        },
```

limiting a selection to certain words:

```
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty: is either easy, medium or difficult'
            },
        },
```

## CUSTOM VALIDATORS

These dont work on update action only create/new.

```
        // a custom validator to ensure the discount is not more than the price
        // was jus: priceDiscount: Number,
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(val) {
                    // false triggers a validation error
                    return val < this.price;
                },
                message: 'Discount price: {VALUE} cannot be more than price',
            },
        },
```

## VALIDATOR PLUGIN

Up to now we have only used the built in validators. There is a very popular plugin for express called validatorjs on github. https://github.com/validatorjs/validator.js/

Letys use this plugin to validate an alphanumeric string:

```
npm i validator
```

To use for anly allowing alpha

```
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxLength: [40, 'A tour name must have 40 characters or less'],
            minLength: [10, 'A tour name must have 10 characters or more'],
            // to use the validator plugin we use validator.isAlpha
            //validate: validator.isAlpha,
            // If we want to specify an error
            validate: [validator.isAlphanumeric, 'Only alpha numeric characters.'],
        },
```

## DEBUGGING NODEJS TOOL : ndb

Released by Google its a straight forward npm package called ndb

```
npm i ndb -D
```

Put the debug into a script in package,json

```

  "scripts": {
    "start": "nodemon server.js",
    "start:prod": "NODE_ENV=production nodemon server.js",
    "debug": "ndb server.js"
  },
```

Now we can run it:

```
npm run debug
```

This downloads a full degugging platform where we can really debug properly.

## ERROR HANDLING

### UNHANDLED ROUTES

To handle a route not caught by any handler: we need a catchall. This catchall goes at the end of all routes to ensure that its the final route.

```
// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Chatcall
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Cannot find ${req.originalUrl} on this server!`,
    });
});

module.exports = app;
```

Now any route not matched wiil get these results

### ERROR TYPES

**operational error:**

Depend on the user or the system or network

invalid path, invalid user input, failed to connect to server, failed to connect to database, request timeout, ..... etc

**programming errors:**

Development induced errors

reading properties on undefined, passing a number where an object is expected, using await without async, using req.uery instead of req.body, ... etc

We can implement an error handler that gets all errors from our app and give the client a intuitive response.

### Error handling middleware

We have error handling code all over our app. What we want to do is replace all of these with an error handling block - a central one that handles all.

By expressing 4 arguments in the function express knows this is an error handling function: **app.use((err, req, res, next) => {**

**The statusCode is what the error gives us or we make it '500'
The statsu is what the error gives us of we make it 'error'**

```
// Error handling function for all errors
**app.use((err, req, res, next) => {**
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

module.exports = app;
```

The error handler is called when you give the next(err) at the end, it will skip all handlers and go straight to the error handler.

So we can test by changing the catchall and then adding the Global handler:

```
// CATCHALL
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Cannot find ${req.originalUrl} on this server.`
    // })

    const err = new Error(`Cant find ${req.originalUrl} on this server.`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);   // skips all other middleware and gfoes to global error handler
})

// GLOBAL Error handling MIDDLEWARE Defined by: (err, req, res, next)
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});


module.exports = app;
```

#### Error handling as a Class

Lets make a Class: AppError and inherit the build in Error Class. In utils create a file appError.js and we can create our Class in here.

Our class using the constructor accepts two arguments: message and statusCode

We inherit/extend the Error class and use **super** here to call the parent contructor.

We pass in message to the parent as this is all it accepts normally and by this set the messageas as well.

We define the statusCode as statusCode and get the status from he Code

We set isOperational to true.

We then set the stack trace, each error gets a stack trace. This line doesnt polute the stack trace.

This line: Error.captureStackTrace(this, this.contructor); this keeps this AppError class out of the stack trace and doesnt polute it!

```
// appError.js in utils folder
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.contructor);
    }
};

module.exports = AppError;
```

We require and use it:

```
// in app.js
const AppError = require('./utils/appError');

// Chatcall changed to use the Global error handler
app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});
```

### Global error handler

Finally in our app.js file we lastly have an error handler to handle all non operational errors. This we locate in the controllers folder: errorController.js and call it from app.js.

```
// errorController.js
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
```

Call and use: as final

```
const globalErrorHandler = require('./controllers/errorController.js');

// Error handling function for all errors
app.use(globalErrorHandler);

module.exports = app;
```

### CLEANUP ASYNC FUNCTIONS

The try catch block can be simplified/removed by wrapping it into another function. This function will return a new anonymouse function that will be assigned to the controller function by express. As its an async function it will return a promise and we pass the next argument to the globalError handling function we created above.

```
// catchAsyinc.js
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
```

We then require it in the mauin file and use it in all controllers

```
const catchAsync = require('./../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY using the CLass methods below
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitField()
        .paginate();
    const tours = await features.query;

    // send response
    res.status(200).json({
        status: 'success',
        number: tours.length,
        data: tours,
    });
});

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    await Tour.findByIdAndRemove(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                numRatings: { $sum: '$ratingsQuantity' },
            },
        },
        {
            $sort: { avgPrice: -1 },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    });
});
```

### DIFFERANT ERRORS PRODUCTION AND DEVELOPMENT

In dev we want as much info as possibel. In dev we want to send as little as possible. So in our errorController.js we can specify the differance

```
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        // and error.captureStackTrace
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // an operational trusted error marked as isOperational in appError
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {

        // log error
        console.error('ERROR', err);

        res.status(500).json({
            status: 'error',
            essage: 'Something went wrong!',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }
};
```

### MONGOOSE ERRORS

There are three errors mongoose sends that we need to mark as operational errors so that we can send back meaningfull messages to the client in production.

1. INVALID ID
2. DUPLICATED NAME
3. APP specific actually: setting averageRating to be > 5, and setting difficulty to be other than the three specified words.

#### Invalid ID

In dev environment:

```
localhost:5000/api/v1/tours/fffffffffffff

// We get:

{
    "status": "error",
    "error": {
        "stringValue": "\"fffffffffffff\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "fffffffffffff",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"fffffffffffff\" (type string) at path \"_id\" for model \"Tour\""
    },
    "message": "Cast to ObjectId failed for value \"fffffffffffff\" (type string) at path \"_id\" for model \"Tour\"",
    "stack": "CastError: Cast to ObjectId failed for value \"fffffffffffff\" (type string) at path \"_id\" for model \"Tour\"\n    at model.Query.exec (/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/4-natours/after-section-08/node_modules/mongoose/lib/query.js:4897:21)\n    at model.Query.Query.then (/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/4-natours/after-section-08/node_modules/mongoose/lib/query.js:4996:15)"
}
```

In prod environment:

```
{
    "status": "error",
    "essage": "Something went wrong!"
}
```

This we can change as it would be best to send back to the client that the **id is invalid!**

In dev environment we dont care as we can see what error is, in production we use the "CastError" name in the error to isolate and change the outcome. We first make a copy of the error and then apply a function to it.

```
odule.exports = (err, req, res, next) => {
  //console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //let err = { ...err };

    //console.log(err.name);

    if (err.name === 'CastError') err = handleCastErrorDB(err);

    sendErrorProd(err, res);
  }
};


// the handle function
const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
```

### Duplicated name

```
{
    "status": "error",
    "error": {
        "index": 0,
        "code": 11000,
        "statusCode": 500,
        "status": "error"
    },
    "message": "E11000 duplicate key error collection: natours.tours index: name_1 dup key: { : \"Testing mongo MIDDLEWARE4\" }",
    "stack": "MongoServerError: E11000 duplicate key error collection: natours.tours index: name_1 dup key: { : \"Testing mongo MIDDLEWARE4\" }\n    at /home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/4-natours/after-section-08/node_modules/mongodb/lib/operations/insert.js:53:33\n    at /home/craig/000-DEVonCorgi/KB/z-projects/;....
}

// in prod:
{
    "status": "error",
    "essage": "Something went wrong!"
}
```

We add this:

```
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

```

#### App specific

1. VALIDATION ERROR

```
    if (err.name === 'ValidationError')
    err = handleValidationErrorDB(err);

// the function:


const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
```

### UNHANDLED ERRORS

This can be a DB error for wrong password etc.. We can subscribe to the event undandled rejection.

```
// in server.js
// SAFETY NET to HANDLE ALL other errors: test by auth fail to DB
process.on('unhandledRejection', err => {
    console.log(err.name, err.messsage);
    console.log('Unhandled rejection: Shutting DOWN!');
    // Due to this error we can exit the application
    server.close(() => {
        process.exit(1);
    })
});
```

### UNCAUGHT EXCEPTIONS

This time we listen for uncaught exceptions: test by console logging an undefined variable.

```
// in server.js -- at top so it read before all
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// SAFETY NET to HANDLE ALL uncaughtExceptions
process.on('uncaughtException', err => {
    console.log('Uncaught Exception: Shutting DOWN!');
    console.log(err.name, err.messsage);
    // Due to this error we can exit the application
    process.exit(1);
});

// To test uncaught Exception
//console.log(x);
```

## USER MODEL

The user model and the password encryption using bcrypjs.

```
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name, email, photo, password pw-confirn

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tel us your name!'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 6 characters long'],
        select = false, // isn't shown on the client when signup
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // only works on CREATE and SAVE!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match',
        },
    },
});

// Encrypt the pw if its being changed/added
userSchema.pre('save', async function(next) {
    // only run this if pw actually modified
    if (!this.isModified('password')) return next();

    // Hash the pw if the above passed with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // delete the passwordConfirm as we dont need its
    this.passwordConfirm = undefined;
    next();

});

const User = mongoose.model('User', userSchema);

module.exports = User;
```

### UserController: signup

```
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    res.status(201).json({
        message: 'Success',
        data: {
            user: newUser,
        },
    });
});
```

#### JWT

JWT is a stateless authentication system. RESTFULL API's are always stateless.

1. User logs in with authentcated uid and pw
2. Server issues jwt to the authenticated client.
3. Client stores jwt in a cookie or local storage.
4. To access protected routes the client sends the jwt in the header and the clients jwt is verified.
5. Id the jwt is valid then the requested data is sent to client.

NOTE! - Must happen over https

Made up of the header, payload and signature. The header and payload can be decoded by anyone.

The signature is signed using the header the payload and a secret. The signing result is the JWT. The jwt after being sent to the server to get access to a protected route will verify the token using the secret and compare the outcome to the signature in the jwt. If they are the same then all is good.

We need to install jwt: npm i jsonwebtoken

Signing and issuance:

```
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    // we need to sign a token now to issue it to the client
    const token = jwt.sign({ id: newUser._id }, 'process.env.JWT_SECRET', { expiresIn: process.env.JWT_EXPIRES_IN} );

    // We create the user above and sign the token, we then send it to the client
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});
```

### Login

1. Check if email and pw exist if not return
2. Check if user exists and pw is correct
3. 1 and 2 are good then send token to client

We create all jwt code into authController.js

```
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    // createSendToken(newUser, 201, res);

    const token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Remove password from output
    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        token,
        data: {
            name: newUser.name,
            email: newUser.email
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    //const email = req.body.email;
    // rather do ES6 restructuring
    const { email, password } = req.body;

    // 1. Check if email and pw exist if not return
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2. Check if user exists and pw is correct
    // the password we need to "select"  with "+"" as in model its stored as "select: false" NB!
    const user = await User.findOne({ email }).select('+password');

    // compare the pw's using the instance method in model. We place this in the test below rather as then if the user query fails it fails gracefully.
    //const correct = await user.correctPassword(password, user.password);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3. Id user email is good and pw match then gen token then send token to client
    // const token = jwt.sign({ data: user._id }, '32characters-dfjkhkjghkjshjhsd!@', { expiresIn: '90d' });

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    //console.log(token);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            username: user.name,
            email: user.email,
        }
    });
});
```

The model

```
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// get config
dotenv.config({ path: './config.env' });

// name, email, photo, password pw-confirn

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tel us your name!'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
        // prevents sending to client on signup
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // only works on CREATE and SAVE!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match',
        },
    },
});

// Encrypt the pw if its being changed/added
userSchema.pre('save', async function (next) {
    // only run this if pw actually modified
    if (!this.isModified('password')) return next();

    // Hash the pw if the above passed with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // delete the passwordConfirm as we dont need its
    this.passwordConfirm = undefined;
    next();
});

// Create instance method to compare clientpw with password stored. Returns true or false. ALOWS -  user.correctPassword
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    // cannot use this.password as select is false in model
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
```

We have signup and login, both sending the token and user details: WITH NO PW \_ GOOD!

### Protecting routes

Only authenticated users/clients must be able to connect to routes.

To protect routes we run middleware in a function located before running controller code (handlers). The function is created in the authController. Called in the tour routes file.

```
router
    .route('/')
    **.get(authController.protect,** tourController.getAllTours)
    .post(tourController.createTour);
```

We use the middleware to test the authentication token is supplied in the header of the request sent from the client. We use Postman to send the get request with a valid token and "Authorization" key with "Bearer token" as the value in the header.
The middleware must test this. We can see the header in the request sent to the server by adding this in the app.js file:

```
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});
```

And we can see in the logs the header with auth and token sent:

```
GET /api/v1/tours 200 54.518 ms - 10119
[nodemon] restarting due to changes...
[nodemon] starting `node server.js`
App running on port 5000...
DB connection successful!
{
  'content-type': 'application/json',
**  authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGEzNWFmMDgyNDg3M2M4MWM3Mzc2YiIsImlhdCI6MTY3MDAwNTc4OSwiZXhwIjoxNjc3NzgxNzg5fQ.RQQIvgSs7pCe6hygPmx_hZli1cF-wVYuGcK-vumgS_I',**
  'user-agent': 'PostmanRuntime/7.29.2',
  accept: '*/*',
  host: 'localhost:5000',
  'accept-encoding': 'gzip, deflate, br',
  connection: 'keep-alive'
}
Query took 18 milliseconds!
GET /api/v1/tours 200 36.635 ms - 10119
```

So in the authController we create the protect function called in the route as seen above and ensure that the header contains the "Authentication" key and "Bearer" with the token"

** authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGEzNWFmMDgyNDg3M2M4MWM3Mzc2YiIsImlhdCI6MTY3MDAwNTc4OSwiZXhwIjoxNjc3NzgxNzg5fQ.RQQIvgSs7pCe6hygPmx_hZli1cF-wVYuGcK-vumgS_I',**

```
exports.protect = catchAsync(async (req, res, next) => {
    // 1. Get token and check if exists: in the header
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
        //console.log(token);
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in. Please log in to get access',
                401
            )
        );
    }
```

If we send the header with "bearer" but no token we get:

```
{
    "status": "fail",
    "error": {
        "statusCode": 401,
        "status": "fail",
        "isOperational": true
    },
    "message": "You are not logged in. Please log in to get access",
    "stack": "Error: You are not logged in. Please log in to get access\n    at new AppError (/home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complet...
}
```

Next we Verify/validate token using "promisify" package we require in authController

```
    // 2. Validate the token (VERIFICATION). We turn this into a promis. We use promisify in utils package. So require it in the authController: see above ES6 destructured require from util: const { promisify } = require('util'); We also use await as we are in an async function

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    // Get { id: '6389ce8adc2121d6086d20e1', iat: 1669999390, exp: 1677775390 }
```

We see above that the jwt was decoded and resulted in the payload that is the ID: that we can check is correct! We also are sent the timestamp of the creation and expiration.

We can tamper with the token using : https://jwt.io/#debugger-io, and change the payload/id. When we send in the header the tampered token we need to see it fail!

```
{
    "status": "fail",
    "error": {
        "statusCode": 401,
        "status": "fail",
        "isOperational": true
    },
    "message": "You are not logged in. Please log in to get access",
    "stack": "Error: You are not logged in. Please log in to get access\n   ..)"
}
```

As above it fails when tampered with or is invalid token. We use the globalErrorHandler to handle this error by getting the err.name: 'JsonWebTokenError'

```
const handleJWTError = (err) => new AppError('Invalid token, please login again!', 401);

module.exports = (err, req, res, next) => {
    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        //console.log(err.name);
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        //let err = { ...err };

        //console.log(err.name);

        if (err.name === 'CastError') err = handleCastErrorDB(err);
        if (err.code === 11000) err = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err);

        **if (err.name === 'JsonWebTokenError') err = handleJWTError(err);**

        sendErrorProd(err, res);
    }
};
```

So if we login to production: "npm run start:prod" and send invalid token:

```
{
    "message": "Invalid token, please login again!",
    "status": "fail"
}
```

And in development:

```
{
    "status": "error",
    "error": {
        "name": "JsonWebTokenError",
        "message": "invalid signature",
        "statusCode": 500,
        "status": "error"
    },
    "message": "invalid signature",
    "stack": "JsonWebTokenError: invalid signature\n    at ..."
}
```

Set the expiration of the token to 50 ms and check after the token expires that it fails. You need to login then get the token allow 5s to pass then test for failure.

```
JWT_EXPIRES_IN='50'
```

And we get correctly so:

```
{
    "status": "error",
    "error": {
        "name": "TokenExpiredError",
        "message": "jwt expired",
        "expiredAt": "2022-12-06T03:53:40.000Z",
        "statusCode": 500,
        "status": "error"
    },
    "message": "jwt expired",
    "stack": "TokenExpiredError: jwt expire...)"
}
```

The total protect in authController

```
exports.protect = catchAsync(async (req, res, next) => {
    // 1. Get token and check if exists: in the header
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
        //console.log(token);
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in. Please log in to get access',
                401
            )
        );
    }

    // 2. Validate the token (VERIFICATION). We turn this into a promis. We use promisify in utils package. So require it in the authController: see above ES6 destructured require from util: const { promisify } = require('util'); We also use await as we are in an async function. We decode the jwt "decoded" constant

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log(decoded);
    // Get { id: '6389ce8adc2121d6086d20e1', iat: 1669999390, exp: 1677775390 }

    // 3. Check if user still exists: what if the user is actually deleted. To test create a user and use the token, delete the user and then this code should run and auth fail
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError('The user owning this token no longer exists', 401)
        );
    }

    // 4. Check if user changed PW after token was issues: all pw changes invalidate old tokens issued! We create an instance method to test this: in user model. For now we just add the passwordChangedAt data in manually . the iat is issued at
    // TODO but will set later
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        // if this returns true
        return next(
            new AppError(
                'User recently changed password! Please log in again',
                401
            )
        );
    }

    // GRANT ACCESS to protected route if request makes it to here
    next();
});
```

The user model and changes for protect:L

```
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// get config
dotenv.config({ path: './config.env' });

// name, email, photo, password pw-confirn

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tel us your name!'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
        // prevents sending to client on signup
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // only works on CREATE and SAVE!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match',
        },
    },
    passwordChangedAt: Date,
});

// Encrypt the pw if its being changed/added
userSchema.pre('save', async function (next) {
    // only run this if pw actually modified
    if (!this.isModified('password')) return next();

    // Hash the pw if the above passed with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // delete the passwordConfirm as we dont need its
    this.passwordConfirm = undefined;
    next();
});

// Create instance method to compare clientpw with password stored. Returns true or false. ALOWS -  user.correctPassword
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    // cannot use this.password as select is false in model
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method: test to see if pw was changed after token issued
// Here we have to create the item passwordChangedAt to compare the dates only if the passWordChangedAt date exists.
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10  // base 10
        );

        //console.log(changedTimestamp, JWTTimestamp);
        // So we want to say JWTTimestamp < changedTimestamp
        return JWTTimestamp < changedTimestamp;
    }
    // false means pw not changed
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
```

### Assigning token in POSTMAN

Lets now assign the token as the one past to us in Postman: in login and signup test tab---

```
pm.environment.set("jwt", pm.response.json().token);
```

Then we assign the {{jwt}} variable in the get all tours route header. We select the authoriation tab , then bearer token then add {{jwt}}

### Authorization: roles and permissions

Checking / ensuring certain users can or cant have access to certain resourses. For instance we can log in a client but that client may or may not be authorized to delete tours.

```
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(
        authController.protect,
        **authController.restrictTo('admin', 'lead-guide'),**
        tourController.deleteTour
    );

module.exports = router;
```

So we create this new middleware to restrict the use of the route delete: Only for admin. So in our user model we can create a "role". We can use the middleware to limit authorizations accounts have.

We create a wrapper function returning a midleware function we want to create

roles is an array of: - admin and lead-guide IN our routes we have: ----

**authController.restrictTo('admin', 'lead-guide'),**

**If roles doesnt include the role of the "currentUser" we dont give current user permission. This restrictTo always runs after "protect": as protect puts the current user in the request object!**

```
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action',  403)
            );
        }
        next();
    };
};
```

If the user is not in "roles" as depicted in the restrictTo above we get:

```
{
    "status": "fail",
    "error": {
        "statusCode": 403,
        "status": "fail",
        "isOperational": true
    },
    "message": "You do not have permission to perform this action",
    "stack": "Error: You do not have permission to perform this action\n    at new AppError ("
}
```

If the user's role is in "roles as depicted in "restrictTo" then the item is deleted and nothing returned as coded.

### Password reset functionality

Done in the authController: Standard procedure to reset is: user sends post request with email addresss and starts the reset prcess.

Creates a token and sends the token to the email address of the user requesting the reset. (Simple web token not a jwt)

On verifying the token to be valid the user is then redirected to a page to reset his/her password

```
// Password resetting in two steps: forgot and resetting
exports.forgotPassword = (req, res, next) => {};

exports.resetPassword = (req, resp, next) => {};
```

We add the routes in the userRoutes.js file:

```
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
```

In our auth controller we get the email and find user, if we get a user we use an instance method to generate a token and save the encrypted version to DB and mail the unencrypted version to the client wanting to reset password.

```
// Password resetting in two steps: forgot and resetting
exports.forgotPassword = catchAsync(async (req, res, next) => {

    // 1. Get the user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
    }

    // 2. Generate the random token: create an instance method: lets use it
    const resetToken = user.createPasswordResetToken();
    // Save the token in the db
    // We have to remove validation before saving so as not to validate
    // await user.save();
    await user.save({ validateBeforeSave: false });


    // 3. Send to users email


});

exports.resetPassword = (req, resp, next) => {};
```

#### Mailing with Node mailler

We use the utils folder to write a mailer: - email.js first we install node mailer package

```
npm i nodemailer
```

We sign up with mailtrap to not actually send our mails but trap them so we can test - mailtrap.io

email.js: and add all env vars in config.env

```
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            password: process.env.EMAIL_PASSWORD,
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: 'Craig Leppan <craig@yoyozi.com>',
        to: options.email, // the options.xxx that we pass as argument into this function
        subect: options.subect,
        text: options.message,
        //html:
    };

    // 3. Send the email with nodemailer -0 returns a promiss so we can use async and await
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
```

Then to use we need to require it in the authController

```
const sendEmail = require('../utils/email');
```

The forgotPassword and resetPassword code in authController:

```
// Password resetting in two steps: forgot and resetting
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1. Get the user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new AppError('There is no user with that email address.', 404)
        );
    }

    // 2. Generate the random token: create an instance method: lets use it
    const resetToken = user.createPasswordResetToken();
    // Save the token in the db
    // We have to remove validation before saving so as not to validate
    // await user.save();
    await user.save({ validateBeforeSave: false });

    // 3. Send to users email the plain unencrypted token
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a patch request with new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    // if there is an error we need to delete the token and cannot simply use our old AppError function as we need to rest userpw and userpwexpires, so we embrace all in a try catch block
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 mins only)!',
            message: message,
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'There was an error sending the email. Try again later!',
                500
            )
        );
    }
});

exports.resetPassword = catchAsync( async (req, res, next) => {
    // 1. Get user based on the token, so get the token, hash it then find user with the hashed token, also get the token if its NOT expired!!!
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // 2. If token has not expired, and user exists, set new pw
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    // We dont turn off validation as we want and need it, this is also why we use save and NOT update here as all validation works with save but not update!!!


    // 3. Update the chagedPassword for the user, so all other tokens no longer valid!!


    // 4. Log user in, SEND JWT
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    //console.log(token);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            username: user.name,
            email: user.email,
        },
    });
});
```

We now also need to ensure that we use SAVE: The passwordChangedAt attribute also needs to be set so we do this using user.shema.pre.. in the model : pre save check. Set the password changed property if the password has changed on save (if it has not changed or its a new entry go to next else set ). We also set the date back 1 second to ensure that the time is earlier than the timestamp that the token is actually created, needs its date to be after the passwordChanged timestamp so this hack does this.

```
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});
```

Updated createSend function: this creates the jwt token and sends it:

```
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            username: user.name,
            email: user.email,
        },
    });
};
```

Replaced all with function: making sure statusCode is same

### Updating a password

We do this in out authController.js file: we need the users password: old one and new one with confirmation

```
{
    "passwordCurrent": "12345678",
    "password": "87654321",
    "passwordConfirm": "87654321"
}
```

AuthController file:

```
exports.updateMyPassword = catchAsync(async (req, res, next) => {
    // 1. Get the user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2. Check if the posted password is coirrect
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    // 3. Update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4. Log in user and send JWT
    createSendToken(user, 200, res);
});
```

### Updating user data

Instead of doing this in the authController.js we can do it in the userController.js.

```
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1. Create an error if user tries to update the password
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updating: please use /updateMyPassword',
                400
            )
        );
    }
    // 2. Update user document
    // await user.save(); This wont work as we have passwordConfirm and password as required fields SO USE: findByIdAndUpdate, then NO MODEL validation takes place!!!

    // Also: we need to specifically specify what can be updated and not allow say "role: admin" to be set. We say using the 2nd argument that only email and name can be updated. We do this by filtering what we want to keep in the req.body as a constant. We create this function above.

    // 2. Filtered out field names e not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3. Update the user
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser.name,
            email: updatedUser.email
        }
    });
});
```

Also we need to create the function filterObj(req.body, 'name', 'email'); We do this in the same file above

Loop thgrough all fields in the object and for each fieled we check if its one of the allowed filelds, if it is we create a new field in a new object with the same name

```
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};
```

### Deleting user (himself/herself)

When we delete the account we dont delete it ferom the DB, we just set it as inactive, so should the user need it again its actually stiull there. We need the property: active: in our user schema. Boolean field type.

```
// in the User model:
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});
```

The route: router.patch('/deleteMe', authController.protect, userController.deleteMe);

In the usersController we create the function deleteMe:

```
// in the userRoutes.js
router.delete('/deleteMe', authController.protect, userController.deleteMe);

/ in userController
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
```

We also need to create query Middleware to ensure that the active fields that are set to false are not shown! This we do in the User Model.

Hide the "active: false" users "DELETED". Apply to all queries staring with "find".

```
userSchema.pre(/^find/, function (next) {
    // because we have some that have no active set we need to use: "active: { $ne false }
    this.find({ active: { $ne: false } });
    next();
});
```

## SECURITY

How to limit the issues:

### Compromise DB

1. Strongly encrypt passwords
2. Strongly encrypt password reset tokens

### Brute for attacks

1. Use Bcrypt to make login slow
2. Implement rate limiting
3. Implement max login attaempts

### Cross-ite scripting attacks

1. Store JWT in HTTPOnly cookies (browsers only accept and send never see it)
2. Sanitize user input data
3. Set special http headers (helmet package)

### Denial of service attacks

1. Rate limiting (express-rate-limit)
2. Limit body payload (in body parser)
3. Avoid evil regular expressions

### NOSQL query injection

1. Use mongoose for MongoDB (because of schema types)
2. Sanitize user input data

### BEST PRACTICES

1. Use https
2. Randon password reset tokens with expirey dates
3. Deny access to jwt after password change
4. Dont commit sensitive data to Git
5. Dont send error details to clients
6. Prevent cross site request forgery
7. Require re-auth before higher value action
8. Implement a blacklist of untrusted JWT
9. Confirm user email address after first creating account
10. Keep user logged in with refresh tokens
11. Implement two factor authentication
12. Prevent parameter pollution: causing uncaught exceptions

## SECURITY BEST PRACTICES

### JWT via http only cookie

We are sending the token as a string to the browser nut we can also send it as a http coockie so browser can use it. This is a better way for the browser to store and use it.

As of this writing the JWT is sent using the createSend function in the authController. Now lets take it a step further and send as a cookie using this function as well do do this.

We set the expiration of the cookie in the config.env filr and convert it to milliseconds as its in days.

```
JWT_COOKIE_EXPIRES_IN=90
```

So actual expiration will be: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN _ 24 _ 60 _ 60 _ 1000))

We set the "secure to true: this means the cookie will only be sent over a secure https connection.

```
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        secure: true,
        httpOnly: true,
    });
```

We cannot use this in dev as we dont run https, so we set this as a function accepting options based on environment. So we base the options and settings on weather we are in production of development mode: in dev will only have expiration date and httpOnly whereas in production will be secure https only.

```
    // sending the jwt as a cookie
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') c
```

### RATE LIMITING

This will help prevent DOS and brute force attacks. We implement this in Global Middleware in app.js. We use a package called express-rate-limit

Install it: npm i express-rate-limit

```
// app.js
const limiter = rateLimit({
    max: 100,
    window: 60 * 60 * 1000, // allows 100 requests from one IP in 1 hour
    message: 'Too many requests from your IP',
});

app.use('/api', limiter);
```

### Helmet

Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!

To install:" npm i helmet

```
const express = require("express");
const helmet = require("helmet");

const app = express();

app.use(helmet());
```

### Data sanitization

We also want to limit the size of the file to parse:
We do data sanitization against NoSQL queryinjection and against XSS attacks.

```
// Body parser
app.use(express.json({ limit: '10kb ' }));

// now we can clean the data

```

We can use NoSQL injection to login without the username but knowing the password

```
{
    "email": { "$gt": '' },
    "password": "12345678"
}
```

To protect against this we install:

1. express-mongo-sanitize
2. xss-clean

Then we require them:

```
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
```

### Parameter polution

Done in the url by adding duplicate fields. We use hpp package to avaoid this attack.

Install it: npm i hpp

```
// app.js
const hpp = require('hpp');
```

Some fields we can whitelist so we can still use them multiple times:

```
// Prevent parameter polution
// we whitelist duration so we can call this twice in the url allows us to use
// /api/v1/tours?duration=5&duration=9
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);
```

## MongoDB data moddelling

Structuring unstructured data into models that are logical.

### Relationships

1:1 -> one movie has only one name

1:many -> Three types:

1:few -> one three awards

1:many -> one to thousands

1:ton -> one to millions

many:many -> relationships in both directions: movie has many actors and actor acts in many movies

### Referencing VS Embedding

**Referenced / Normalized ** -- child referencing

```
movie: {
    "_id": ObjectID('222'),
    "title": "Interstallar",
    "releaseYear": 2014,
    "actors": [
        ObjectID('555')
        ObjectID('777')
    ]
}

actor: {
    "_id": ObjectID('555'),
    "name": "Matthew McConaughey",
    "age": 50,
    "born": "Uvalde USA"
}

actor: {
    "_id": ObjectID('777'),
    "name": "Anne Hathaway",
    "age": 37,
    "born": "NYC USA"
}
```

**Embedded / Denormalized** -- noSQL

```
movie: {
    "_id": ObjectID('222'),
    "title": "Interstallar",
    "releaseYear": 2014,
    "actors": [

        {
            "_id": ObjectID('555'),
            "name": "Matthew McConaughey",
            "age": 50,
            "born": "Uvalde USA"
        },
        {
            "_id": ObjectID('777'),
            "name": "Anne Hathaway",
            "age": 37,
            "born": "NYC USA"
        }
    ]
}
```

### When to embed and when to reference? A practical framework

**1. Relationship type: how two datasets are related to each other?**

EMBED: 1:few and 1:many

REFERENCE: 1:many, 1:ton, many:many

**2. Data access patterns: how often data is read and written?**

EMBED: mostly read from, doesnt change quickly, has a high read to write ratio

REFERENCE: Data is updated a lot, low read to write ratio

**3. Data closeness: How much the data is related?**

EMBED: Datasets really belong together

REFERENCE: We frequently need to query both datasets on there own

Lets say we decide to go for REFERENCING: There are three types of REFERENCING:

Child : (1:few best) as above an array of stored ID's referencing other documents, can get to thousands of ID's

Parent : (1:few and 1:ton) id's reference the parent and the array of child references wont grow ridiculously

Two way referaning : ( many : many) we keep the id's of the relationships in both directions: from a movie we have all id's of all actors acting in the movie. In the actors field we have all movies that they star in

### Data modelling : Natours

Tours, Users, Locations, Reviews, Bookings

We now determine the relationships between these models

User -> Reviews - 1:many : chose parent referencing here as we dont want an array to grow too much so have the reference in the review to the user. Review holds the userID

Tours -> Reviews - 1:many : chose parent referencing (same as above), reviews hold the tourID

Tours -> Locations - few:few chose embedding locations into tours as they are few to few and closely related

Tours -> Users - few:few : could do child referencing or embedding, prefer child as the users should remain isolated

Users -> Bookings - 1:many (1 user can book many tours) : parent referencing, so we keep the userID in the booking model

Tours -> Bookings - 1:many (1 tour can have many bookings) : parent referancing, so we keep the tourID in the booking model

Tours - userID - [ embedded locations ]

Users

Reviews - tourID, userID

Bookings - tourID, userID

#### Locations

Embedded into Tours:

```
startLocation: {
    // GeoJSON (long then lat)
    type: {
        type: String,
        default: 'Point',
        enum: ['Point']
    },
    coordinates [Number],
    address: String,
    description: String
},
locations: [
    {
        type: String,
        default: 'Point',
        enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String,
    day: Number
]
```

#### Guides (user) embedded into tours

We add the guides as an array but code a pre save handler to build/pull the guides from users and embedd them into our model.

In our tour model: require the user model : const User = require('./userModel');

```
    ],
    guides: Array
},
```

Then the presave handler: which is a promis (multiple so we use promis.all and assign the this.guides the returning promises)

```
tourSchema.pre('save', async function(next) {
    const guidesPromises = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(guidesPromises);
    next();
})
```

Now in postman we can create a tour with guides as an array and they should be populated (actually mapped) into out tour collection:

```
{
    "name": "The best Test tour",
    "duration": 10,
    "price": 988,
    "difficulty": "easy",
    "maxGroupSize": 1,
    "summary": "test tour",
    "imageCover": "tour-3-cover.jpg",
    "ratingsAverage": 4,
    "guides": [
        "63937b16a862d1220b3df97a",
        "63937b3da862d1220b3df97c"
    ]
}
```

#### Guides as reference to users in Tours (NOT embedded)

We add at the bottom of the tours model:

```
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
```

So to create these guides we can just create the users then copy the ID's of the users that we want as guides.

```
{
    "name": "The best Test tour",
    "duration": 10,
    "price": 988,
    "difficulty": "easy",
    "maxGroupSize": 1,
    "summary": "test tour",
    "imageCover": "tour-3-cover.jpg",
    "ratingsAverage": 4,
    "guides": [
        "63937b16a862d1220b3df97a",
        "63937b3da862d1220b3df97c"
    ]
}
```

#### Populate (referenced and view)

A query to make the referenced data appear like its embedded in the model but its just "Populated". In the tourController.js we add populate to the query and when its displayed it displays the guides relevant to the id's in the tour.

```
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('guides');
    // Tour.findOne({ _id: req.params.id })

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});
```

Now if we get that particular tour id using the getTour:

```
{
    "status": "success",
    "data": {
        "tour": {
            "startLocation": {
                "type": "Point",
                "coordinates": []
            },
            "_id": "63937b77a862d1220b3df981",
            "name": "The best Test tour",
            "duration": 10,
            "maxGroupSize": 1,
            "difficulty": "easy",
            "ratingsAverage": 4,
            "ratingsQuantity": 0,
            "price": 988,
            "summary": "test tour",
            "imageCover": "tour-3-cover.jpg",
            "images": [],
            "startDates": [],
            "secretTour": false,
            "guides": [
                {
                    "_id": "63937b16a862d1220b3df97a",
                    "name": "guide1",
                    "email": "guide1@craig.com",
                    "role": "guide",
                    "__v": 0
                },
                {
                    "_id": "63937b3da862d1220b3df97c",
                    "name": "guide2",
                    "email": "guide2@craig.com",
                    "role": "guide",
                    "__v": 0
                }
            ],
            "locations": [],
            "slug": "the-best-test-tour",
            "__v": 0,
            "durationWeeks": 1.4285714285714286,
            "id": "63937b77a862d1220b3df981"
        }
    }
}
```

We see this in the getTour route handler but not in getllTours as we didnt implement it in this handler.

We can also limit and specify what is left out of view:

```
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate({
        path: 'guides',
        select: '-__v -role',
    });
    // Tour.findOne({ _id: req.params.id })

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});
```

Now we are not shown the \_\_v and the role

```
                {
                    "_id": "63937b16a862d1220b3df97a",
                    "name": "guide1",
                    "email": "guide1@craig.com"
                },
```

We can place this in the tourModel as a pre run handler so whenever a find is called it populates the data referenced in the model. Also now works on get all tours -> get all tours.:

```
// pre ind to populate for guides instead of having it in the controllers
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v',
    });
    next();
});
```

#### Parent referancing (Reviews and Bookings)

Review model that has rating, createdAt, tour it belongs to and the user it was written by : (so two parent id's). Both tour and user are parents in this model.

The model:

```
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review cannot be empty'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must have an author'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
```

We add virtual properties calculated to be shown: with options below the model.

And now we can create a new review, get a review and get all reviews.

1. In app.js add the new endPoint

```
const reviewRouter = require('./routes/reviewRoutes');

app.use('/api/v1/reviews', reviewRouter);
```

2. Credate the reviwController.js file

```
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews,
        },
    });
});

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            review,
        },
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview,
        },
    });
});
```

3. Create the reviewRoutes.js file

```
const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.createReview);

router.route('/:id').get(reviewController.getReview);
//     .patch(reviewController.updateReview)
//     .delete(reviewController.deleteReview);

module.exports = router;
```

Populating the reviews with user and tour data.

```
// pre find to populate for tours and users
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name',
    }).populate({
        path: 'user',
        select: 'name photo',
    });
    next();
});
```

#### Virtual Populate

We can get the reviews for a tour without persisting it in the DB, using virtual populate. Even with the reviews referancing the tours only and not a child reference: tour does not have a reference to review.

```
// tour model
// Virtual populate : reviews of tours parent referencing of reviews to tours
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreign: 'tour',
    local: '_id',
});
```

So now we can use populate in the get one tour and see the reviews becuse of the virtual populate entry above: This we do in the tour controller for get one:

```
exports.getTour = catchAsync(async (req, res, next) => {
    // added the virtual populate from parent relationship with reviews
    const tour = await Tour.findById(req.params.id).populate('reviews');
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});
```

Now we can see the reviews when getting the single tour with id.

#### Nested routes

**Now it would be preferable for the user ID to be populated into the review by using the ID of the user doing the review and the tour from the tour ID automatically**

To add a review resource to the tour resource:

POST /tours/123456/reviews

Getting all reviews on a tour:

GET /tours/123456/reviews

Get a single review on a tour

GET /tours/123456/reviews/123456

We implement the nested route in the tourRouter as seen above

So in the tour router: we call -> reviewController.createReview

We need to require the reviewController

```
router
    .route('/:tourId/reviews')
    .post(
        authController.protect,
        authController.restrictTo('users'),
        reviewController.createReview
    );
```

And now to ensure that the user and the tour id's are saved automatically we change the reviewController create review to be:

```
exports.createReview = catchAsync(async (req, res, next) => {
    // Nested routes: if the tour is not specified in the body then take it from the url tour id
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id; // protect middleware

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview,
        },
    });
});
```

#### Nested routes in Express

The problem with the above solution is its messy and we have duplicate code and we can use merge params instead!

We first import the reviewRouter and remove the reviewController. Then we add in the tourRouter

```
const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Nested routes: /tourId/reviews. We need to give the reviewRouter access to the tourId in the reviewRouter. Here we mount the Router on the route
router.use('/:tourId/reviews', reviewRouter);
```

And now in the reviewRouter we need to give access to the tourId to the reviewRouter

```
//const router = express.Router();
// For the review router to get access to the tourId we need merge params to be activated
const router = express.Router({ mergeParams: true });
```

#### Building handler factory functions

These are functions that can work for any model. For example lets say we have a function that we pass in a Model to handle the delete.

Make a file in the folder controllers called handlerFactory.js.

```
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });
```

Then in our ontroller of any Model we can replace the delete with our new closure function:

```
// Need to require it first to use it:
const factory = require('./handlerFactory');

exports.deleteTour = factory.deleteOne(Tour);
```

Do the same for reviews and user

Create a factoryHandler for create, delete, get all, and update:

```
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const doc = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc,
            },
        });
    });
```

Now we can require and implement:

```
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
```

### Getting data based on current user

Similar to updateMe and deleteMe endpoints we already have in place. We add this middleware below before we call getOne as it gets the users id

```
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
```

Then we create a new route

```
router.get(
    '/me',
    authController.protect,
    userController.getMe,
    userController.getUser
);
```

So if we login then send the request /me : localhost:5000/api/v1/users/me

```
{
    "status": "success",
    "data": {
        "data": {
            "_id": "6394d406551fc24b625fad1a",
            "name": "rev",
            "email": "rev@craig.com",
            "role": "user",
            "__v": 0
        }
    }
}
```

## AUTH and PERMISSIONS

### Tours

get all tours - everyone
creating and editing: protected and only admins and lead-guides

```
router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour
    );

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour
    );
```

### Users

Open routes:

```
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
```

All other routes : users to be logged in, so we can run middleware befor them to ensure they are logged in.

```
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

**// To protect all routes below this pont we can run this Middleware before**
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updateMyPassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

**// To ensure admins can only do the midleware functions below this**
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
```

### Reviews

```
const router = express.Router({ mergeParams: true });

**// All actions after this must be users that have logged in**
router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    );

module.exports = router;
```

## Data importing and deleting

All password encryption is to be turned off while importing as the password encryption is done already.

So in the UserModel:

```
// Comment out to import as the passwords being imported are already encrypted -- REMOVE after imoporting data

// Encrypt the pw if its being changed/added
userSchema.pre('save', async function (next) {
    // only run this if pw actually modified
    if (!this.isModified('password')) return next();

    // Hash the pw if the above passed with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // delete the passwordConfirm as we dont need it
    this.passwordConfirm = undefined;
    next();
});

// Set the password changed property if the password has changed on save (if it has not changed or its a new entry go to next else set ). We also set the date back 1second to ensure that the time is earlier than the token actualy created. Token needs its date to be after the passwordChanged timestamp so this hack does this.
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// Comment out to here to stop encrypting during imoporting
```

And our script looks like:

```
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;
mongoose.connect('mongodb://localhost:27017/natours').then(() => {
    console.log('DB connection successful!');
});

// READ JSON FILES
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// PASSWORD for all users : test1234

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
```

To import and delete

```
node ./dev-data/data/import-dev-data.js --import
node ./dev-data/data/import-dev-data.js --delete
```

## MongoDB performance

If we use the following we see it slows down a lot: {{URL}}/api/v1/tours?price[lt]=1000.

We can improve this be indexing our data. But to see more mong results we can add an explain method to the end of the query and mongo then runs analysis code and give us this output: so in our :handlerFactory under "getAll" add -- explain to end

```
exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        //const doc = await features.query;
        **const doc = await features.query.explain();**

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc,
            },
        });
    });
```

This give us a lot of output. What we are interested in is: executionStats.

If we want to speed up the queerying we need to index: We can see in Compass that the ID's are always indexed. Lets set an index on price.

```
tourSchema.index({ price: 1 });
```

Now the differance is that mongo only scans 3 docs and not all as before

This made a huge differance, but what if our query is:

```
{{URL}}/api/v1/tours?price[lt]=1000&ratingsAverage[gte]=4.7
```

We can then index the ratingAverage as well to improve this

```
tourSchema.index({ price: 1, ratingsAverage: 1 });
```

now total scanned is 2 : V GOOD!

```
                "totalKeysExamined": 4,
                "totalDocsExamined": 2,
```

When creating compound indexes we dont need to create single ones. We do most of our queries using price , ratingsAverage and slug. So lets make one for slug.

```
tourSchema.index({ price: 1, ratingsAverage: 1 });
tourSchema.index({ sluge: 1 });
```

Its good to delete duplicate indexes.

## Calculations in MongoDB

Calculate the averageRating on tours. This must run when new reviews added. We write a static method in the reviews schema. We could use an instance method as well.

Static method:

```

// Static method to calculate the new ratingsAverage on tours
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    console.log(stats);
};

// Call the static method on post save as then we have access to it.
reviewSchema.post('save', function() {
    // this points to current review
    // Review.calcAverageRatings(this.tour) (cant do this as Review is not available yet so we use this.constructor that points to Review)
    this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
```

The output after adding one of 5 and one of 3

```
POST /api/v1/tours/6396066a36d9921279e3192d/reviews 201 42.514 ms - 269
[
  {
    _id: new ObjectId("6396066a36d9921279e3192d"),
    nRating: 1,
    avgRating: 5
  }
]
POST /api/v1/tours/6396066a36d9921279e3192d/reviews 201 7.228 ms - 269
[
  {
    _id: new ObjectId("6396066a36d9921279e3192d"),
    nRating: 2,
    avgRating: 4
  }
]
```

Now we need to persist the calculation into the Tour model: so we require it in the reveiwModel first.

Doing this on save is easy as we have access to pre and post but not when we use : So we have to do this:

findByAndUpdate and findByAndDelete

```
// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
```

## Geospacial queries

MongoDB has very good geospacial querying capablities: $geoWithin - example.

The route with params to populate:

```
router.route(
    '/tours-within/:distance/center/:latlng/unit/:unit',
    tourController.getToursWithin
);
```

Now the handler function

```
// /tours-within/:distance/center/:latlng/unit/:unit'
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng) {
        next(
            new AppError(
                'Please supply a latitude and longitude in the format lat,lng.',
                400
            )
        );
    }
    //console.log(distance, lat, lng, unit);

    // convert to radians radius in miles 3963.2
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 678.1;

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } },
    });

    res.status(200).json({
        status: 'success',
        data: {
            data: tours,
        },
    });
});
// SENT {{URL}}/api/v1/tours/tours-within/400/center/34.111745,-118.116786/unit/mi
```

Distance between a point and other points

Or route for this calc:

```
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
```

We changed the output using "project"

```
// /distances/:latlng/unit/:unit
// We use the aggregation pipeline with $geoNear: needs one 2Dsphere point and the 1st stage must start with $geoNear. All distances to are points that are indexed as 2Dsphere points - startLocation.
exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(
            new AppError(
                'Please supply a latitude and longitude in the format lat,lng.',
                400
            )
        );
    }
    // near is the point from which all distances are from. We use our lat and lng but need to specify that its a geolocation
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1], // we multply by one to convert to Numbers
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
                spherical: true,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances,
        },
    });
});

// {{URL}}/api/v1/tours/distances/34.111745,-118.113491/unit/km
```

Output: in km if you want in miles use: mi at end of query string

```
{
    "status": "success",
    "data": {
        "data": [
            {
                "_id": "5c88fa8cf4afda39709c2966",
                "name": "The Sports Lover",
                "distance": 64.70947940317292
            },
            {
                "_id": "5c88fa8cf4afda39709c2961",
                "name": "The Park Camper",
                "distance": 348.1666610953302
            },
            {
                "_id": "5c88fa8cf4afda39709c296c",
                "name": "The Wine Taster",
                "distance": 597.921626704838
            },
            {
                "_id": "5c88fa8cf4afda39709c2970",
                "name": "The Star Gazer",
                "distance": 850.3423752068612
            },
            {
                "_id": "5c88fa8cf4afda39709c295a",
                "name": "The Snow Adventurer",
                "distance": 1154.8223099830946
            },
            {
                "_id": "5c88fa8cf4afda39709c2951",
                "name": "The Forest Hiker",
                "distance": 1910.9265042377394
            },
            {
                "_id": "5c88fa8cf4afda39709c2974",
                "name": "The Northern Lights",
                "distance": 3164.2206926417966
            },
            {
                "_id": "5c88fa8cf4afda39709c2955",
                "name": "The Sea Explorer",
                "distance": 3751.390629902804
            },
            {
                "_id": "5c88fa8cf4afda39709c295d",
                "name": "The City Wanderer",
                "distance": 3927.894639799981
            }
        ]
    }
}
```

## API documentation using Postman

Hide sensitive data like pw's in "login". Use environment vars for them.

```
{
    "email": "admin@natours.io",
    "password":"{{pw}}"
}
```

Then just label all in documentation tab for all folders and items. Then just publish..

## Pug Templating

Install pug:

```
npm i pug
```

We import the path module and then set the view engine and where the viiews are located. Nothing needs to be installed as path is native to nodejs.

```
const path = require('path');
const express = require('express');


const app = express();

// For Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
```

Add the route

```
// 3) ROUTES
app.get('/', (req, res) => {
    res.status(200).render('base');
})
```

And our template: pug

```
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Natours
        link(rel='stylesheet' href='css/stylsheet')
        link(rel='shortcut icon' type='image/png' href='img/favicon.png')
    body
        h1 The Park Camper
        p This is just some text

```

Now for more PUG magic:

```
// 3) ROUTES
app.get('/', (req, res) => {
    res.status(200).render('base',
    {
        tour: 'The Forest Hiker',
        user: 'Jonas'
    });
})
```

The HTML:

```
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Natours #{tour}
        link(rel='stylesheet' href='css/stylsheet')
        link(rel='shortcut icon' type='image/png' href='img/favicon.png')
    body

        h1= tour
        h2= user.toUpperCase()

        // h1 The Park Camper seen in source !!
        //- h1 The Park Camper, not seen at all


        h1 The Park Camper
        p This is just some text


        - const x = 9;
        h2= 2 * x
```

Output:

```
The Forest Hiker
JONAS
The Park Camper
This is just some text

18
```

### Pug base template

```
// base.pu
doctype html
html(lang='en')
    head
        // HEAD
        meta(charset="UTF-8")
        meta(http-equiv='X-UA-Compatible', content='IE=edge')
        meta(name='viewport', content='width=device-width, initial-scale=1.0')
        link(rel='stylesheet' href='css/style.css')
        link(rel='shortcut icon' type='image/png' href='img/favicon.png')
        link(rel='stylesheet' href='https://fonts.googleapis.com/css?family=Lato:30,300i,700')
        title Natours | Exciting tours for Adventurous people

    body
        // HEADER
        include _header

        // CONTENT
        section.verview
            h1= tour

        // FOOTER
        include _footer

// header.pug
header.header
    nav.nav.nav--tours
        a.nav__el(href='#') All tours
    .header__logo
        img(src='img/logo-white.png' alt='Natours logo')
    nav.nav.nav--user
        //- a.nav__el(href='#') My bookings
        //- a.nav__el(href='#')
        //-     img.nav__user-img(src='img/user.jpg' alt='User photo')
        //-     span Jonas
        button.nav__el Log in
        button.nav__el.nav__el--cta Sign up

// footer.pug
footer.footer
    .footer__logo
        img(src='img/logo-green.png' alt='Natours logo')
    ul.footer__nav
        li: a(href='#') About us
        li: a(href='#') Download appss
        li: a(href='#') Become a guide
        li: a(href='#') Careers
        li: a(href='#') Contact
    p.footer__copyright &copy; by Jonas Schmedmann

```

### Extending

Filling the base template with contents from other pages: extending. We put a "block" in the base where we want the extension. Pug allows you to replace (default), prepend, or append blocks.

```
doctype html
html(lang='en')
    head
        // HEAD
        meta(charset="UTF-8")
        meta(http-equiv='X-UA-Compatible', content='IE=edge')
        meta(name='viewport', content='width=device-width, initial-scale=1.0')
        link(rel='stylesheet' href='css/style.css')
        link(rel='shortcut icon' type='image/png' href='img/favicon.png')
        link(rel='stylesheet' href='https://fonts.googleapis.com/css?family=Lato:30,300i,700')
        title Natours | Exciting tours for Adventurous people

    body
        // HEADER
        include _header

        // CONTENT
        block content
            h1 This is a placeholder for content

        // FOOTER
        include _footer
```

In the file to insert: overview.pug

```
extends base

block content
    h1 This is the tour overview
```

In the tour.pug file

```
extends base

block content
  h1 This is the tour overview
```

Now in our Express routes we use the overview and the tour.pug files.

```
// 3) ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Jonas',
  });
});

app.get('/overview', (res, req) => {
  res.status(200).render('overview', {
    title: 'Tours overview',
  });
});

app.get('/tour', (res, req) => {
  res.status(200).render('tour', {
    title: 'Tour details',
  });
});
```

Now in our base file we can change the title to be interpolated using the title in the express app.js file.

```
        title Natours | #{title}
```

### Mixins

Mixins are pices of code that can have parts interpolated to keep code minimal. Pieces of code are cut our of the main section of a pug file and moved to the topwhere they are converted to a mixin. The example below:

```
// Calling the mixin in the pug file
  section.section-reviews
    .reviews
      each review in tour.reviews
        **+reviewCard(review)**
```

The mixin is always at the top of the file or can be a seperate file included at the top:

```
mixin reviewCard(review)
  .reviews__card
    .reviews__avatar
      img.reviews__avatar-img(src=`/img/users/${review.user.photo}`, alt=`${review.user.name}`)
      h6.reviews__user= review.user.name
    p.reviews__text= review.review
    .reviews__rating

      each star in [ 1, 2, 3, 4, 5 ]
        svg.reviews__star(class=`reviews__star--${review.rating >= star ? 'active' : 'inactive'}`)
          use(xlink:href='/img/icons.svg#icon-star')
```

## Client side rendering MAPBOX

We need to place CDN code in the head: but only for the tour.js so mapbox can work. So we use the append kyword to add to the head in the tour.pug file we place the block. We load a script for client side js to be run a the end of the base.pug file

```
// base.pug
doctype html
html
  head
    //- HEAD (the tour.pug file appends data to the head below)
    block head
      meta(charset="UTF-8")
      meta(http-equiv='X-UA-Compatible', content='IE=edge')
      meta(name='viewport', content='width=device-width, initial-scale=1.0')
      link(rel='stylesheet' href='/css/style.css')
      link(rel='shortcut icon' type='image/png' href='/img/favicon.png')
      link(rel='stylesheet' href='https://fonts.googleapis.com/css?family=Lato:30,300i,700')
      title Natours | #{title}

  body
    //- HEADER  (Includes allows insert the contents of one Pug file into another.)
    include _header

    //- CONTENT (Replaces the content with file)
    block content
      h1 This is a placeholder for content

    //- FOOTER (Includes allows insert the contents of one Pug file into another.)
    include _footer

    **script(src='/js/mapbox.js')**  // Run these last so they get data
```

Tour.pug allowing the cdn script and stylesheet to be read after the header.

```
// tour.pug
extends base

block append head
  script(src='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js')
  link(href='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css' rel='stylesheet')
```

```
// mapbox.js (in the public static folder /js/mapbox.js)
console.log('Hello from Client Side')
```

We need access in the mapbox.js file to the locations in the Tours model. So how can we do this? We could do a call to the API via AJAX request.

Easier way is to call the data in the our tour file and read it into the HTML as a string then parse it in the mapbox file back to an object ready for use.

In javascript we can place data into an element and the reach this data using javascript.

we use the element that mapbox needs to store the data in the tour.pug file

```
section section-map
  #map()
```

This is required by Mapbox and we set the data attribute in here data-"xxx" to be read by our mapbox.js file: BUT we cannot place it in the HTML as an object we have to stringify it!

```
  #map(data-locations=`${JSON.stringify(tour.locations)}`)
```

Looking at our source now we can see the data:

```
<div id="map" data-locations="[{&quot;type&quot;:&quot;Point&quot;,&quot;coordinates&quot;:[-106.855385,39.182677],&quot;description&quot;:&quot;Aspen Highlands&quot;,&quot;day&quot;:1,&quot;_id&quot;:&quot;5c88fa8cf4afda39709c295c&quot;},{&quot;type&quot;:&quot;Point&quot;,&quot;coordinates&quot;:[-106.516623,39.60499],&quot;description&quot;:&quot;Beaver Creek&quot;,&quot;day&quot;:2,&quot;_id&quot;:&quot;5c88fa8cf4afda39709c295b&quot;}]"></div>
```

Now to get this data back as an object so mapbox can use it: we sent as a string so we also now need to JSON.parse it to get it back to an object.

```
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);
```

In the console we see an array we can access:

```
Array(2)
0:
coordinates: (2) [-106.855385, 39.182677]
day: 1
description: "Aspen Highlands"
type: "Point"
_id: "5c88fa8cf4afda39709c295c"
[[Prototype]]: Object
1:
coordinates: (2) [-106.516623, 39.60499]
day: 2
description: "Beaver Creek"
type: "Point"
_id: "5c88fa8cf4afda39709c295b"
```

Now we add the map into the tour file via mapbox.js file. Get the code required from mapbox.io and the token then add it as follows:

```
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
'pk.eyJ1IjoiY3JhaWdhdG5ldHNlY3VyaXR5ZG90Y29kb3R6YSIsImEiOiJjbGJtYzdzazEwODMxM29taWpsaDR5bnY1In0.RU4SQrxvmZWiG9cDfTmg7g';

var map = new mapboxgl.Map({
  **container: 'map',**
  style: 'mapbox://styles/mapbox/streets-v11'
});
```

We can "style" our own map in mapbox.io and set it here.

Then add markers and popups: lots more then leaflet

```

// turn off eslint as its configured for node not JS
/* eslint-disable */

// the locations stored in the dataset.locations
//  in the tour.pug file
// #map(data-locations=`${JSON.stringify(tour.locations)}`)

// we sent as a string so we also now need to JSON.parse it to get it back to an object

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
'pk.eyJ1IjoiY3JhaWdhdG5ldHNlY3VyaXR5ZG90Y29kb3R6YSIsImEiOiJjbGJtYzdzazEwODMxM29taWpsaDR5bnY1In0.RU4SQrxvmZWiG9cDfTmg7g';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/craigatnetsecuritydotcodotza/clbncsb86000614l1o0hygurn',
  // center: [-118.113491, 34.111745],  // long then lat
  // zoom: 9,
  //interactive: false // makes all not interactive

  // We want to turn off scroll to zoom so we can scroll the page
  scrollZoom: false
});

// We dont want to center but need the map to bound to the location marker given
const bounds = new mapboxgl.LngLatBounds();

// const marker = new mapboxgl.Marker()
// .setLngLat([-118.113491, 34.111745])
// .addTo(map);

locations.forEach(loc => {
  // console.log(loc.coordinates);

  // Create a marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add the marker
  new mapboxgl
    .Marker({
    element: el,
    anchor: 'bottom',
  })
  .setLngLat(loc.coordinates)
  .addTo(map);

  // Add popups
  new mapboxgl
    .Popup({
      offset: 30
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 200,
    right: 200,
  }
})
```

## Building a login page:

In viewRouter

```
router.get('/login', viewsController.getLoginForm);
```

Then in ourt viewController

```
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login into your account',
  });
};
```

Thats it: doesnt need to be asynchronouse

## Login on front end

This is done in the client side so we should do this in the clientside js code. In the public/js folder we create a file called login.js and listen for the login submit event on the form element.

We use Axios to query the api: install using the cdn

```
// base.pug
    script(src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js")
    script(src='/js/mapbox.js')
    script(src='/js/login.js')
```

```
// login.js
// turn off eslint as its configured for node not JS
/* eslint-disable */

// we create a login function that accepts an email and a password
// only modern browsers can handle async await
const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/api/v1/users/login',
      data: {
        email,
        password
      }
    })
    console.log(res.data.token);
  } catch (error){
    console.log(error.response.data)   // in axios docs
  }
}

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // We use axios to login
  login(email, password);
  //console.log('CLICKED LOGIN');
});

```

WEe get the response on passed login: console.log(res.data.token); This gives us our JWT that is sent into our web browser as cookie.

To see the cookies we can install some middleware:

```
npm i cookie-parser
```

In our app.js we can require it and setup to see the cookies

```
const cookieParser = require('cookie-parser');

// then just after the body parser we add the line to parse data from cookie
app.use(cookieParser());
```

Now in our console logs we can see the jwt cooie being sent to server.

```
{
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGEkkkkkkkkkkkkkkkkkkkkkkkwiZXhwIjoxNjc4ODcxMjQzfQkkkkkkkkkkkkkkkkkkqPsU62KgKCkeF_Tk-R344Fu4Gc'
}
```

This is not as is the case in the API client where its sent as an auth header with "Bearer jwt". So we need to add the jwt cookie coming from the GUI client in the authController protect function so it can be authorised.

```
// authController.js
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }** else if (req.cookies.jwt) {
    token = req.cookies.jwt;**
}
```

Now we can add the authController to our viewRoutes.js and protect our details page etc.

```
const authController = require('authController');

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', authController.protect, viewsController.getDetails);
router.get('/login', viewsController.getLoginForm);
```

### Conditional rendering

Create a middleware route in authController only for rendered pages. IsLoggedIn

We dont throw any errors but we verify the token in the cookie, check if user still exists, check if pw changes after the token was issues.

THEN ----- we pass a parameter "res.locals.user = currentUser" that gets picked up in the template

```
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // 1) If cookie exists called jwt, then run this
  if (req.cookies.jwt) {
    // 2). Verifies the cookie/token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // If all of the above PASS then......
    // 5). There IS a logged in user: make accessable to templates
    res.locals.user = currentUser;
  }
  next();
});
```

Now we need to run this new middlewarein the routes file.

```
// viewRoutes.js
const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

**router.use(authController.isLoggedIn);**

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getDetails);
router.get('/login', viewsController.getLoginForm);

module.exports = router;
```

Conditionals in Pug are not so powerfull but for what we going to do now are good enough.

We need to check and see if the currentUser is set and being passed in to the response by the server. We do this in the header - header.pug

```
header.header
    nav.nav.nav--tours
        a.nav__el(href='/') All tours
    .header__logo
        img(src='/img/logo-white.png' alt='Natours logo')
    nav.nav.nav--user
      **if user**
        a.nav__el.nav__el--logout Log out
        a.nav__el(href='#')
            img.nav__user-img(src=`/img/users/${user.photo}` alt=`Photo of: ${user.name}`)
            span= user.name.split(' ')[0]
      **else**
        button.nav__el(href='/login') Log in
        button.nav__el.nav__el--cta Sign up
```

## Redirecting after login

In our API when login: if the username and password were good and we send a token we also sent a response with a status of "success"

```
// login.js
const login = async (email, password) => {
  // console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/api/v1/users/login',
      data: {
        email,
        password
      }
    })
    // console.log(res.data.token);

**    // Redirect after login
    if(res.data.status === 'success') {
      alert('Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500)
    }



  } catch (error){
    //console.log(error.response.data)   // in axios docs
    alert(error.response.data.message);**
  }
}

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // We use axios to login
  login(email, password);
  //console.log('CLICKED LOGIN');
});
```

## Parcel and Babel : bundle our js and use npm for axios

Install it:

```
npm i parcel-bundler -D
npm i @babel/polyfill
```

And:

```
  "scripts": {
    "start": "nodemon server.js",
    "start:prod": "NODE_ENV=production nodemon server.js",
    "debug": "ndb server.js",
    "watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js",
    "build:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
  },
```

In our pug base.pug file we remove all js scripts and only add the bundle.js created by parcel.

```
    //- script(src='https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js')
    //- script(src='/js/mapbox.js')
    //- script(src='/js/login.js')
    script(src='/js/bundle.js')
```

Now as we wont be using axios cdn lets install that direcly into node.

```
npm i axios
```

We then import the module axios ONLY IN THE LOGIN FILE" so it can be bundled.

```
// login.js
import axios from 'axios';
```

Now we can create our index file and include all our js files. We take all data that comes from the user interface by way of listeners tc and put them directly in the index.js file

So: starting with login.js then create a function for the mapbox file as well

We end up with:

```
//index.js
/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';


// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

// DELEGATION
if(mapBox) {
 const locations = JSON.parse(mapBox.dataset.locations);
 displayMap(locations)
// console.log(locations);
}

// Login submit listener - calls login
if(loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
    //console.log('CLICKED LOGIN');
  })
}
```

The login.js file:

```
// turn off eslint as its configured for node not JS
/* eslint-disable */
import axios from 'axios';

// we create a login function that accepts an email and a password
// only modern browsers can handle async await
export const login = async (email, password) => {
  //console.log('LOGIN');
  //console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/api/v1/users/login',
      data: {
        email,
        password
      }
    })
    console.log(res);

    // Redirect after login
    if(res.data.status === 'success') {
      alert('Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500)
    }



  } catch (error){
    console.log(error.response.data)   // in axios docs
    alert(error.response.data.message);
  }
}
```

The mapbox.js file:

```
/* eslint-disable */

export const displayMap = locations => {

  mapboxgl.accessToken =
  'pk.eyJ1IjoiY3JhaWdhdG5ldHNlY3VyaXR5ZG90Y29kb3R6YSIsImEiOiJjbGJtYzdzazEwODMxM29taWpsaDR5bnY1In0.RU4SQrxvmZWiG9cDfTmg7g';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/craigatnetsecuritydotcodotza/clbncsb86000614l1o0hygurn',
    // center: [-118.113491, 34.111745],  // long then lat
    // zoom: 9,
    //interactive: false // makes all not interactive

    // We want to turn off scroll to zoom so we can scroll the page
    scrollZoom: false
  });

  // We dont want to center but need the map to bound to the location marker given
  const bounds = new mapboxgl.LngLatBounds();

  // const marker = new mapboxgl.Marker()
  // .setLngLat([-118.113491, 34.111745])
  // .addTo(map);

  locations.forEach(loc => {
    // console.log(loc.coordinates);

    // Create a marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add the marker
    new mapboxgl
      .Marker({
      element: el,
      anchor: 'bottom',
    })
    .setLngLat(loc.coordinates)
    .addTo(map);

    // Add popups
    new mapboxgl
      .Popup({
        offset: 30
      })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 200,
      right: 200,
    }
  })
};
```

Now using parcel:

```
npm run watch:js
// and in other term
npm run start
```

### Alerting

Create a function called showAlert and export it. Do this in alerts.js

```
/* eslint-disable */

// hiding the alert
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  // go to parent and remove child if exists
  if (el) el.parentElement.removeChild(el);
}


// type is success or error
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000); // hide after 5sec
}
```

Then finally: use this in the login.js file

```
// turn off eslint as its configured for node not JS
/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// we create a login function that accepts an email and a password
// only modern browsers can handle async await
export const login = async (email, password) => {
  //console.log('LOGIN');
  //console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/api/v1/users/login',
      data: {
        email,
        password
      }
    })
    console.log(res);

    // Redirect after login
    if(res.data.status === 'success') {
      showAlert('success', 'Logged in successfully')
      // alert('Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500)
    }



  } catch (error){
    console.log(error.response.data)   // in axios docs
    //alert(error.response.data.message);
    showAlert('error', error.response.data.message);
  }
}
```

## Log out

We created an "httpOnly: true" cookie: see authController so with this method we cannot delete it from the client. The best way around this is to re-issue a token with the same name but with no token. Also we give it a very short expiration time.

Once the token is issued the isLoggedIn function will run in viewRoutes:

router.use(authController.isLoggedIn);

When this does, it will fail: and say error. The error is coming from the catchAsync function, so we remove that and allow it to fail as ti gets to the catch and then we just set it to go to next().

```
// login.js

// logout function
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url:'http://127.0.0.1:5000/api/v1/users/logout',
    });

    // Redirect after logout
    if(res.data.status === 'success') location.reload(true);
    // above gets the server to reload the page NOT browser

  } catch(error) {
    //console.log(error);
    showAlert('error', 'Error logging out! Try again.')
  }
};
```

Edited authController isloggedIn function

```
exports.isLoggedIn = async (req, res, next) => {
  // 1) If cookie exists called jwt, then run this
  if (req.cookies.jwt) {
    try {
      // 2). Verifies the cookie/token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 4) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // If all of the above PASS then......
      // 5). There IS a logged in user: make accessable to templates
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
```

And the index.js scriptedited :

```
/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';
import { logout } from './login';


// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

// DELEGATION
if(mapBox) {
 const locations = JSON.parse(mapBox.dataset.locations);
 displayMap(locations)
// console.log(locations);
}

// Login submit listener - calls login
if(loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
    //console.log('CLICKED LOGIN');
  })
}

if(logOutBtn) {
  logOutBtn.addEventListener('click', logout)
}

```

## Rendering error pages in the GUI

If we type a tour wrong and go to the details page of a tour that doesnt exist we ge the error that we would get in the API exept in the browser.

```
{"status":"error","error":{"statusCode":500,"status":"error"},"message":"Cannot read properties of null (reading 'name')","stack":"TypeError: Cannot read properties of null (reading 'name')\n    at /home/craig/000-DEVonCorgi/KB/z-projects/Express-Schmedman/00-complete-node-bootcamp-master/4-natours/after-section-11/controllers/viewsController.js:35:22\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)"}
```

It would be better to give a better message that no tour was found, so in the viewsController:

```
exports.getTour = catchAsync(async (req, res, next) => {
  // 1. Get data for the requested tour
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review, rating, user',
  });

**  if(!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }**

  // 2. Build template
  // 3. Render template using data from #1 above
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});
```

So our error sending strategy (errorController) is to see if the environment is production or development and then send errors based on this. We can maintain the same strategy and test if the url is for api of gui. We use if req.originalUrl: this is the url without the host.

```
const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // this doesnt work so did next line
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
```

## User account page: profile

Form a template: create the account.pug file in view and get rid of duplication by creating mixins:

Before the mixins

```
main.main
  .user-view
    nav.user-view__menu
      ul.side-nav
        li.side-nav--active
          a(href='#')
            svg
              use(xlink:href='img/icons.svg#icon-settings')
            | Settings
        li
          a(href='#')
            svg
              use(xlink:href='img/icons.svg#icon-briefcase')
            | My bookings
        li
          a(href='#')
            svg
              use(xlink:href='img/icons.svg#icon-star')
            | My reviews
        li
          a(href='#')
            svg
              use(xlink:href='img/icons.svg#icon-credit-card')
            | Billing
      .admin-nav
        h5.admin-nav__heading Admin
        ul.side-nav
          li
            a(href='#')
              svg
                use(xlink:href='img/icons.svg#icon-map')
              | Manage tours
          li
            a(href='#')
              svg
                use(xlink:href='img/icons.svg#icon-users')
              | Manage users
          li
            a(href='#')
              svg
                use(xlink:href='img/icons.svg#icon-star')
              | Manage reviews
          li
            a(href='#')
              svg
                use(xlink:href='img/icons.svg#icon-briefcase')

    .user-view__content
      .user-view__form-container
        h2.heading-secondary.ma-bt-md Your account settings
        form.form.form-user-data
          .form__group
            label.form__label(for='name') Name
            input#name.form__input(type='text', value='Jonas Schmedtmann', required)
          .form__group.ma-bt-md
            label.form__label(for='email') Email address
            input#email.form__input(type='email', value='admin@natours.io', required)
          .form__group.form__photo-upload
            img.form__user-photo(src='img/user.jpg', alt='User photo')
            a.btn-text(href='') Choose new photo
          .form__group.right
            button.btn.btn--small.btn--green Save settings
      .line &nbsp;
      .user-view__form-container
        h2.heading-secondary.ma-bt-md Password change
        form.form.form-user-settings
          .form__group
            label.form__label(for='password-current') Current password
            input#password-current.form__input(type='password', placeholder='••••••••', required, minlength='8')
          .form__group
            label.form__label(for='password') New password
            input#password.form__input(type='password', placeholder='••••••••', required, minlength='8')
          .form__group.ma-bt-lg
            label.form__label(for='password-confirm') Confirm password
            input#password-confirm.form__input(type='password', placeholder='••••••••', required, minlength='8')
          .form__group.right
            button.btn.btn--small.btn--green Save password
```

After Mixins:

```
extends base

mixin navItem(link, text, icon, active)
  li(class= `${active ? 'side-nav--active' : ''}`)
    a(href=`${link}`)
      svg
        use(xlink:href=`img/icons.svg#icon-${icon}`)
      | #{text}

block content

  main.main
  .user-view
    nav.user-view__menu
      ul.side-nav
        +navItem('#', 'Settings', 'settings', true)
        +navItem('#', 'My Bookings', 'briefcase', false)
        +navItem('#', 'My Reviews', 'star', false)
        +navItem('#', 'Billing', 'card', false)

      //- admin nav ONLY IF USER IS role: admin
      - if (user.role === 'admin')
        .admin-nav
          h5.admin-nav__heading Admin
          ul.side-nav
            +navItem('#', 'Manage Tours', 'map', false)
            +navItem('#', 'Manage Users', 'users', false)
            +navItem('#', 'Manage Reviews', 'star', false)
            +navItem('#', 'Manage Bookings', 'briefcase', false)


    .user-view__content
      .user-view__form-container
        h2.heading-secondary.ma-bt-md Your account settings
        form.form.form-user-data
          .form__group
            label.form__label(for='name') Name
            input#name.form__input(type='text', value= `${user.name}`, required)
          .form__group.ma-bt-md
            label.form__label(for='email') Email address
            input#email.form__input(type='email', value= `${user.email}`, required)
          .form__group.form__photo-upload
            img.form__user-photo(src=`/img/users/${user.photo}`, alt='User photo')
            a.btn-text(href='') Choose new photo
          .form__group.right
            button.btn.btn--small.btn--green Save settings
      .line &nbsp;
      .user-view__form-container
        h2.heading-secondary.ma-bt-md Password change
        form.form.form-user-settings
          .form__group
            label.form__label(for='password-current') Current password
            input#password-current.form__input(type='password', placeholder='••••••••', required, minlength='8')
          .form__group
            label.form__label(for='password') New password
            input#password.form__input(type='password', placeholder='••••••••', required, minlength='8')
          .form__group.ma-bt-lg
            label.form__label(for='password-confirm') Confirm password
            input#password-confirm.form__input(type='password', placeholder='••••••••', required, minlength='8')
          .form__group.right
            button.btn.btn--small.btn--green Save password
```

Add the route for the page: We move the isloggedIn route from app.use so its not global as it runs a function twice. They both check the currentUser exists. So we split them. There is something that isLoggedIn runs that protect doesnt run: that is it assigns to "currentUser" to res.locals.user.

### Request-wide locals

Sometimes, you want to make a variable available in every res.render for a request, no matter what route or middleware the page is being rendered from. A typical example is the user object for the current user. This can be accomplished by setting it as a property on the res.locals object.

### Application-wide locals

Sometimes, a value even needs to be application-wide - a typical example would be the site name for a self-hosted application, or other application configuration that doesn't change for each request. This works similarly to res.locals, only now you set it on app.locals. Set app.locals.siteName = "Vegetable World"; in app.js and then in pug use #{siteName} to call it.

In authController

```
  // put the current user on req.user and like in isLoggedIn on res.locals.user
  req.user = currentUser;
  res.locals.user = currentUser;
```

Create the route for the - getAccount

```
// viewRouter.js
const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
```

In viewController we create the function:

```
// The protect midleware has already provided us the user so we dont need to query the DB. res.locals.user = currentUser
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
```

## Updating user data

There are two ways: normal traditional way: post method on the form. No javascript. Need another route and a route handler, forces a page reload and is a bit more difficult to handle errors.

### Traditional form based approach.

We specify our endpoints in the form element : using the action attribute: submit-user-data and method='POST". So when we submit the action will submit a POST request to the url in the attribute: action. The submission is url encoded (sent in url).

The input elements are sent with the name attributes given.

```
    .user-view__content
      .user-view__form-container
        h2.heading-secondary.ma-bt-md Your account settings
        form.form.form-user-data(action='/submit-user-data' method='POST')
          .form__group
            label.form__label(for='name') Name
            input#name.form__input(type='text', value= `${user.name}`, required, name='name')
          .form__group.ma-bt-md
            label.form__label(for='email') Email address
            input#email.form__input(type='email', value= `${user.email}`, required, name='email')
```

Now we need to impliment our route:

```
// changing user data by logged in user
router.post('/submit-user-data', viewsController.updateUserData);
```

create the handler in the viewController, just to see whats being sent

```
exports.updateUserData = (req, res) => {
  // lets just look at the body sent first
  console.log('UPDATING USER', req.body);
};
```

We get:

```
UPDATING USER {}
POST /submit-user-data - - ms - -
```

To fix we need to install a parser to read the url, we do this in app.js

```
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Form parser using urlencoded action form
**app.use(express.urlencoded({ extended: true, limit: '10kb' }));**
```

Now we get:

```
UPDATING USER { name: 'Eliana Sue Stout', email: 'eliana@example.com' }
```

To update the User data we will first need to import the User model in the controller and create the handler

```
//viewController
exports.updateUserData = catchAsync(async (req, res) => {
  // lets just look at the body sent first
  //console.log('UPDATING USER', req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  // render the acount page again with the new updated user
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
```

When you put in a wrong email structure we get a terrible error message and that is why this form method with the route and handler is not so great.

### Alternative method: Using the API

So we create a new js file called updateSettings.js. Very similar to login unction:

```
// updateSettings.js

/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';


export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:5000/api/v1/users/updateMe',
      data: {
        name,
        email,
      }
    })

    if(res.data.status === 'success') {
      showAlert('success', 'Update user data successfully')
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500)
    }

  } catch (error){
    showAlert('error', error.response.data.message);
  }
};
```

Then we can call it in index.js

```
/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';
import { logout } from './login';
**import { updateData } from './updateSettings';**


// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
**const updateBtn = document.querySelector('.btn__update--data');**

// DELEGATION
if(mapBox) {
 const locations = JSON.parse(mapBox.dataset.locations);
 displayMap(locations)
// console.log(locations);
}

// Login submit listener - calls login
if(loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
    //console.log('CLICKED LOGIN');
  })
}

if(logOutBtn) {
  logOutBtn.addEventListener('click', logout)
}

```

## Update password : GUI

We can change this function updateData to be used for both restting password and name and email.

```
// updateSettings.js
/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {

    const url =
      type === 'password'
        ? 'http://127.0.0.1:5000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:5000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if(res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`)
      // dont really need the below as we change the name after async see the call
      // window.setTimeout(() => {
      //   location.assign('/me');
      // }, 1000)
    }

  } catch (error){
    showAlert('error', error.response.data.message);
  }
};

```

And then in index we also update the name and the button to reflect change and working to change pw.

```
// index.js

/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';
import { logout } from './login';
import { updateSettings } from './updateSettings';


// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateBtn = document.querySelector('.btn__update--data');
const userPasswordForm = document.querySelector('.form-user-password');

// DELEGATION
if(mapBox) {
 const locations = JSON.parse(mapBox.dataset.locations);
 displayMap(locations)
// console.log(locations);
}

// Login submit listener - calls login
if(loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
    //console.log('CLICKED LOGIN');
  })
}

if(logOutBtn) {
  logOutBtn.addEventListener('click', logout)
}

if(updateBtn) {
  updateBtn.addEventListener('click', (async e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    await updateSettings({name, email}, 'data')

    document.querySelector('.user__in--header').innerHTML = name.split(' ')[0];
  }))
}

if(userPasswordForm) {
  userPasswordForm.addEventListener('submit', (async e => {
    e.preventDefault();
    document.querySelector('.btn__update--pw').innerHTML = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    // good to clear input fields, so lets await on the below and continue
    await updateSettings({passwordCurrent, password, passwordConfirm},
    'password')

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn__update--pw').innerHTML = 'save password.';
  }))
}
```

## Image uploads - Multer

Multer is a middleware to handle multipart form data - form encoding to upload files.

Install multer, and require it in the userRoutes.js file

```
npm install multer

// include in userRoutes where we need it
const multer = require('multer');

// we then configure an upload with an option destination:
const upload = multer({ dest: 'public/img/users' })

// then in the route we designate multer to a single upload and name of file
router.patch('/updateMe', upload.single('photo'), userController.updateMe);

```

We can see the multer putting the file on the req.object: in the hndler function add..

```
exports.updateMe = catchAsync(async (req, res, next) => {

  console.log(req.file);
  console.log(req.body);

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
```

Now in postman using the form data tab we can set the name to change and "photo" actually file to upload. We can the in the output see success and in console see the output of multer.

```
// log
{
  fieldname: 'photo',
  originalname: 'leo.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'public/img/users/',
  filename: 'cb371011fc4f64a500997680cee129e1',
  path: 'public/img/users/cb371011fc4f64a500997680cee129e1',
  size: 207078
}
[Object: null prototype] { name: 'Leo K Gillespi' }
PATCH /api/v1/users/updateMe 200 46.265 ms - 165
```

We see the upload but cant read it. At least its uploading. Lets now move all the multer middleware to the controller: userController.js

```
// userController - moved from userRoutes.js
const multer = require('multer');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const upload = multer({ dest: 'public/img/users/' });

exports.uploadUserPhoto = upload.single('photo');
```

Then add the handler into the route again being the new uploadUserPhoto handler.

#### Multer as a final solution calling handler in controller

We configure a Multer storage and a multer filter then we create the upload from there.

The file name are as follows: user-78783465g45r7-78556643330.jpeg. This is "user"-user_id-timestamp.jpg. This ensures uniqueness.

```
// userController - storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users/');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});
```

The filter - all mymetypes starting ith image are photos so we add that as a filter for photos.

```
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please pload only images.', 400), false);
  }
};
```

The multer in an aptions object

```
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
```

Now thge hendler being called from routes

```
exports.uploadUserPhoto = upload.single('photo');
```

Now we need to ensure we update the DB with the file name

```
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // Save the file if its uploaded
**  if (req.file) filteredBody.photo = req.file.filename;**
```

And set the new users that dont upload a file to have a default

```
// userModel
 photo: {
    type: String,
    default: 'default.jpeg',
  },
```

### Image processing and manipulation

We use the node package: sharp to manipulate the images in nodejs.

```
npm i sharp
```

In routes:

```
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
```

When users upload a file: we dont want to actually save the file to disk. We want to keep it in memory and manipulate it first then save. So...

We no longer need the multerStorage we have configured bu we simply set the multerstorage to multer.

const multerStorage = multer.memoryStorage;

We require sharp and change all to be as follows: (also name changed as was defined in storage)

We also need to use async and catchAsync as we do the resizing then call next and we want next to wait untill the process is done before continuing in the event loop.

```
**const multer = require('multer');
const sharp = require('sharp');**


**exports.uploadUserPhoto = upload.single('photo');**

**// image manipulation
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  // if no file go to next middleware
  if (!req.file) return next();

  // We removed the multerStorage that set the filenname so we do it here
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Crops the image
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  // call the next middlware handler: updateMe
  next();
});
**
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
**
  // Save the file if its uploaded
  if (req.file) filteredBody.photo = req.file.filename;**

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
```

#### Upload the image

In the html account.pug file we can now add in the form filed. There are four types represented in this page. Type for text, password, email and now for a file. We also specify the mimetypes we accept:

```
            input.form__upload(type='file', accept='image/*', id='photo', name='photo')
            label(for='photo') Choose a new photo
```

When we click the label element the id specified as photo will be activated. Label also has the text...

There are two wqays to send tbhis to the server:

1. Without the API (using the HTML specifying the action and the method). We would also have to specify the enctype multipart formdata.
2. With the API in index.js - we specify the formdata and type: and rewrite the form data as follows:

```
// index.js
if(updateBtn) {
  updateBtn.addEventListener('click', (async e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    await updateSettings(form, 'data')

    document.querySelector('.user__in--header').innerHTML = name.split(' ')[0];
  }))
}

// account.pug
          .form__group.form__photo-upload
            img.form__user-photo(src=`/img/users/${user.photo}`, alt='User photo')
            input.form__upload(type='file', accept= 'image/*', id='photo', name= 'photo')
            label(for= 'photo') Choose new photo
```

### Multiple image processing and manipulation

In our tour model we have an image cover and then images which is an array of images.

```
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
```

The array should be at least theree images. We actually are going to have image cover and images as an array.

In our tour controller: require both multer and sharp.

```
// tourController
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

// storing in memory
const multerStorage = multer.memoryStorage();

// Must be image file
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
```

Multer available ways to upload:

```
// fields: both single and multiple
exports.upLoadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// single as used in user model NB allows req.file
upload.single('image');

// array: array of images you need uploaded NB allows: req.files
upload.array('images', 5);
```

Now create the middleware to actually do the upload using the multer "fileds" configuration using configuration of storage and filter already done.

```
exports.upLoadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// upload.single('image'); allows for req.file
// upload.array('images', 5); allows for req.files

exports.resizeTourImages = (req, res, next) => {
  console.log(req.files);
  next();
};
```

In postman we create a new patch to update the tour with form body:
imageCover : - file
image : - file2
image : - file3
image : - file4

The url is with the id and add the middleware to the patch route in the tourRoutes.js

```
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.upLoadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
```

The console output: NOTE: the imageCover is an array: so we need to user [0]

```
[Object: null prototype] {
  imageCover: [
    {
      fieldname: 'imageCover',
      originalname: 'new-tour-1.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 48 00 48 00 00 ff e1 00 8c 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 05 01 12 00 03 00 00 00 01 00 01 ... 1857218 more bytes>,
      size: 1857268
    }
  ],
  images: [
    {
      fieldname: 'images',
      originalname: 'new-tour-2.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 48 00 48 00 00 ff e1 00 8c 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 05 01 12 00 03 00 00 00 01 00 01 ... 2321585 more bytes>,
      size: 2321635
    },
    {
```

Now we need to do the resizeImages. Cover first. The route to update a tour uses the factory handler:

```
exports.updateTour = factory.updateOne(Tour);
```

This takes whatever is in req.body and updates the document. So we need to add the name of the coverImage to the req.body for it to be updated!

```
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  //console.log(req.files);

  // move on if no cover or images sent
  if (!req.files.imageCover || !req.files.images) return next();

  // 1. Cover image
  // remember the updateOne route uses the req.body to update the doc with id. So we add imageCover to req.body doing this:
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  // Crops the Cover image which is [0] in the array "imageCover" then .buffer (see log)
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  next();
});
```

This should now update the document imageCover. http://127.0.0.1:5000/ we see the new tour with imageCover.

We can now use a foreach loop to process the array of images to resize them and add their names into the DB and sav.

```
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  //console.log(req.files);

  // move on if no cover or images sent
  if (!req.files.imageCover || !req.files.images) return next();

  // 1. Cover image
  // remember the updateOne route uses the req.body to update the doc with id. So we add imageCover to req.body doing this:
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  // Crops the Cover image which is [0] in the array "imageCover" then .buffer (see log)
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2. images
  // we need to use promis.all here as the async is nullified in a foreach loop so we fix this with Promis.all and map
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      // To get the filenames into the doc using the factory updateOne we need to create an array of filenames (expects an array of strings). Create empty array and push each filename into the array
      req.body.images = [];

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});
```

## Complex Email handling

### Welcome email

We create an email class: in email.js and use templates.

```
const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

// How we use this class (reset pw url):   new Email(user, url).sendWelcome();

// export a class and create constructor
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Craig Leppan <${process.env.EMAIL_FROM}>`;
  }

  // differant transports: for dev and production
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // use sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // send the actual email
    // 1. Render the html based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2. Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 3. Create a transport and send Email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token, (valid for only 10 minutes'
    );
  }
};
```

Above you can see the function takes in the template and a subject: the pug welcome template and the base email template. We move all styling out to another file \_style.pug.

Base email template: baseEmail.pug

```
//- Email template adapted from https://github.com/leemunroe/responsive-html-email-template
//- Converted from HTML using https://html2pug.now.sh/

doctype html
html
  head
    meta(name='viewport', content='width=device-width')
    meta(http-equiv='Content-Type', content='text/html; charset=UTF-8')
    title= subject

    include _style

  body
    table.body(role='presentation', border='0', cellpadding='0', cellspacing='0')
      tbody
        tr
          td
          td.container
            .content
              // START CENTERED WHITE CONTAINER
              table.main(role='presentation')

                // START MAIN AREA
                tbody
                  tr
                    td.wrapper
                      table(role='presentation', border='0', cellpadding='0', cellspacing='0')
                        tbody
                          tr
                            td
                              // CONTENT
                              block content

              // START FOOTER
              .footer
                table(role='presentation', border='0', cellpadding='0', cellspacing='0')
                  tbody
                    tr
                      td.content-block
                        span.apple-link Natours Inc, 123 Nowhere Road, San Francisco CA 99999
                        br
                        |  Don't like these emails?
                        a(href='#') Unsubscribe
          //- td  
```

The welcome

```
extends baseEmail

block content

  p Hi #{firstName},
  p Welcome to Natours, we're glad to have you 🎉🙏
  p We're all a big familiy here, so make sure to upload your user photo so we get to know you a bit better!
  table.btn.btn-primary(role='presentation', border='0', cellpadding='0', cellspacing='0')
    tbody
      tr
        td(align='left')
          table(role='presentation', border='0', cellpadding='0', cellspacing='0')
            tbody
              tr
                td
                  a(href=`${url}` , target='_blank') Upload user photo
  p If you need any help with booking your next tour, please don't hesitate to contact me!
  p - Jonas Schmedtmann, CEO
```

Block content is the stylesheet/css that is in its own file but included.

Now we can call the welcome function to send an email once we have signed up. In the authController

```
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();


  createSendToken(newUser, 201, res);
});
```

### Password reset email

An email gets sent to the email address with a 10minute token that is used to send the password and password confirmation.

So in the authController:

```
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
```

Then we use this token to reset the password

```
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});
```

The pug template

```
extends baseEmail

block content
  p Hi #{firstName},
  p Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: #{url}.
  p (Website for this action not yet implemented.)
  table.btn.btn-primary(role='presentation', border='0', cellpadding='0', cellspacing='0')
    tbody
      tr
        td(align='left')
          table(role='presentation', border='0', cellpadding='0', cellspacing='0')
            tbody
              tr
                td
                  a(href=`${url}` , target='_blank') Reset your passord
  p If you didn't forget your password, please ignore this email!
```

## SendinBlue: email termination

Have an account at sendinblue mailer (Free account: 300 emails / day). We send to sendinblue and sendinblue terminates. We change the settings in the config file:

```
EMAIL_FROM = 'craig@yoyozi.com'

SENDINBLUE_SMTPRELAY=smtp-relay.sendinblue.com
SENDINBLUE_SMTP_PORT=Port587
SENDINBLUE_USERNAME=craig@yoyozi.com
SENDINBLUE_PASSWORD=IWQJAhX6rH7pynsK
```

In the authcontroller we add:

```
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const url = `${req.protocol}://${req.get('host')}/me`;
  //console.log(url);

  **await new Email(newUser, url).sendWelcome();**


  createSendToken(newUser, 201, res);
});
```

In email.js we add the Class:

```
const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

// How we use this class (reset pw url):   new Email(user, url).sendWelcome();

// export a class and create constructor
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Craig Leppan <${process.env.EMAIL_FROM}>`;
  }

  // differant transports: for dev and production
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // use sendinblue
      return nodemailer.createTransport({
        service: 'SendinBlue',
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // send the actual email
    // 1. Render the html based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2. Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 3. Create a transport and send Email
    await this.newTransport().sendMail(mailOptions);
  }

**  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }**

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token, (valid for only 10 minutes'
    );
  }
};
```

Create a mail: mailsac.com. We then signin with a new user, using a mailsac address that catches our mail for testing.:

```
{
    "name": "mini",
    "email": "mini@mailsac.com",
    "password": "test1234",
    "passwordConfirm": "test1234"
}
```

Check the mailsac account and sendinblue and its terminited.

## Credit card payments with Stripe

Create the booking route and controller and integrate into the API.

1. Create bookingRouter.js and "const bookingController = require('./../controllers/reviewController');"
2. Create bookingController.js
3. In app.js: add the bookingRouter.js

```
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRouter');

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

```

### Create a checkout session

In bookingRouter.js

```
const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:tourID',
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;
```

#### Create the getCheckoutSession in the controller

We have access to the tourID as its sent in the url. So we need to get all relavant data regarding the tour that we need.

The bookingController:

```
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = (req, res, next) => {
  // 1. Get currently booked tour
  const tour = await Tour.findById(req.params.tourId)

  // 2. Create checkout


  // 3. Create a session as a response


};
```

We use catchAsync:

```
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2. Create checkout

  // 3. Create a session as a response

});
```

We can now install the stripe package

```
> npm install stripe
```

### Get secret key (TEST PK and SK) and store

In the Stripe CP using Test plaform get the API keys and store them in config.env

```
STRIPE_SECRET_KEY=..........................................
```

Now we import it into the controller by using an object so as not to expose it!!!

In bookingController

```
// Get stripe and the API sk
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2. Create checkout session that we create as const and await it as Stripe needs to save all data
  const session = await stripe.checkout.session.create({
    // options : first payment method type then url on success,
    // cancell and url after cancel, customer email, lient ref ID,
    // product details -(line items and fields from Stripe: name,
    // description, images (must be online/live), amount - price in cents
    // currency and quantity)
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3. Create a session as a response
  res.status(200).json({
    status: 'success',
    session
  })
});
```

### Test in Postman

url: {{URL}}/bookings/checkout-session/:tourID
url: {{URL}}/bookings/checkout-session/:
