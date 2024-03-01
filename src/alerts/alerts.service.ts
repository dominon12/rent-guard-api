import { Injectable } from '@nestjs/common';

import { Alert } from './entities/alert.entity';
import { randomUUID } from 'crypto';
import { AlertFeed } from './entities/alert-feed.enum';

@Injectable()
export class AlertsService {
  async findAll(email: string, type: AlertFeed): Promise<Alert[]> {
    return Promise.resolve<Alert[]>([
      {
        id: randomUUID(),
        title: 'Alquiler está por pagar',
        content:
          'Marta Rodriguez tenia que haberte pagado 890$ hasta el dia 7 de octubre por el alquiler del piso en av. Roentgen',
      },
      ...(type === 'today'
        ? [
            {
              id: randomUUID(),
              title: 'Contrato finaliza pronto',
              content:
                'Contrato con Igor Akinin que alquila habitacion B finaliza pronto',
            },
          ]
        : []),
    ]);
  }
}
