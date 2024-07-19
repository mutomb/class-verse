import Validator from 'validator';
import isEmpty from 'is-empty';
const validateLoginInput = (data: { username: any; password: any; }) => {
    let errors = {};

    // Converts empty fields to String in order to validate them
    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }
    return {
        errors,
        isValid: isEmpty(errors),
    };
};
export default validateLoginInput