// // models/Address.js

// const mongoose = require("mongoose");

// // Schema cho Tỉnh/Thành phố
// const provinceSchema = new mongoose.Schema({
//   id: String,
//   name: String,
// });

// // Schema cho Huyện/Quận
// const districtSchema = new mongoose.Schema({
//   id: String,
//   name: String,
//   provinceId: String,
// });

// // Schema cho Xã/Phường
// const wardSchema = new mongoose.Schema({
//   id: String,
//   name: String,
//   districtId: String,
// });

// // Schema cho Thôn/Xóm
// const villageSchema = new mongoose.Schema({
//   id: String,
//   name: String,
//   wardId: String,
// });

// const Province = mongoose.model("Province", provinceSchema);
// const District = mongoose.model("District", districtSchema);
// const Ward = mongoose.model("Ward", wardSchema);
// const Village = mongoose.model("Village", villageSchema);

// module.exports = { Province, District, Ward, Village };
