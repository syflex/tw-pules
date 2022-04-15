import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'development',
  apiName: process.env.API_NAME || 'Filterator Service',
  port: process.env.NODE_PORT || 4000,
  token: process.env.TOKEN,
  streamURL: process.env.STREAM_URL,
  aggregatorURL: process.env.AGGREGATOR_URL,
}));
