import Vue from 'vue'
import * as VeeValidate from 'vee-validate'
import { extend } from "vee-validate"
import { required, email } from "vee-validate/dist/rules"

extend("required", {
    ...required,
    message: fld => `${ fld } can't be empty!`
})
  
// extend("alpha", {
//   ...alpha,
//   message: "This field must only contain alphabetic characters"
// })
  
extend("email", {
    ...email,
    message: fld => `${ fld } must be valid`
})

Vue.use(VeeValidate)