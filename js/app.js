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
      console.dir(args[0]);

      const primaryEls = document.querySelectorAll('[data-colorsource="primary"], [data-colorsource="primary-on-secondary"]');
      primaryEls.forEach(function (el) {
        el.style.color = args[0].toHEXA().toString();
      })

      let holder = document.getElementById("primaryPickerHolder");
      holder.querySelector(".rgba").innerHTML = args[0].toRGBA();

      let RGBAthing = args[0].toRGBA();
      let luminance = get_luminance(RGBAthing);

      holder.querySelector(".luminance").innerHTML = luminance;

      check();
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

      let holder = document.getElementById("secondaryPickerHolder");
      holder.querySelector(".rgba").innerHTML = args[0].toRGBA();

      let RGBAthing = args[0].toRGBA();
      let luminance = get_luminance(RGBAthing);

      holder.querySelector(".luminance").innerHTML = luminance;

      check();
    });


    // tertiary color picker
    const tertiaryPickerElement = document.getElementById('tertiaryPickerElement');
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


    // Contrast ratio checking

    function get_luminance(rgba) {
      // Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
      for (var i = 0; i < 3; i++) {
        var rgb = rgba[i];

        rgb /= 255;

        rgb = rgb < .03928 ? rgb / 12.92 : Math.pow((rgb + .055) / 1.055, 2.4);

        rgba[i] = rgb;
      }

      return .2126 * rgba[0] + .7152 * rgba[1] + 0.0722 * rgba[2];
    }

    function get_contrast(colorA, colorB) {
      // Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef

      let l1 = get_luminance(colorA) + 0.05;
      let l2 = get_luminance(colorB) + 0.05;

      let ratio = floor((l1 > l2) ? (l1 / l2) : (1 / (l1 / l2)), 2);

      return ratio;
    }

    function check() {
      let primaryColor = primaryPicker.getColor().toRGBA();
      let secondaryColor = secondaryPicker.getColor().toRGBA();

      let ratio = get_contrast(primaryColor, secondaryColor);

      console.log(ratio);

      let outputBox = document.getElementById('primary-secondary-contrast-ratio');
      outputBox.innerText = ratio;

      const failMessage = "This totally fails WCAG 2.0. Don't do it."
      const largeMessage = "This passes WCAG 2.0 for large text. Use with caution."
      const safeMessage = "This totally passes WCAG 2.0. Go nuts!"

      const outputBoxMessage = document.getElementById('success-box');

      if (ratio < 3) {
        outputBoxMessage.innerText = failMessage;
        outputBoxMessage.classList.remove('large', 'safe');
        outputBoxMessage.classList.add('fail');
      } else if (ratio >= 3 && ratio < 4.5) {
        outputBoxMessage.innerText = largeMessage;
        outputBoxMessage.classList.remove('fail', 'safe');
        outputBoxMessage.classList.add('large');
      } else if (ratio >= 4.5) {
        outputBoxMessage.innerText = safeMessage;
        outputBoxMessage.classList.remove('fail', 'large');
        outputBoxMessage.classList.add('safe');
      }
    }

    // Math.floor with precision
    function floor(number, decimals) {
      decimals = +decimals || 0;

      var multiplier = Math.pow(10, decimals);

      return Math.floor(number * multiplier) / multiplier;
    }
  });
}());
