import { registerAs } from '@nestjs/config';

export default registerAs('filteratorCluster', () => ({
  services: process.env.FILTERATOR_SERVICES,
  currentService: process.env.CURRENT_SERVICE,
}));
