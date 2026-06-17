import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';
import { isDefined } from '@/libs/utilities/check.utilities';
import { TMoveParameters } from '@/modules/shared/move/libs/types/move.types';

@Injectable()
export class MovePipe implements PipeTransform {
  transform(params: TMoveParameters, _: ArgumentMetadata): TMoveParameters {
    const { previousId, nextId } = params;
    if (!isDefined(previousId) && !isDefined(nextId))
      throw new BadRequestException(EXCEPTION_MESSAGES.atLeastOneFieldRequired);

    if (isDefined(previousId) && isDefined(nextId))
      throw new BadRequestException(EXCEPTION_MESSAGES.onlyOneIdShouldBeSpecified);

    return params;
  }
}
