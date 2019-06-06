// Modern browsers (see .browserslistrc)
import Pickr from '../node_modules/@simonwep/pickr/dist/pickr.min';

// main scripts
(function () {

  document.addEventListener('DOMContentLoaded', function () {

    // Let's get this party started.
    console.log("Hello from the main app file");

    // Requires and module initializations
    var hiThere = require("./modules/helloThere");
    hiThere();

    // uhm.js
    const y = 9;
    var x = a => 1 + 3 + a;
    var z = x(y);
    var q = x(25);

    console.log('z = ', z);
    console.log('q = ', q);

    // Color Pickers
    const pickers = document.querySelectorAll('.color-picker');
    let activePickers = [];

    const componentsOptions = {
      // Main components
      preview: true,
      opacity: true,
      hue: true,

      // Input / output Options
      interaction: {
        hex: true,
        rgba: true,
        hsla: true,
        hsva: true,
        cmyk: true,
        input: true,
        clear: true,
        save: true
      }
    }

    // // primary color picker
    // const primaryPickerElement = document.getElementById('primaryPickerElement');
    // const primaryPicker = Pickr.create({
    //   el: primaryPickerElement,
    //   components: componentsOptions
    // });
    // activePickers.push(primaryPicker);
    //
    // primaryPicker.on('save', (...args) => {
    //   console.dir(args[1]);
    //
    //   const bodyCopy = document.querySelectorAll('.components .basic-copy h1, .components .basic-copy p');
    //   bodyCopy.forEach(function (el) {
    //     el.style.color = args[0].toHEXA().toString();
    //   })
    // });


    // primary color picker
    const primaryPickerElement = document.getElementById('primaryPickerElement');
    const primaryPicker = Pickr.create({
      el: primaryPickerElement,
      components: componentsOptions
    });
    activePickers.push(primaryPicker);

    primaryPicker.on('save', (...args) => {
      console.dir(args[1]);

      const bodyCopy = document.querySelectorAll('[data-colorsource="primary"], [data-colorsource="primary-on-secondary"]');
      bodyCopy.forEach(function (el) {
        el.style.color = args[0].toHEXA().toString();
      })
    });

    // // secondary color picker
    // const secondaryPickerElement = document.getElementById('secondaryPickerElement');
    // const secondaryPicker = Pickr.create({
    //   el: secondaryPickerElement,
    //   components: componentsOptions
    // });
    // activePickers.push(secondaryPicker);
    //
    // secondaryPicker.on('save', (...args) => {
    //   console.dir(args[1]);
    //
    //   const backgroundEl = document.querySelectorAll('.components .basic-copy');
    //   backgroundEl.forEach(function (el) {
    //     el.style.backgroundColor = args[0].toHEXA().toString();
    //   })
    // });



    // secondary color picker
    const secondaryPickerElement = document.getElementById('secondaryPickerElement');
    const secondaryPicker = Pickr.create({
      el: secondaryPickerElement,
      components: componentsOptions
    });
    activePickers.push(secondaryPicker);

    secondaryPicker.on('save', (...args) => {
      console.dir(args[1]);

      const secondaryEls = document.querySelectorAll('[data-colorsource="secondary"], [data-colorsource="primary-on-secondary"]');
      secondaryEls.forEach(function (el) {
        el.style.backgroundColor = args[0].toHEXA().toString();
      })
    });


    // tertiary color picker
    const tertiaryPickerElement= document.getElementById('tertiaryPickerElement');
    const tertiaryPicker = Pickr.create({
      el: tertiaryPickerElement,
      components: componentsOptions
    });
    activePickers.push(tertiaryPicker);


    // pickers.forEach(function (el) {
    //   const newPicker = Pickr.create({
    //     el: el,
    //
    //     components: {
    //       // Main components
    //       preview: true,
    //       opacity: true,
    //       hue: true,
    //
    //       // Input / output Options
    //       interaction: {
    //         hex: true,
    //         rgba: true,
    //         hsla: true,
    //         hsva: true,
    //         cmyk: true,
    //         input: true,
    //         clear: true,
    //         save: true
    //       }
    //     }
    //   });
    //
    //   activePickers.push(newPicker);
    // });

    // console.log(activePickers);
    //
    // activePickers.forEach(function(el) {
    //   el.on('save', (...args) => {
    //     console.dir(args[1]);
    //     // console.log(args[1].getColor());
    //     // console.log(args[0].toHEXA().toString());
    //     //
    //     // // args[1]._root.root.innerHTML(args[0].toHEXA().toString());
    //     // console.dir(args[1]._root.button);
    //     // args[1]._root.button.innerHTML = args[0].toHEXA().toString();
    //   })
    // })

    // Controllers

    const inverter = document.getElementById('invertWrapper');
    inverter.onclick = function (e) {
      const wrapper = document.getElementById('wrapperBackground');
      wrapper.classList.toggle('black');
      wrapper.classList.toggle('white');
    };

  });
}());
