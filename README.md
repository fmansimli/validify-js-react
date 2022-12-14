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

<br/>

### Table of contents

1. [Creating Schema](#example)
2. [Validating an object](#validating)
3. [Using with React.js](#reactjs)
4. [With initial values](#initial-values)
5. [Dependent fields (dynamic schema)](#dependent-fields)
6. [Using with React-native](#react-native)
7. [Keep in mind (important!)](#keep-in-mind)

<br/>

### <a name="example">Creating Schema</a>

an example of how to create a valid schema

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

<br/>

### <a name="validating">Validating an object</a>

you can validate any object or jsx form by using the schema wich we created above. for example:

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

<br/>

### <a name="reactjs">Using with React.js</a>

how to use it with React.js ? that's amazingly easy

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

**KEEP IN MIND:** &nbsp;&nbsp;

- name attribute of the input should match with the exact property in schema

- we'are using "**updateList**" method for multiple(array) values instead of "**updateField**"

- we'are also using "**blurList**" method for multiple(array) values instead of "**blurField**"

<br />

**look at the --> (hobbies) in the jsx above ^**

---

<br />

_you might not belive, however, that's pretty much it, as simple as you see_

<br />

### <a name="initial-values">With initial values</a>

how to use it with initial values ? this is also amazingly easy

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

<br/>

### <a name="dependent-fields">Dependent fields (dynamic schema)</a>

how to use dependent fields ? don't worry, it's a piece of cake

- use the **useDynamic** hook instead of **useSchema**

- just create a schema and specify dependent fields inside the hook.

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

<br/>

### <a name="react-native">Using with React-native</a>

```tsx
// just pass the name of the field to the function, that's it.

<TextInput
  onChangeText={form.updateField("username")}
  onBlur={form.blurField("username")}
  value={form.data.username.value}
/>;

<Text>{form.data.username.error}</Text>;
```

<br />

### <a name="keep-in-mind">Keep in mind</a>

- name attribute of the input should match with the exact property in schema (important!)

- "type" property must be specified in the Schema

- name attribute of the input should match with the exact property in schema

- we'are using "**updateList**" method for multiple (array) values instead of "**updateField**"

- we'are also using "**blurList**" method for multiple (array) values instead of "**blurField**"

<br />

**that's pretty much it, guys!**

---

<br/>

### **you can reach me here:**

---

[**Linkedin**](https://linkedin.com/in/faridmansimli) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; [**Facebook**](https://facebook.com/fmansimli) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; [**Twitter**](https://twitter.com/faridmansimli) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; [**Instagram**](https://instagram.com/faridmansimli)

---

<br/>

**please, buy me a coffe to support this package**.

## [![buy me a coffee](https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg)](https://www.buymeacoffee.com/faridmansimli)
