import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'development',
  apiName: process.env.API_NAME || 'Aggregator Service',
  port: process.env.NODE_PORT || 3000,
}));
