import * as migration_20251226_042032 from './20251226_042032';

export const migrations = [
  {
    up: migration_20251226_042032.up,
    down: migration_20251226_042032.down,
    name: '20251226_042032'
  },
];
