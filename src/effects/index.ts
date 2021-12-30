import { Effect } from '@/enums';
import type { EffectObject } from './types';

export const effects = {
    none: (): EffectObject<{}> => ({
        effect: Effect.None,
    }),
    solid: (param: any): EffectObject<{}> => ({
        effect: Effect.Static,
        param,
    }),
    custom: (param: any): EffectObject<{}> => ({
        effect: Effect.Custom,
        param,
    }),
    custom2: (param: any): EffectObject<{}> => ({
        effect: Effect.Custom2,
        param,
    }),
};

export * from './types';
