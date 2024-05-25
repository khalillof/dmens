"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionError = void 0;
class AssertionError extends Error {
    constructor(message) {
        super(message);
        this.message = message || 'Assertion error';
        this.code = 'ASSERTION_ERROR';
        this.status = 500;
    }
    code;
    status;
}
exports.AssertionError = AssertionError;
