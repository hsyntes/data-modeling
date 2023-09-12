# Data Modeling & Schema Design

**Data Modeling** allows how to relate data to other data in the same or different collection such as **embedded** or **referenced** while **Schema Design** allows determmine how data will be **organized**, **validated** and **structured**. It's very similiar to Classes in **Object Oriented Programming**.

Both Data Modeling and Schema Design are crucial in the development of databases and plays a significant role in ensuring data **integrity**, **efficiency**, and **usability**.

## Schema Design

mongoose npm package runs top of MongoDB like a framework and it ensures to implement both **data modeling** & **schema design**.

```javascript
// User Schema Design
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [3, "@username cannot be shorter than 3 characters."],
    required: [true, "@username is required."],
    unique: true,
    trim: true,
  },

  // ...

  password: {
    type: String,
    minlength: [8, "Password cannot be shorter than 8 characters."],
    maxlength: [32, "Password cannot be longer than 32 characters."],
    required: [true, "Password is required."],
    trim: true,
    select: false,
  },

  // Password validation
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

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
```

Fields in a **mongoose schema object** could be any data types like Int, Array, String, Boolean, or even ObjectId and can have various properties such as unique, required, max-min length, select etc.

```javascript
const userSchema = new mongoose.Schema({
    ...
    // Referencing
    followers: [
        type: mongoose.Schema.Types.ObjectID
    ]
})

```

## Types of Data Model

### One to One (1:1)

One to one relation, as the name suggests requires one entity to have an exclusive relationship with another entity and vice versa. In this case, 1 user can only have 1 username.

```javascript
{
    "username": "hsyntes"
}
```

### One to Many (1:Many)

One to many relation occurs when an instance of an entity has one or more related instances of another entity and keeps the documents as referenced by id or embedded.

```javascript
const userSchema = new mongoose.Schema({
    ...
    // Embedded
    "followers": [
        {
            "_id": ObjectId('618'),
            "username": "xyz",
        },
        {
            "_id": ObjectId('23'),
            "username": "abc"
        }
        // ...
    ]

    // Referencing
    "followers": [
        ObjectId("618"),
        ObjectId("23")
        // ...
    ]
});

```

### Many to Many

Many-to-many relation occurs when instances of at least two entities can both be related to multiple instances of another entity. In this case, 1 user can have many followers, but 1 follower can also be in many users.

```javascript
// Also known Two-Way Referencing
{
    "_id": ObjectId('618'),
    "username": "hsyntes",
    "followers": [
        ObjectId('67'),
    ]
},
{
    "_id": ObjectId('67'),
    "username": "xyz",
    "followers": [
        ObjectId('618')
    ]
},
{
    "_id": ObjectId('23'),
    "username": "abc",
    "followers": [
        ObjectId('618'),
        ObjectId('67')
    ]
}
```

## Virtual Referencing (Populating)

One document keeps another document(s) as a **virtual**. The referenced documents actually aren't there, but it will exist when the document is querired.

**Virtual Referencing** or **Populating** would be the best solution for higher performance.

### Generate Schema Key

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // ...
  },
});

// "User" will be the unique Schema Key for this collection
const User = mongoose.model("User", userSchema);
```

### Populate Field(s)

The virtual field(s) will never exist under this document except for the document is queried with findOne.

```javascript
// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    // ...
  },
},
  // Enable virtuals
  { versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual Populating
userSchema.virtual("Posts", { // Keep documents under "posts" field
    ref: "Posts" // Schema key in another collection for reference
    foreginField: "postedBy",
    localField: "_id"
});

// Query Middleware
userSchema.pre('findOne', function (next) {
    this.populate('posts');

    next();
})
```

When the document is queried with 'findOne', the posts will be fetched that the user document related.

### Set the reference

```javascript
exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      text: req.body.text,
      // The current user that create this document will be settled as referenced
      postedBy: req.user._id,
    });
    //...
  }
}
```

Want to see an example with a **real application**, please have a look at my [instamern](https://github.com/hsyntes/instamern-api) project. You can reach out advanced data modeling & schema design with aggregation pipeline, aggregation middleware, setting references with unique, etc.

[![InstaMERN](https://github.com/hsyntes/instamern/blob/main/public/logo.png)](https://instamern.netlify.app)

## 🔗 Contact me

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hsyntes)
