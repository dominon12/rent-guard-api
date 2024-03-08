import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property, PropertySchema } from './schema/property.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
    UsersModule,
  ],
  exports: [PropertiesService],
})
export class PropertiesModule {}
