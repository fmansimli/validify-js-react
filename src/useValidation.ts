import { ChangeEvent, useReducer } from "react";

interface IState {
  errors: object | null;
  ok: boolean;
  data: object;
  touched: { [key: string]: boolean };
}

const initialState: IState = {
  errors: null,
  ok: false,
  data: {},
  touched: {},
};

enum Actions {
  TOUCH = "TO",
  UPDATE = "UP",
  VALIDATE = "VA",
  UPDATE_TOUCH = "UT",
  ERROR = "ER",
}

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case Actions.UPDATE_TOUCH:
      return {
        ...state,
        data: { ...state.data, ...action.payload.updated },
        touched: { ...state.touched, ...action.payload.touched },
      };

    case Actions.UPDATE:
      return { ...state, data: { ...state.data, ...action.payload } };

    case Actions.VALIDATE:
      return action.payload;

    case Actions.TOUCH:
      return {
        ...state,
        touched: { ...state.touched, ...action.payload.touched },
        errors: { ...state.errors, ...action.payload.errors },
      };

    default:
      return state;
  }
};

const useValidation = (schema: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const validate = () => {
    const vdata = schema.validate(state.data);

    dispatch({ type: Actions.VALIDATE, payload: vdata });
    return vdata;
  };

  const updateField = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, type, value } = e.target;
    const myvalue = type === "number" ? Number(value) : value;
    dispatch({ type: Actions.UPDATE, payload: { [name]: myvalue } });
  };

  const touchField = (e: any) => {
    let { name, value } = e.target;

    const { message, ok } = schema.validateField(name, { [name]: value });

    dispatch({
      type: Actions.TOUCH,
      payload: {
        errors: ok ? {} : { [name]: message },
        touched: { [name]: true },
      },
    });
  };

  const updateAndTouch = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, type, value } = e.target;

    dispatch({
      type: Actions.UPDATE_TOUCH,
      payload: {
        touched: { [name]: true },
        updated: { [name]: type === "number" ? Number(value) : value },
      },
    });
  };

  return {
    ok: state.ok,
    errors: state.errors,
    data: state.data,
    touched: state.touched,
    updateField,
    touchField,
    validate,
    updateAndTouch,
  };
};

export default useValidation;
