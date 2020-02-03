import Vue from 'vue'
import * as VeeValidate from 'vee-validate'
import { extend } from "vee-validate"
import { required, required_if, length, max, min, confirmed, alpha, alpha_num, numeric, email } from "vee-validate/dist/rules"

extend("required", {
    ...required,
    message: fld => `${ fld } can't be empty!`
})

extend("required_if", {
    ...required_if,
})

extend("length", {
    ...length,
})

extend("max", {
    ...max,
})

extend("min", {
    ...min,
})

extend("confirmed", {
    ...confirmed,
})
  
extend("alpha", {
  ...alpha,
  message: "This field must only contain alphabetic characters"
})
  
extend("alpha_num", {
  ...alpha_num,
  message: "This field must only contain alphabetic and/or numeric characters"
})
  
extend("numeric", {
  ...numeric,
  message: "This field must only contain digits"
})
  
extend("email", {
    ...email,
    message: fld => `${ fld } must be valid`
})

Vue.use(VeeValidate)