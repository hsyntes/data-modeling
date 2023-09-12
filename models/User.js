const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: [3, "@username cannot be shorter than 3 characters."],
      maxlength: [12, "@username cannot be longer than 12 characters."],
      required: [true, "@username is required."],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: [8, "Password cannot be shorter than 8 characters."],
      maxlength: [32, "Password cannot be longer than 32 characters."],
      required: [true, "Password is required."],
      trim: true,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password."],
      validate: {
        validator: function (value) {
          return value === this.password;
        },

        message: "Password doesn't match.",
      },
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// * Virtual populating
userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "postedBy",
  localField: "_id",
});

// * Document Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// * Query Middleware
userSchema.pre("findOne", function (next) {
  this.populate("posts");

  next();
});

// * Instance Methods
userSchema.methods.isPasswordCorrect = async (candidate, password) =>
  await bcrypt.compare(candidate, password);

const User = mongoose.model("User", userSchema);

module.exports = User;
