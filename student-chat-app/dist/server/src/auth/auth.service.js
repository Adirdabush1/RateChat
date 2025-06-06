"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        parentModel;
        usersService;
        jwtService;
        constructor(parentModel, usersService, jwtService) {
            this.parentModel = parentModel;
            this.usersService = usersService;
            this.jwtService = jwtService;
        }
        // Function to hash password
        async hashPassword(password) {
            const saltRounds = 10;
            return bcrypt.hash(password, saltRounds);
        }
        // Register a new user with role (default: 'student')
        async register(email, password, role = 'student') {
            const existingUser = await this.usersService.findByEmail(email);
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = await this.hashPassword(password);
            await this.usersService.createUser(email, hashedPassword, role);
            return { message: 'User registered successfully' };
        }
        // Validate user credentials
        async validateUser(email, password) {
            const user = await this.usersService.findByEmail(email);
            if (user && (await bcrypt.compare(password, user.password))) {
                return user;
            }
            return null;
        }
        // Login - returns JWT if credentials are correct
        async login(email, password) {
            const user = await this.validateUser(email, password);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = { email: user.email, sub: user._id, role: user.role };
            return {
                access_token: this.jwtService.sign(payload),
                name: user.name,
            };
        }
        // Register a new parent user
        async registerParent(dto) {
            const hashed = await bcrypt.hash(dto.password, 10);
            const parent = await this.parentModel.create({
                name: dto.name,
                email: dto.email,
                password: hashed,
                childEmail: dto.childEmail,
            });
            return parent;
        }
        // Parent login - returns JWT if credentials are correct
        async loginParent(email, password) {
            const parent = await this.parentModel.findOne({ email });
            if (!parent) {
                throw new common_1.UnauthorizedException('Parent not found');
            }
            const passwordMatch = await bcrypt.compare(password, parent.password);
            if (!passwordMatch) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = { email: parent.email, sub: parent._id, role: 'parent' };
            return {
                access_token: this.jwtService.sign(payload),
                name: parent.name,
            };
        }
    };
    return AuthService = _classThis;
})();
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map