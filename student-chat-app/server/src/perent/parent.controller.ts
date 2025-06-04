import { Controller, Get, Query } from '@nestjs/common';

import { ParentService } from './perent.service';  

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

@Get('student-info')
async getStudentInfo(@Query('parentEmail') parentEmail: string) {
  return this.parentService.getStudentInfo(parentEmail); 
}

}
