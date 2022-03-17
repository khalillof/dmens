
export class AssertionError extends Error {
    constructor (message?:string) {
      super(message)
      this.message = message || 'Assertion error'
      this.code = 'ASSERTION_ERROR'
      this.status = 500
    }
    code?:string
    status:number
  }
  