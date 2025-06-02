import { Controller, Get } from '@nestjs/common';

@Controller('parent')
export class ParentController {
  @Get('student-info')
  getStudentInfo() {
    // דוגמה סטטית עם ניקוד והודעות חריגות
    return {
      name: 'דוד',
      score: 85,
      flaggedMessages: [
        {
          content: 'אני לא מרגיש טוב היום',
          sentiment: 'שלילי',
          createdAt: new Date().toISOString(),
        },
        {
          content: 'הוא אמר משהו פוגעני למורה',
          sentiment: 'פוגעני',
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }
}
