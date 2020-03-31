var mongoose = require('mongoose');
var Schema = mongoose.Schema;

formSchema = new Schema( {
    form_no: Number,
    first_name: String,
    last_name: String,
    service: String,
    phone: Number,
    address: String,
    city: String,
}),
Form = mongoose.model('Form', formSchema);

module.exports = Form;