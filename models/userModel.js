const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    token: [String]
  },
  { timestaps: true }
);

userSchema.pre("save", async function(){
  const salt = await bcrypt.genSalt(10)
  this.password = bcrypt.hashSync(this.password, salt)
})

const User = mongoose.model("User", userSchema);

module.exports = User;