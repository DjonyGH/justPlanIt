import { ELiga, IPrice } from 'src/types';

export const GAME_SETTINGS: Record<ELiga, Record<'top' | 'bottom', number>> = {
  [ELiga.common]: {
    top: 50,
    bottom: 10000000,
  },
  [ELiga.rare]: {
    top: 30,
    bottom: 450,
  },
  [ELiga.epic]: {
    top: 0,
    bottom: 70,
  },
};

export const BONUSES_AWARDS: Record<number, IPrice> = {
  1: { value: 5, token: 'Bonuses' }, // 1 место - 5 бонусов
  2: { value: 4, token: 'Bonuses' },
  3: { value: 3, token: 'Bonuses' },
  4: { value: 2, token: 'Bonuses' },
  5: { value: 1, token: 'Bonuses' },
  6: { value: 1, token: 'Bonuses' },
  7: { value: 1, token: 'Bonuses' },
  8: { value: 1, token: 'Bonuses' },
  9: { value: 1, token: 'Bonuses' },
  10: { value: 1, token: 'Bonuses' }, // 10 место - 1 бонус
};

export const AWARD_RATIO: Record<number, number> = {
  1: 0.27, // 1 место
  2: 0.19,
  3: 0.13,
  4: 0.095,
  5: 0.08,
  6: 0.07,
  7: 0.06,
  8: 0.05,
  9: 0.035,
  10: 0.02, // 10 место
};
