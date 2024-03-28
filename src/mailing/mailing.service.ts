import { Injectable } from '@nestjs/common';
import LoopsClient from 'loops';

import { Email } from './entities/email.entity';

@Injectable()
export class MailingService {
  async send(email: Email) {
    const loops = new LoopsClient(process.env.LOOPS_API_KEY);

    const { id, destination, variables } = email;

    try {
      await loops.sendTransactionalEmail(id, destination, variables);
    } catch (error) {
      console.error('Error sending email', error);
    }
  }
}
