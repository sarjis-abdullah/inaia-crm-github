<template>
    <div class="form-row">
      <div class="col-auto">
        <input type="text" class="form-control text-center" maxlength="1" autofocus v-model="state.digit1" @paste="onPaste" @keyup="(value) => onChange(value, 0)" ref="digit1Input" />
      </div>
      <div class="col-auto">
        <input type="text" class="form-control text-center" maxlength="1" v-model="state.digit2" @keyup="(value) => onChange(value, 1)" ref="digit2Input" />
      </div>
      <div class="col-auto">
        <input type="text" class="form-control text-center" maxlength="1" v-model="state.digit3" @keyup="(value) => onChange(value, 2)" ref="digit3Input" />
      </div>
      <div class="col-auto">
        <input type="text" class="form-control text-center" maxlength="1" v-model="state.digit4" @keyup="(value) => onChange(value, 3)" ref="digit4Input" />
      </div>
      <div class="col-auto" v-if="length > 4">
        <input type="text" class="form-control text-center" maxlength="1" v-model="state.digit5" @keyup="(value) => onChange(value, 4)" ref="digit5Input" />
      </div>
      <div class="col-auto" v-if="length > 4">
        <input type="text" class="form-control text-center" maxlength="1" v-model="state.digit6" @keyup="(value) => onChange(value, 5)" ref="digit6Input" />
      </div>
    </div>
  </template>
<script>
export default {
  props: {
    length: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      state: {
        digit1: null,
        digit2: null,
        digit3: null,
        digit4: null,
        digit5: null,
        digit6: null
      },
      codes: [-1, -1, -1, -1, -1, -1],
      digit1Input: null,
      digit2Input: null,
      digit3Input: null,
      digit4Input: null,
      digit5Input: null,
      digit6Input: null
    };
  },
  computed: {
    digitInputs() {
      return [
        this.$refs.digit1Input,
        this.$refs.digit2Input,
        this.$refs.digit3Input,
        this.$refs.digit4Input,
        this.$refs.digit5Input,
        this.$refs.digit6Input
      ];
    }
  },
  methods: {
    onChange(key, number) {
      let pressed = key.key;
      if (pressed == 'Backspace') {
        if (number > 0) {
          this.digitInputs[number - 1].focus();
        }
        this.codes[number] = -1;
      } else if (!isNaN(pressed) && pressed.length == 1) {
        if (number < this.length - 1) {
          this.digitInputs[number + 1].focus();
        }
        this.codes[number] = parseInt(pressed);
      }
    },
    verifyNumber(num) {
      return !isNaN(num) && parseInt(num) < 10;
    },
    onPaste(event) {
      let digits = event.clipboardData.getData('text');
      if (!isNaN(digits) && digits.length == this.length) {
        this.state.digit1 = digits[0];
        this.state.digit2 = digits[1];
        this.state.digit3 = digits[2];
        this.state.digit4 = digits[3];
        if (this.length == 6) {
          this.state.digit5 = digits[4];
          this.state.digit6 = digits[5];
        }
      }
    }
  },
  watch: {
    state: {
      deep: true,
      handler(currentValue) {
        const forthCondition = this.verifyNumber(currentValue.digit1) &&
          this.verifyNumber(currentValue.digit2) &&
          this.verifyNumber(currentValue.digit3) &&
          this.verifyNumber(currentValue.digit4);
        if (this.length == 4 && forthCondition) {
          let code = currentValue.digit1 + currentValue.digit2 + currentValue.digit3 + currentValue.digit4;
          this.$emit('complete', code);
        } else if (this.verifyNumber(currentValue.digit6) && this.verifyNumber(currentValue.digit5)) {
          let code = currentValue.digit1 + currentValue.digit2 + currentValue.digit3 + currentValue.digit4 + currentValue.digit5 + currentValue.digit6;
          this.$emit('complete', code);
        }
      }
    }
  }
};
</script>
<style scoped>
.form-control {
  width: 3rem;
  height: 3.5rem;
  font-size: 1.5rem;
  margin: 0.5rem;
  text-align: center;
}
</style>  