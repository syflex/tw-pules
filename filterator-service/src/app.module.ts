import { HttpModule } from '@nestjs/axios';
import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreamingModule } from './streaming/streaming.module';
import { KeywordsModule } from './keywords/keywords.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import fiteratorClusterConfig from './config/fiteratorCluster.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyCacheModule } from './MyCache/my-cache.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, fiteratorClusterConfig],
      cache: true,
      isGlobal: true,
    }),
    HttpModule,
    StreamingModule,
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        EventEmitterModule.forRoot({
          // the delimiter used to segment namespaces
          delimiter: '.',
          // disable throwing uncaughtException if an error event is emitted and it has no listeners
          ignoreErrors: false,
        }),
      ],
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
    MyCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
