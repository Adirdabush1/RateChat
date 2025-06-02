import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',  // כתובת שרת SMTP שלך
        port: 587,                 // פורט SMTP, בדרך כלל 587 או 465
        secure: false,             // true אם משתמשים ב־SSL (פורט 465)
        auth: {
          user: 'your_email@example.com',
          pass: 'your_password',
        },
      },
      defaults: {
        from: '"No Reply" <your_email@example.com>',
      },
      template: {
        dir: join(__dirname, 'templates'), // אם תרצה להשתמש בתבניות מייל
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  exports: [MailerModule],
})
export class CustomMailerModule {}
