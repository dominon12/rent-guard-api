import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AlertsModule } from './alerts/alerts.module';
import { PropertiesModule } from './properties/properties.module';
import { ContractsModule } from './contracts/contracts.module';
import { InvoicesModule } from './invoices/invoices.module';
import { GeodataModule } from './geodata/geodata.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING, {
      dbName: process.env.MONGO_DB_NAME,
    }),
    UsersModule,
    AuthModule,
    AlertsModule,
    PropertiesModule,
    ContractsModule,
    InvoicesModule,
    GeodataModule,
  ],
})
export class AppModule {}
