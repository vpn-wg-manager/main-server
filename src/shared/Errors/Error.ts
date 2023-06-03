export enum ErrorTypes {
  required = 'required',
  exists = 'exists',
  notEqual = 'notEqual',
  notExists = 'notExists',
  noPermission = 'noPermission',
  wrongValue = 'wrongValue',
}

export default class Error {
  message: string;
  constructor(public type: ErrorTypes, public param: string, message = '') {
    if (message) {
      this.message = message;
      return;
    }
    switch (type) {
      case ErrorTypes.exists:
        this.message = `Field ${param} already exists`;
        break;
      case ErrorTypes.noPermission:
        this.message = `No permission`;
        break;
      case ErrorTypes.notEqual:
        this.message = `Fields ${param} not equals`;
        break;
      case ErrorTypes.notExists:
        this.message = `No such ${param}`;
        break;
      case ErrorTypes.required:
        this.message = `Field ${param} is required`;
        break;
      case ErrorTypes.wrongValue:
        this.message = `Wrong "${param}" value`;
        break;
      default:
        this.message = '';
        return;
    }
  }
}
