// Requires and module initializations
var Pickr = require("../node_modules/@simonwep/pickr/dist/pickr.min");
var get_luminance = require("./modules/getLuminance");
var get_contrast = require("./modules/getContrast");
var hiThere = require("./modules/helloThere");

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    hiThere();

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
    };

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


    // Controllers
    const inverter = document.getElementById('invertWrapper');
    inverter.onclick = function (e) {
      const wrapper = document.getElementById('wrapperBackground');
      wrapper.classList.toggle('black');
      wrapper.classList.toggle('white');
    };


    // Contrast ratio checking
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

  });
}());
