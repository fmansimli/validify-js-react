const setType = (type: any) => {
  if (type === String) {
    return "";
  } else if (type === Boolean) {
    return false;
  } else if (type === Number) {
    return 0;
  } else if (type === Array) {
    return [];
  } else {
    return null;
  }
};

export class Util {
  static plain(data: any) {
    const entity: any = {};

    for (const field in data) {
      entity[field] = data[field].value;
    }

    return entity;
  }

  static shape({ ok, data, errors }: any) {
    const state: any = { data: {}, ok };

    for (const field in data) {
      state.data[field] = {
        ok: errors.hasOwnProperty(field) ? false : true,
        touched: true,
        value: data[field],
        error: errors[field] || "",
      };
    }

    return state;
  }

  static init(schema: any, initial: any) {
    const data: any = {};
    for (const field in schema) {
      const value = initial.hasOwnProperty(field)
        ? initial[field]
        : setType(schema[field].type);

      data[field] = { ok: true, touched: false, value, error: "" };
    }
    return { ok: false, data };
  }

  // static fullInit(schema: any, initial: any) {
  //   const initialData: any = {};

  //   const { data, errors, ok } = schema.validate(initial);

  //   for (const field in schema) {
  //     initialData[field] = {
  //       ok: errors.hasOwnProperty(field) ? false : true,
  //       touched: false,
  //       value: data[field] || "",
  //       error: errors[field] || "",
  //     };
  //   }

  //   return { ok, data: initialData };
  // }
}
