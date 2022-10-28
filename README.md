# marvelous validation package for React.js / React Native

### installation

```
npm install --save @validfy-js/react
```

### an example of how to create a valid schema to validate anything (a jsx form or an object)

```
import { Schema } from "@validify-js/react";

const userSchema = new Schema({
  name: { required: false, minLength: 5 },
  email: {
    required: true,
    email: true,
    message: "email is required!", // if you omit message field default message will be displayed
  },
  password: {
    required: true,
    pattern: /[A-Za-z0-9]{8,}/g,
  },
  age: {
    required: false,
    min: 18,
    max: 30,
  },
});

```

you can validate any object or jsx form by using the schema wich we created above. for example:

```
const user = {
  name: "Farid",
  surname: "Mansimli",
  email: "farid@example.com",
};

const { ok, data, errors } = userSchema.validate(user);

// validation will be failed. (ok --> false),
// because "password" field is required in the above schema.


```

## how to use it in order to validate form ? that's amazingly easy

```
import React from "react";
import { useSchema , Schema } from "@validify-js/react";

const loginSchema = new Schema({
  username: {
    required: true,
    minLength: 5,
    maxLength: 15,
    message: "username is required!",
  },
  password: {
    required: true,
    pattern: /[A-Za-z0-9]{8,}/g,
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

you might not belive, however, that's pretty much it, as simple as you see

#### P.S

keep in mind that -> name attribute of the input should match with the exact property in schema

## how to use it with initial values ? this is also amazingly easy

```
const  LoginPage = (props) => {

  const form = useSchema(loginSchema, {
    name: "Farid",
    surname: "Mansimli",
  });

  // or you can also use it like below:

  // const form2 = useSchema(loginSchema,props.initialUser);

  ....
  ....
```

### that's pretty much it, guys!
