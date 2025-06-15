"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AuthService = class AuthService {
    parentModel;
    usersService;
    jwtService;
    constructor(parentModel, usersService, jwtService) {
        this.parentModel = parentModel;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async register(email, password, role = 'student') {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await this.hashPassword(password);
        await this.usersService.createUser(email, hashedPassword, role);
        return { message: 'User registered successfully' };
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
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
    async registerParent(dto) {
        const existingParent = await this.parentModel.findOne({ email: dto.email });
        if (existingParent) {
            throw new Error('Parent already exists');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const parent = await this.parentModel.create({
            name: dto.name,
            email: dto.email,
            password: hashed,
            childEmail: dto.childEmail,
        });
        const payload = { email: parent.email, sub: parent._id, role: 'parent' };
        const token = this.jwtService.sign(payload);
        return {
            message: 'Parent registered successfully',
            access_token: token,
            name: parent.name,
        };
    }
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
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Parent')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map