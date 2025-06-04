import { Module } from '@nestjs/common';
import { ParentController } from './parent.controller';
import { ParentService } from './perent.service';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';
import { MailerService } from '../mailer/mailer.service'; // חדש

@Module({
  imports: [UsersModule, MessagesModule],
  controllers: [ParentController],
  providers: [ParentService, MailerService], 
  exports: [ParentService]
})
export class ParentModule {}
