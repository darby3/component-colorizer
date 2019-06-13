// Requires and module initializations
var Pickr = require("../node_modules/@simonwep/pickr/dist/pickr.min");
var get_luminance = require("./modules/getLuminance");
var get_contrast = require("./modules/getContrast");
var hiThere = require("./modules/helloThere");
var starships = require("./modules/starships");

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // hiThere();

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

    /**
     * Picker Container
     */

    var pickerContainer = {
      init: function (el) {
        let self = this;

        self.el = el;
        self.id = el.id;
        self.rgba_output = el.querySelector('.rgba');
        self.luminance_output = el.querySelector('.luminance');
        self.labelHolder = el.querySelector('[data-labeler]');
        self.labelHolder.tabIndex = 0;

        if (self.labelHolder.dataset.labeler == "") {
          self.labelHolder.dataset.labeler = self.labelHolder.innerHTML = el.dataset.name;
        }

        // Create a color picker
        self.createPicker();

        // Listeners
        self.addListeners();

        return self;
      },

      // Create a color picker
      createPicker: function() {
        let self = this;
        let pickerEl = this.el.querySelector('.color-picker');

        self.picker = Pickr.create({
          el: pickerEl,
          components: componentsOptions
        }).on('init', (...args) => {
          self.updateOutputs(args[0]['_color'].toRGBA());
          newComboObj.runComparisons();
        }).on('save', (...args) => {
          self.updateOutputs(args[0].toRGBA());
          newComboObj.runComparisons();
        })
      },

      // Event listeners
      addListeners: function() {
        let self = this;

        self.labelHolder.addEventListener('click', function() {
          self.addLabeler();
        });

        self.labelHolder.addEventListener('keyup', function(e) {
          if (e.keyCode === 13) {
            self.addLabeler();
          }
        });
      },

      // Activating the labeler field
      addLabeler: function() {
        let self = this;
        let catcher = document.createElement('input');

        catcher.value = self.labelHolder.dataset.labeler || self.labelHolder.innerHTML;
        self.el.insertBefore(catcher, self.labelHolder);
        catcher.focus();

        self.labelHolder.classList.toggle('hidden');

        catcher.addEventListener('blur', function() {
          self.removeLabeler();
        });

        catcher.addEventListener('keyup', function(e) {
          if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
            self.removeLabeler();
          }
        });

        self.catcher = catcher;
      },

      // Deactivating the labeler field
      removeLabeler: function() {
        let newValue = this.catcher.value;

        this.labelHolder.dataset.labeler = this.labelHolder.innerHTML = this.el.dataset.name = newValue;
        this.labelHolder.classList.toggle('hidden');

        this.el.removeChild(this.catcher);
        delete this.catcher;

        newComboObj.runComparisons();
      },

      // Updating the container output values
      updateOutputs: function(color) {
        this.rgba_output.innerHTML = color;
        this.luminance_output.innerHTML = get_luminance(color);
      },
    };

    // All picker containers

    let pickerHolders = [];
    let pickerHolderEls = document.querySelectorAll('.pickerHolder');

    for (let i = 0; i < pickerHolderEls.length; i++) {
      let newPicker = Object.create(pickerContainer).init(pickerHolderEls[i])
      pickerHolders.push(newPicker);
    }

    /**
     * Picker Combinations/Comparisons
     */

    // Get an array of all possible picker combinations.
    const getPickerCombos = function(pickerHolders) {
      let pickerCombinations = [];

      for (let i = 0; i < pickerHolders.length - 1; i++) {
        let x = pickerHolders[i];

        for (let j = i + 1; j < pickerHolders.length; j++) {
          let y = pickerHolders[j];
          pickerCombinations.push([ x, y ]);
        }
      }

      return pickerCombinations;
    };

    // Picker Container Combo Object

    let comparison = {
      init: function(x, y, xCol, yCol, ratio) {
        this.x = x;
        this.y = y;
        this.xCol = xCol;
        this.yCol = yCol;
        this.ratio = ratio;

        return this;
      }
    }

    let pickerCombos = {
      init: function() {
        this.combos = getPickerCombos(pickerHolders);

        return this;
      },

      comparisons: [],

      // Run comparisons
      runComparisons: function() {
        this.comparisons = [];

        for (let i = 0; i < this.combos.length; i++) {
          let x = this.combos[i][0].picker.getColor().toRGBA();
          let y = this.combos[i][1].picker.getColor().toRGBA();
          let xName = this.combos[i][0].el.dataset.name;
          let yName = this.combos[i][1].el.dataset.name;
          let ratio = get_contrast(x, y);

          this.comparisons.push(Object.create(comparison).init(
            xName,
            yName,
            x,
            y,
            ratio
          ));
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
          resultBox.querySelector('.result__ratio__value').innerHTML = this.comparisons[q].ratio;

          let resultObj = this.resultMessage(this.comparisons[q].ratio);

          // Sample box

          let firstColor = this.comparisons[q].xCol;
          let secondColor = this.comparisons[q].yCol;

          let sampleBox = resultBox.querySelector('.sample');

          sampleBox.style.color = firstColor;
          sampleBox.style.backgroundColor = secondColor;


          let resultMessageEl = resultBox.querySelector('.result__message');
          resultMessageEl.innerHTML = resultObj.message;
          resultMessageEl.dataset.resultlevel = resultObj.result;

          // Inverter button

          let inverter = resultBox.querySelector('[data-inverter]');
          inverter.addEventListener('click', function() {
            let sampleBox = this.closest('.results_box').querySelector('.sample');

            let colorOne = sampleBox.style.color;
            let colorTwo = sampleBox.style.backgroundColor;

            sampleBox.style.color = colorTwo;
            sampleBox.style.backgroundColor = colorOne;
          });

          outputBox.appendChild(resultBox);

          let newOutput = outputBox.lastElementChild;
          newOutput.dataset.status = resultObj.result;
        }
      },

      // Generate a result message based on the current ratio.
      resultMessage: function(ratio) {
        const failMessage = "This fails WCAG 2.0. Never do this.";
        const largeMessage = "This passes WCAG 2.0 for large text. Use with caution.";
        const safeMessage = "This passes WCAG 2.0. Go nuts!";

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

    const lumSwitch = document.querySelector('#lumSwitch');
    lumSwitch.addEventListener('change', function() {
      console.log("changed");
      const lumVals = document.querySelectorAll('.pickerHolder__luminance');
      if (this.checked) {
        lumVals.forEach(function(el) {
          el.classList.remove('hidden');
        });
      } else {
        lumVals.forEach(function(el) {
          el.classList.add('hidden');
        });
      }
    });


    const addNew = document.querySelector("#addPicker");
    addNew.addEventListener("click", function() {

      let template = document.querySelector('#picker_starter');
      let holder = document.querySelector('.pickers');
      let newPicker = document.importNode(template.content, true);

      holder.appendChild(newPicker);
      let newPickerEl = holder.lastElementChild;

      if (document.querySelector('#lumSwitch').checked) {
        newPickerEl.querySelector('.pickerHolder__luminance').classList.remove('hidden');
      } else {
        newPickerEl.querySelector('.pickerHolder__luminance').classList.add('hidden');
      }

      newPickerEl.dataset.name = starships.fly();
      pickerHolders.push(Object.create(pickerContainer).init(newPickerEl));

      newComboObj = Object.create(pickerCombos).init().runComparisons(true);
    });

    // Output Toggles
    let outputToggles = document.querySelectorAll('[data-targets="outputs"] [data-target]');

    outputToggles.forEach(function(el) {
      el.addEventListener('click', function() {
        let target = el.dataset.target;
        let outputs = document.querySelectorAll('.results_box[data-status=' + target + ']');

        if (outputs.length > 0) {
          outputs.forEach(function(el) {
            el.classList.toggle('hidden');
          })
        };
      });
    });

  });
}());
