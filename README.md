[![@validify-js/core](https://github.com/fmansimli/validify-js-react/blob/master/public/vreact.png?raw=true)](https://www.buymeacoffee.com/faridmansimli)

[![npm version](https://img.shields.io/npm/v/@validify-js/react)](https://www.npmjs.com/package/@validify-js/react) &nbsp; [![npm downloads/month](https://img.shields.io/npm/dm/@validify-js/react)](https://www.npmjs.com/package/@validify-js/react) &nbsp; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/fmansimli/validify-js-react/blob/master/LICENSE)

---

#### installation

```
npm install --save @validify-js/react
```

---

**please, buy me a coffe to support this package.**

## [![buy me a coffee](https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg)](https://www.buymeacoffee.com/faridmansimli)

---

### Table of contents

1. [Creating Schema](#example)
2. [validating an object](#validating)
3. [Using with React.js](#reactjs)
4. [with initial values](#initial-values)
5. [Dependent fields (dynamic schema)](#dependent-fields)
6. [Using with React-native](#react-native)

#### an example of how to create a valid schema <a name="example"></a>

```ts
// keep in mind that "type" property must be specified!!!
// for example type:Number

import { Schema } from "@validify-js/react";

export const user = new Schema({
  name: { type: String, required: false, minLength: 7 },
  email: { type: String, required: true, email: true },
  gender: { type: String, required: true },
  hobbies: {
    type: Array,
    required: true,
    minLength: 3,
    message: "3 hobbies should be selected at least!", // if you omit  the "message" field, default message will be displayed
  },
  blocked: {
    type: Boolean,
    required: false,
  },
  password: {
    type: String,
    required: true,
    pattern: /[A-Za-z0-9]{8,}/,
  },
  age: {
    type: Number,
    required: false,
    min: 18,
    max: 30,
  },
  profession: {
    type: String,
    required: true,
  },
});
```

#### **you can validate any object or jsx form by using the schema wich we created above. for example:** <a name="validating"></a>

```ts
const user = {
  name: "Farid",
  email: "farid@example.com",
  hobbies: ["sky-diving", "soccer"],
  age: 25,
};

const { ok, data, errors } = userSchema.validate(user);

// validation will be failed. (ok --> false),
// because, a few fields are required in the above schema.
```

## how to use it with React.js ? that's amazingly easy <a name="reactjs"></a>

```tsx
// best practice! create the schema as a seperate file
// and import it to keep code clean.

import React from "react";
import { useSchema, Schema } from "@validify-js/react";

// create a schema ....
// we are going to use the same schema which we created above.

const ProfilePage = (props) => {
  const form = useSchema(userSchema);

  const { name, age, profession, blocked, hobbies, gender } = form.data;

  // you can destructure the fields from form.data, if you want

  const submitHanlder = (event) => {
    event.preventDefault();

    const { ok, data, errors } = form.validate();

    if (ok) {
      // if "ok" is true, it means form is valid , you are good to go!
      // "data" includes input values
      // "errors" includes the error messages of invalid fields, if exists
    }
  };

  return (
    <div className="App">
      <div>
        <form onSubmit={submitHanlder} onReset={form.resetForm}>
          <input
            type="text"
            name="name"
            onChange={form.updateField}
            onBlur={form.blurField}
            value={name.value}
          />
          <br />
          <small>{name.error}</small>
          <br />
          <input
            type="number"
            name="age"
            onChange={form.updateField}
            onBlur={form.blurField}
            value={age.value}
          />
          <br />
          {age.touched && <small>{age.error}</small>}
          <br />
          <div>
            {hobbieList.map((hobbie, index) => (
              <div key={index}>
                <label htmlFor={`hobbie${index}`}>{hobbie}</label>
                <input
                  id={`hobbie${index}`}
                  type="checkbox"
                  name="hobbies"
                  value={hobbie}
                  onChange={form.updateList}
                  onBlur={form.blurList}
                  checked={hobbies.value.includes(hobbie)}
                />
              </div>
            ))}
          </div>
          <br />
          <small>{hobbies.error}</small>
          // we'are using "updateList" method for multiple(array) values instead
          of updateField // we'are also using "blurList" method for multiple(array)
          values instead of blurField
          <hr />
          <input
            type="checkbox"
            name="blocked"
            onChange={form.updateField}
            onBlur={form.blurField}
            checked={blocked.value}
          />
          <br />
          <small>{blocked.error}</small>
          <hr />
          <input
            type="radio"
            name="gender"
            value="male"
            onChange={form.updateField}
            checked={gender.value === "male"}
            onBlur={form.blurField}
          />
          <input
            type="radio"
            value="female"
            name="gender"
            onChange={form.updateField}
            checked={gender.value === "female"}
            onBlur={form.blurField}
          />
          <br />
          <small>{gender.error}</small>
          <hr />
          <select
            name="profession"
            onChange={form.updateField}
            defaultValue={profession.value || "default"}
          >
            <option value="default" disabled>
              select profession
            </option>
            {professionList.map((profession, key) => (
              <option key={key} value={profession}>
                {profession}
              </option>
            ))}
          </select>
          <br />
          <small>{profession.error}</small>
          <hr />
          <button type="submit">submit</button>
          <button type="reset">reset</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
```

**P.S** &nbsp;&nbsp;
we'are using "**updateList**" method for multiple(array) values instead of "**updateField**" <br />
we'are also using "**blurList**" method for multiple(array) values instead of "**blurField**"

look at the --> (hobbies) in the jsx above

**P.S** &nbsp;&nbsp; keep in mind that -> name attribute of the input should match with the exact property in schema

**you might not belive, however, that's pretty much it, as simple as you see**

---

## how to use it with initial values ? this is also amazingly easy <a name="initial-values"></a>

```tsx
// best practice! create the schema as a seperate file
// and import it to keep code clean.

import React from "react";
import { useSchema } from "@validify-js/react";

import { personSchema } from "../validations/person";


const  ProfilePage = (props) => {

  const form = useSchema(personSchema, {
    name: "Farid",
    email: "farid@example.com",
    age: 20,
  });

  // or you can also use it like below:

  // const form = useSchema(personSchema,props.user);

  ....
  ....
```

## how to use dependent fields ? don't worry, it's a piece of cake <a name="dependent-fields"></a>

use the **useDynamic** hook instead of **useSchema**

just create a schema and specify dependent fields inside the hook.

```tsx
// best practice! create the schema as a seperate file
// and import it to keep code clean.

import React from "react";
import { useDynamic } from "@validify-js/react";

const ProfilePage = (props) => {

  const form = useDynamic(userSchema,
      (data) => {
        return {
          password: {
            required: data.name ? true : false,
          },
          age: {
            required: data.email ? true : false,
            min: data.email ? 25 : 18
          }
        };
      },
      ["name", "email"]
    );

```

## Using with React Native <a name="react-native"></a>

```tsx
// just pass the name of the field to the function, that's it.

<TextInput
  onValueChange={form.updateField("username")}
  onBlur={form.blurField("username")}
  value={form.data.username.value}
/>;

<Text>{form.data.username.error}</Text>;
```

**that's pretty much it, guys!**

---

### **you can reach me here:**

---

[**Linkedin**](https://linkedin.com/in/faridmansimli) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; [**Facebook**](https://facebook.com/fmansimli) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; [**Twitter**](https://twitter.com/faridmansimli) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; [**Instagram**](https://instagram.com/faridmansimli)

---

**please, buy me a coffe to support this package**.

---

## [![buy me a coffee](https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg)](https://www.buymeacoffee.com/faridmansimli)
