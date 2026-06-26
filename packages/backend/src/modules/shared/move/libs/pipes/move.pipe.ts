import { isDefined, type TMoveParameters } from '@kanban-board/common';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { EXCEPTION_MESSAGES } from '@/libs/constants/exception.constants';

@Injectable()
export class MovePipe implements PipeTransform {
  transform(params: TMoveParameters, _: ArgumentMetadata): TMoveParameters {
    const { previousId, nextId } = params;

    if (!isDefined(previousId) && !isDefined(nextId))
      throw new BadRequestException(EXCEPTION_MESSAGES.atLeastOneIdRequired);

    if (isDefined(previousId) && isDefined(nextId))
      throw new BadRequestException(EXCEPTION_MESSAGES.onlyOneIdShouldBeSpecified);

    return params;
  }
}
