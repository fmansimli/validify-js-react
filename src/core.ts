import { useReducer } from "react";
import { Schema } from "./schema";
import { Util } from "./util";

interface IState {
  ok: boolean;
  data: {
    [key: string]: {
      value: string | number | boolean | [];
      error: string;
      touched: boolean;
      ok: boolean;
    };
  };
}

enum Actions {
  CHANGE = "CH",
  VALIDATE = "VA",
}

const reducer = (state: IState, action: any) => {
  switch (action.type) {
    case Actions.CHANGE:
      return { ...state, data: { ...state.data, ...action.payload } };

    case Actions.VALIDATE:
      return action.payload;

    default:
      return action.payload;
  }
};

export const useSchema = (schema: Schema, initial = {}) => {
  const [state, dispatch] = useReducer(reducer, Util.init(schema, initial));

  const validate = () => {
    const plain = Util.plain(state.data);
    const vdata = schema.validate(plain);
    const payload = Util.shape(vdata);
    dispatch({ type: Actions.VALIDATE, payload });

    return vdata;
  };

  const updateField = (e: any) => {
    if (!e.target) {
      return (value: any) => {
        updateField({ target: { name: e, value, type: "native" } });
      };
    }
    let { name, type, value, checked } = e.target;

    switch (type) {
      case "number":
        value = Number(value);
        break;
      case "checkbox":
        value = checked;
        break;
    }

    if (state.data[name].touched) {
      const { message, ok } = schema.validateField(name, { [name]: value });
      dispatch({
        type: Actions.CHANGE,
        payload: { [name]: { ok, value, error: message, touched: true } },
      });
    } else {
      dispatch({
        type: Actions.CHANGE,
        payload: { [name]: { ok: true, value, error: "", touched: false } },
      });
    }
  };

  const blurField = (e: any) => {
    if (!e.target) {
      return (value: any) => {
        blurField({ target: { name: e, value, type: "native" } });
      };
    }
    let { name, value, type, checked } = e.target;
    if (!value) return;

    switch (type) {
      case "number":
        value = Number(value);
        break;
      case "checkbox":
        value = checked;
        break;
    }

    const { message, ok } = schema.validateField(name, { [name]: value });
    dispatch({
      type: Actions.CHANGE,
      payload: { [name]: { ok, value, error: message, touched: true } },
    });
  };

  const updateList = (e: any) => {
    if (!e.target) {
      return (value: any) => {
        updateList({ target: { name: e, value, type: "native" } });
      };
    }
    let { name, value, checked } = e.target;

    const old = state.data[name].value;
    if (checked === false) {
      value = old.filter((v: any) => v !== value);
    } else {
      value = old.concat(value);
    }

    if (state.data[name].touched) {
      const { message, ok } = schema.validateField(name, { [name]: value });
      dispatch({
        type: Actions.CHANGE,
        payload: { [name]: { ok, value, error: message, touched: true } },
      });
    } else {
      dispatch({
        type: Actions.CHANGE,
        payload: { [name]: { ok: true, value, error: "", touched: false } },
      });
    }
  };

  const blurList = (e: any) => {
    if (!e.target) {
      return (value: any) => {
        updateList({ target: { name: e, value, type: "native" } });
      };
    }
    let { name } = e.target;
    const value = state.data[name].value;

    const { message, ok } = schema.validateField(name, { [name]: value });
    dispatch({
      type: Actions.CHANGE,
      payload: { [name]: { ok, value, error: message, touched: true } },
    });
  };

  const resetForm = () => {
    const payload = Util.init(schema, initial);
    dispatch({ type: "", payload });
  };

  return {
    ok: state.ok,
    data: state.data,
    updateField,
    updateList,
    blurField,
    blurList,
    validate,
    resetForm,
  };
};
