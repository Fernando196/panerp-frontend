import type { CAT_ICONS } from '~/const/icons.const'

export type Icons = (typeof CAT_ICONS)[keyof typeof CAT_ICONS]
