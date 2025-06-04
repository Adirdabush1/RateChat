import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MessagesService } from '../messages/messages.service';
import { MailerService } from '../mailer/mailer.service'; 

@Injectable()
export class ParentService {
  constructor(
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
    private readonly mailerService: MailerService 
  ) {}

  async getStudentInfo(studentEmail: string): Promise<{
    name: string;
    score: number;
    flaggedMessages: any[];
  } | null> {
    const student = await this.usersService.findByEmail(studentEmail);
    if (!student) {
      return null;
    }

    const flaggedMessages = await this.messagesService.getFlaggedMessagesByStudentEmail(studentEmail);

    
    if (flaggedMessages.length > 0 && student.parentEmail) {
      await this.mailerService.sendAlertEmail(
        student.parentEmail,
        student.email,
        flaggedMessages.map(msg => msg.text)
      );
    }

    return {
      name: student.email,
      score: student.score,
      flaggedMessages,
    };
  }
  async handleNewMessage(sender: string, message: string, CHAT_ID: string, score: number) {
  
  const savedMessage = await this.messagesService.saveMessage(sender, message, CHAT_ID, score);

  
  if (score < 50) {
    const student = await this.usersService.findByEmail(sender);
    if (student) {
      
      student.score = Math.max(0, student.score - 5);
      await this.usersService.updateScore(student.email, student.score);

      
      if (student.parentEmail) {
        await this.mailerService.sendAlertEmail(
          student.parentEmail,
          student.name || student.email,
          [message]
        );
      }
    }
  }

  return savedMessage;
}

}
