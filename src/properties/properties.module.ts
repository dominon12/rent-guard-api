import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property, PropertySchema } from './schema/property.schema';
import { UsersModule } from 'src/users/users.module';
import { ContractsModule } from 'src/contracts/contracts.module';
import { GeodataModule } from 'src/geodata/geodata.module';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
    UsersModule,
    forwardRef(() => ContractsModule),
    GeodataModule,
  ],
  exports: [PropertiesService],
})
export class PropertiesModule {}
