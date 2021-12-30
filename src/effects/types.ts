import type { Effect } from '@/enums';

export interface EffectObject<P> {
    effect: Effect;
    param?: P;
}
