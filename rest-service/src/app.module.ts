import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeywordsModule } from './keywords/keywords.module';
import { OccurrencesModule } from './occurrences/occurrences.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import fiteratorClusterConfig from './config/fiteratorCluster.config';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, fiteratorClusterConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/**/*.ts'],
        cli: {
          migrationsDir: './migrations',
        },
      }),
      inject: [ConfigService],
    }),
    KeywordsModule,
    OccurrencesModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
