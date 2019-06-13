// Say hello! A tiny module!
var helloWorld = function() {
  console.log("Hello from inside a module");

  // sandbox stuff

  let inputItems = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ];
  let outputItems = [];

  for (let i = 0; i < inputItems.length - 1; i++) {
    let x = inputItems[i];

    for (let j = i + 1; j < inputItems.length; j++) {
      let y = inputItems[j];
      let output = [ x, y ];

      outputItems.push(output);
    }
  }

  // console.log(outputItems);
};

module.exports = helloWorld;
