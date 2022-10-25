//@ts-nocheck

interface ISchema {
  [key: string]: IConfig;
}

interface IConfig {
  required: boolean;
  email?: boolean;
  max?: number;
  min?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  message?: string;
}

export class Schema {
  constructor(schema: ISchema) {
    for (const field in schema) {
      this[field] = schema[field];
    }
  }

  validateField(field: string, entity: any) {
    const { deafultMessage, valid } = checkFunc.call(this, field, entity);

    const message = this[field].message || deafultMessage;
    return { message, ok: valid, touched: true };
  }

  validate(entity: any) {
    let ok = true;
    let errors: any = {};
    let touched: any = {};

    for (const field in this) {
      const { deafultMessage, valid } = checkFunc.call(this, field, entity);
      if (!valid) {
        errors[field] = this[field].message || deafultMessage;
        ok = false;
      }
      touched[field] = true;
    }
    return { ok, errors: ok ? null : errors, data: entity, touched };
  }
}

function checkFunc(field: string, entity: any) {
  if (this[field].required) {
    if (!entity.hasOwnProperty(field)) {
      const deafultMessage = `"${field}" is required!`;
      return { deafultMessage, valid: false };
    }
  }
  if (this[field].email) {
    const pattern = /[\w]{3,}@[A-Za-z0-9]{3,}\.[A-Za-z]{2,}/;

    if (!pattern.test(entity[field])) {
      const deafultMessage = `"${field}" is not a valid email address`;
      return { deafultMessage, valid: false };
    }
  }
  if (this[field].max) {
    if (this[field].max! < entity[field]) {
      const deafultMessage = `"${field}" must be equal or lower than ${this[field].max}`;
      return { deafultMessage, valid: false };
    }
  }
  if (this[field].min) {
    if (this[field].min! > entity[field]) {
      const deafultMessage = `"${field}" must be equal or greather than ${this[field].min}`;
      return { deafultMessage, valid: false };
    }
  }
  if (this[field].maxLength) {
    if (this[field].maxLength! < entity[field].length) {
      const deafultMessage = `length of "${field}" must be equal or lower than ${this[field].maxLength}`;
      return { deafultMessage, valid: false };
    }
  }
  if (this[field].minLength) {
    if (this[field].minLength! > entity[field].length) {
      const deafultMessage = `length of "${field}" must be equal or greather than ${this[field].minLength}`;
      return { deafultMessage, valid: false };
    }
  }
  if (this[field].pattern) {
    if (!this[field].pattern?.match(entity[field])) {
      const deafultMessage = `"${field}" doesn't match ${this[field].pattern}`;
      return { deafultMessage, valid: false };
    }
  }
  return { deafultMessage: "", valid: true };
}
