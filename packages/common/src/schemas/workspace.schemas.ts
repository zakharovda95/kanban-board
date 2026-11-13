import { z } from 'zod';

import { VALIDATION_MESSAGES } from '../constants/exception.constants.js';
import { WORKSPACE_INVITE_NAME_MAXLENGTH } from '../constants/workspace.constants.js';

/** Схема валидации тела запроса на создание приглашения в пространство. **/
export const createWorkspaceInviteBodySchema = z.strictObject({
  name: z
    .string({ error: VALIDATION_MESSAGES.mustBeString })
    .nonempty({ error: VALIDATION_MESSAGES.required })
    .max(WORKSPACE_INVITE_NAME_MAXLENGTH, {
      error: VALIDATION_MESSAGES.maxLength(WORKSPACE_INVITE_NAME_MAXLENGTH),
    }),
});

/** Тип схемы валидации тела запроса на создание приглашения в пространство. **/
export type TCreateWorkspaceInviteBodySchema = z.infer<typeof createWorkspaceInviteBodySchema>;
