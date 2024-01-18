const mongoose = require("mongoose"); // Importing mongoose
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxLength: 20,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxLength: 1024,
    trim: true,
  },
});

userSchema.pre("save", async function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

const UserModel = mongoose.model("User", userSchema);

console.log("UserModel.js: UserModel created"); // Log that the UserModel is created

module.exports = UserModel; // Exporting the UserModel directly
