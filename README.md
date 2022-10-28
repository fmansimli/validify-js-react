### Marvelous validation for React.js / React Native

#### installation

```
npm install --save @validify-js/react
```

### Table of contents

1. [Creating Schema](#example)
2. [validating an object](#validating)
3. [Using with React.js](#reactjs)
4. [with initial values](#initial-values)
5. [Dependent fields (dynamic schema)](#dependent-fields)
6. [Using with React-native](#react-native)

#### an example of how to create a valid schema <a name="example"></a>

```
import { Schema } from "@validify-js/react";

const userSchema = new Schema({
  name: { required: false, minLength: 5 },
  email: {
    required: true,
    email: true,
    message: "email is required!" // if you omit message field default message will be displayed
  },
  password: {
    required: true,
    pattern: /[A-Za-z0-9]{8,}/g
  },
  age: {
    required: false,
    min: 18,
    max: 30
  },
});

```

#### **you can validate any object or jsx form by using the schema wich we created above. for example:** <a name="validating"></a>

```
const user = {
  name: "Farid",
  surname: "Mansimli",
  email: "farid@example.com"
};

const { ok, data, errors } = userSchema.validate(user);

// validation will be failed. (ok --> false),
// because "password" field is required in the above schema.


```

## how to use it with React.js ? that's amazingly easy <a name="reactjs"></a>

```

// best practice! create the schema as a seperate file and import it to keep code clean.

import React from "react";
import { useSchema , Schema } from "@validify-js/react";

const loginSchema = new Schema({
  username: {
    required: true,
    minLength: 5,
    maxLength: 15,
    message: "username is required!"
  },
  password: {
    required: true,
    pattern: /[A-Za-z0-9]{8,}/g
  }
});


const  LoginPage = (props) => {
  const form = useSchema(loginSchema);

  const submitHanlder = (event) => {
    event.preventDefault();

    const { ok, data, errors } = form.validate();

    if(ok){
      // "ok" means form is valid , you are good to go!
      // "data" includes input values
      // "errors" includes the error messages of invalid fields , if exists
    }

  };

  return (
    <div className="App">
      <div>
        <form onSubmit={submitHanlder} onReset={form.resetForm}>
          <input
            type="text"
            name="username"
            onChange={form.updateField}
            onBlur={form.blurField}
            value={form.data.name.value}
          />
          <small>{form.data.username.error}</small>

          //or

          {form.data.password.touched && (
            <small>{form.data.surname.error}</small>
          )}


          <input
            type="text"
            name="password"
            onChange={form.updateField}
            onBlur={form.blurField}
            value={form.data.surname.value}
          />
          <small>{form.data.password.error}</small>

          <button type="submit">submit</button>
          <button type="reset">reset</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;


```

**you might not belive, however, that's pretty much it, as simple as you see**

**P.S** keep in mind that -> name attribute of the input should match with the exact property in schema

---

## how to use it with initial values ? this is also amazingly easy <a name="initial-values"></a>

```
// best practice! create the schema as a seperate file and import it to keep code clean.

import React from "react";
import { useDynamic } from "@validify-js/react";

const  LoginPage = (props) => {

  const form = useSchema(personSchema, {
    name: "Farid",
    surname: "Mansimli"
  });

  // or you can also use it like below:

  // const form = useSchema(personSchema,props.person);

  ....
  ....
```

## how to use dependent fields ? don't worry, it's a piece of cake <a name="dependent-fields"></a>

use the **useDynamic** hook instead of **useSchema**

just create a schema and specify dependent fields inside the hook.

```
// best practice! create the schema as a seperate file and import it to keep code clean.

import React from "react";
import { useDynamic } from "@validify-js/react";

const LoginPage = (props) => {

  const form = useDynamic(personSchema,
      (data) => {
        return {
          surname: {
            required: data.name ? true : false,
            minLength: data.name ? 8 : 5
          },
          age: {
            required: data.surname ? true : false,
            min: data.surname ? 25 : 18
          }
        };
      },
      ["name", "surname"]
    );

```

## Using with React Native <a name="react-native"></a>

```
// instead of updateField and blurField, use updateNative and blurNative, that's it!

<TextInput
  onValueChange={form.updateNative("username")}
  onBlur={form.blurNative("username")}
  value={form.data.name.value}
/>

{form.data.password.touched && (
  <Text>{form.data.surname.error}</Text>
)}

```

**that's pretty much it, guys!**

---

### **you can reach me here:**

---

[**Linkedin**](https://linkedin.com/in/faridmansimli) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; [**Facebook**](https://facebook.com/fmansimli) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; [**Twitter**](https://twitter.com/faridmansimli) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; [**Instagram**](https://instagram.com/faridmansimli)
