import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterParentDto } from './dto/register-parent.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Parent } from '../perent/parent.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Parent') private parentModel: Model<Parent>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Function to hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // Register a new user with role (default: 'student')
  async register(email: string, password: string, role: string = 'student') {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    await this.usersService.createUser(email, hashedPassword, role);

    return { message: 'User registered successfully' };
  }

  // Validate user credentials
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  // Login - returns JWT if credentials are correct
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      name: user.name,
    };
  }

  async registerParent(dto: RegisterParentDto) {
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

  // Parent login - returns JWT if credentials are correct
  async loginParent(email: string, password: string) {
    const parent = await this.parentModel.findOne({ email });
    if (!parent) {
      throw new UnauthorizedException('Parent not found');
    }

    const passwordMatch = await bcrypt.compare(password, parent.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: parent.email, sub: parent._id, role: 'parent' };

    return {
      access_token: this.jwtService.sign(payload),
      name: parent.name,
    };
  }
}
