import { Schema } from "./schema";
import useValidation from "./useValidation";

function App() {
  const form = useValidation(
    new Schema({
      name: {
        required: true,
        minLength: 3,
        maxLength: 10,
      },
      surname: {
        required: true,
        minLength: 3,
        maxLength: 10,
      },
      age: {
        required: true,
        max: 30,
        min: 18,
      },
    })
  );

  const submitHandler = () => {
    const result = form.validate();
    console.log(result);
  };

  return (
    <div
      className="App"
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <form>
        <input
          onChange={form.updateField}
          name="name"
          onBlur={form.touchField}
        />
        <br />
        <br />
        <input
          onChange={form.updateField}
          name="surname"
          onBlur={form.touchField}
        />
        <br />
        <br />
        <input type="number" onChange={form.updateField} name="age" />
        <br />
        <br />
        <button type="button" onClick={submitHandler}>
          save
        </button>
      </form>
    </div>
  );
}

export default App;
