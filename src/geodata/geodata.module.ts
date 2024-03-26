import { Module } from '@nestjs/common';

import { GeodataService } from './geodata.service';

@Module({
  providers: [GeodataService],
  exports: [GeodataService],
})
export class GeodataModule {}
