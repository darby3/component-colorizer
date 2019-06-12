// Requires and module initializations
var Pickr = require("../node_modules/@simonwep/pickr/dist/pickr.min");
var get_luminance = require("./modules/getLuminance");
var get_contrast = require("./modules/getContrast");
var hiThere = require("./modules/helloThere");

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    hiThere();

    // Color Pickers

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


    // Object-oriented color picker containers

    var pickerContainer = {
      init: function (el) {
        let self = this;

        this.el = el;
        this.id = el.id;
        this.rgba_output = el.querySelector('.rgba');
        this.luminance_output = el.querySelector('.luminance');

        this.labelHolder = el.querySelector('[data-labeller]');
        this.labelHolder.tabIndex = 0;

        // Create a color picker
        let pickerEl = el.querySelector('.color-picker');

        this.picker = Pickr.create({
          el: pickerEl,
          components: componentsOptions
        }).on('init', (...args) => {
          this.updateOutputs(args[0]['_color'].toRGBA());
        }).on('save', (...args) => {
          this.updateOutputs(args[0].toRGBA());

          newComboObj.runComparisons(true);
        });

        this.labelHolder.addEventListener('click', function(e) {
          self.addLabeller();
        });

        this.labelHolder.addEventListener('keyup', function(e) {
          if (e.keyCode === 13) {
            self.addLabeller();
          }
        });

        return this;
      },

      // Activating the labeller field
      addLabeller: function() {
        let self = this;
        let catcher = document.createElement('input');

        catcher.value = this.labelHolder.dataset.labeller || this.labelHolder.innerHTML;

        this.el.insertBefore(catcher, this.labelHolder);
        catcher.focus();
        this.labelHolder.classList.toggle('hidden');

        catcher.addEventListener('blur', function() {
          self.removeLabeller();
        });

        catcher.addEventListener('keyup', function(e) {
          if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
            self.removeLabeller();
          }
        });

        this.catcher = catcher;
      },

      // Deactivating the labeller field
      removeLabeller: function() {
        let newValue = this.catcher.value;

        this.labelHolder.dataset.labeller = this.labelHolder.innerHTML = this.el.dataset.name = newValue;

        this.el.removeChild(this.catcher);
        delete this.catcher;

        this.labelHolder.classList.toggle('hidden');
      },

      // Updating the container output values
      updateOutputs: function(color) {
        this.rgba_output.innerHTML = color;
        this.luminance_output.innerHTML = get_luminance(color);
      },
    };



    // Am array of picker holders

    let pickerHolders = [];

    document.querySelectorAll('.pickerHolder').forEach(function (el) {
      pickerHolders.push(Object.create(pickerContainer).init(el));
    });


    // Get all our possible picker combos, for accessibility comparison purposes

    const getPickerCombos = function() {
      let pickers = pickerHolders;
      let outputItems = [];

      for (let i = 0; i < pickers.length - 1; i++) {
        let x = pickers[i];

        for (let j = i + 1; j < pickers.length; j++) {
          let y = pickers[j];
          let output = [ x, y ];

          outputItems.push(output);
        }
      }

      return outputItems;
    };

    // Picker Container Combo Object

    let pickerCombos = {
      init: function() {
        console.log("initializing pickerCombos object");
        this.combos = getPickerCombos();

        return this;
      },

      comparisons: [],

      // Run comparisons
      runComparisons: function(verbose) {
        console.log('comparisons:');

        this.comparisons = [];

        for (let i = 0; i < this.combos.length; i++) {
          let x = this.combos[i][0].picker.getColor().toRGBA();
          let y = this.combos[i][1].picker.getColor().toRGBA();

          let ratio = get_contrast(x, y);

          this.comparisons.push({
            x: this.combos[i][0].el.dataset.name,
            y: this.combos[i][1].el.dataset.name,
            contrast: ratio
          });

          if (verbose) {
            this.comparisons.forEach(function(el) {
              console.log(el.x, ' : ', el.y, ' --> ', el.contrast);
            })
          };
        };

        this.updateOutputs();

        return this;
      },

      // Update output box
      updateOutputs: function() {
        let outputBox = document.querySelector('#accessibilityOutputs');

        while (outputBox.lastChild) {
          outputBox.removeChild(outputBox.lastChild);
        }

        let template = document.querySelector('#result_box');

        for (let q = 0; q < this.comparisons.length; q++) {
          let resultBox = document.importNode(template.content, true);

          resultBox.querySelector('.result__title__primary').innerHTML = this.comparisons[q].x;
          resultBox.querySelector('.result__title__secondary').innerHTML = this.comparisons[q].y;
          resultBox.querySelector('.result__ratio__value').innerHTML = this.comparisons[q].contrast;

          let resultOutput = this.resultMessage(this.comparisons[q].contrast);

          let resultMessageEl = resultBox.querySelector('.result__message');
          resultMessageEl.innerHTML = resultOutput.message;
          resultMessageEl.dataset.resultlevel = resultOutput.result;

          outputBox.appendChild(resultBox);
        }
      },

      resultMessage: function(ratio) {
        const failMessage = "This fails WCAG 2.0. Never do this.";
        const largeMessage = "This passes WCAG 2.0 for large text. Use with caution.";
        const safeMessage = "This totally passes WCAG 2.0. Go nuts!";

        if (ratio < 3) {
          return {
            result: 'fail',
            message: failMessage
          }
        } else if (ratio >= 3 && ratio < 4.5) {
          return {
            result: 'caution',
            message: largeMessage
          }
        } else if (ratio >= 4.5) {
          return {
            result: 'success',
            message: safeMessage
          }
        }

      }
    };

    let newComboObj = Object.create(pickerCombos).init().runComparisons(true);

    // Controllers
    const inverter = document.getElementById('invertWrapper');
    inverter.onclick = function (e) {
      const wrapper = document.getElementById('wrapperBackground');
      wrapper.classList.toggle('black');
      wrapper.classList.toggle('white');
    };

  });
}());
