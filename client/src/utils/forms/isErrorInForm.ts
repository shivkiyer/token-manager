/**
 * Check whether a form has been modified and has any errors
 * @param {Object} form Formik form
 * @returns {boolean}
 */
const isErrorInForm = (form: any) => {
  if (form.dirty) {
    if (Object.keys(form.errors).length === 0) {
      return false;
    }
  }
  return true;
};

export default isErrorInForm;
