"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ParentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    childEmail: { type: String, required: true },
});
//# sourceMappingURL=parent.schema.js.map