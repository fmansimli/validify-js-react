import { ChangeEvent, useReducer, useEffect, useState } from "react";
import { Schema, ISchema } from "@validify-js/core";

interface IState {
  ok: boolean;
  errors: { [key: string]: any };
  data: { [key: string]: any };
  touched: { [key: string]: boolean };
}

const initialState: IState = {
  errors: {},
  ok: false,
  data: {},
  touched: {},
};

enum Actions {
  BLUR = "TO",
  CHANGE = "CH",
  VALIDATE = "VA",
  ERROR = "ER",
}

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case Actions.CHANGE:
      return { ...state, data: { ...state.data, ...action.payload } };

    case Actions.VALIDATE:
      return action.payload;

    case Actions.BLUR:
      return {
        ...state,
        touched: { ...state.touched, ...action.payload.touched },
        errors: { ...state.errors, ...action.payload.errors },
      };

    case Actions.ERROR:
      return {
        ...state,
        errors: { ...state.errors, ...action.payload },
      };

    default:
      return initialState;
  }
};

export const useDynamicSchema = (fn: (s: any) => ISchema, initial: Schema) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [schema, setSchema] = useState<Schema>(initial);

  useEffect(() => {
    setSchema(initial.rebuilt(fn(state.data)));
  }, [state.data]);

  const validate = () => {
    const vdata = schema.validate(state.data);

    dispatch({ type: Actions.VALIDATE, payload: vdata });
    return vdata;
  };

  const updateField = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, type, value } = e.target;
    const myvalue = type === "number" ? Number(value) : value;

    dispatch({ type: Actions.CHANGE, payload: { [name]: myvalue } });
    if (state.touched[name]) {
      const { message, ok } = schema.validateField(name, { [name]: myvalue });
      dispatch({ type: Actions.ERROR, payload: { [name]: message } });
    }
  };

  const blurField = (e: any) => {
    let { name, value } = e.target;
    if (!value) return;
    const { message, ok } = schema.validateField(name, { [name]: value });
    dispatch({
      type: Actions.BLUR,
      payload: {
        errors: ok ? {} : { [name]: message },
        touched: { [name]: true },
      },
    });
  };

  const resetForm = () => {
    dispatch({ type: "" });
  };

  return {
    ok: state.ok,
    errors: state.errors,
    data: state.data,
    touched: state.touched,
    updateField,
    blurField,
    validate,
    resetForm,
  };
};
