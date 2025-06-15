import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParentService } from './perent.service';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('student-info')
  @UseGuards(JwtAuthGuard)
  async getStudentInfo(@Req() req: Request) {
    const parentEmail = (req.user as any).email;
    return this.parentService.getStudentInfo(parentEmail);
  }
}
