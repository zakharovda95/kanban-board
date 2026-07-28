import type {
  TBoard,
  TBoardBase,
  TCreateBoardResponse,
  TSuccessResponse,
} from '@kanban-board/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import ParameterIdPipe from '@/libs/pipes/parameter-id.pipe';
import { RequireAnyPipe } from '@/libs/pipes/require-any.pipe';
import { BoardService } from '@/modules/board/board.service';
import { CreateBoardDto } from '@/modules/board/libs/dtos/create-board.dto';
import { PatchBoardDto } from '@/modules/board/libs/dtos/patch-board.dto';
import { MoveParametersDto } from '@/modules/shared/move/libs/dto/move-parameters.dto';
import { MovePipe } from '@/modules/shared/move/libs/pipes/move.pipe';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  public async getBoards(): Promise<TBoardBase[]> {
    return await this.boardService.getBoards();
  }

  @Get(':boardId')
  public async getBoardById(@Param('boardId', ParameterIdPipe) boardId: number): Promise<TBoard> {
    return await this.boardService.getBoardById(boardId);
  }

  @Post()
  public async createBoard(@Body() body: CreateBoardDto): Promise<TCreateBoardResponse> {
    return await this.boardService.createBoard(body);
  }

  @Post(':boardId/move')
  @HttpCode(HttpStatus.OK)
  public async moveBoard(
    @Param('boardId', ParameterIdPipe) boardId: number,
    @Body(MovePipe) body: MoveParametersDto,
  ): Promise<TSuccessResponse> {
    return await this.boardService.moveBoard(boardId, body);
  }

  @Patch(':boardId')
  public async patchBoard(
    @Param('boardId', ParameterIdPipe) boardId: number,
    @Body(new RequireAnyPipe(['title', 'description'])) body: PatchBoardDto,
  ): Promise<TSuccessResponse> {
    return await this.boardService.patchBoard(boardId, body);
  }

  @Delete(':boardId')
  public async deleteBoard(
    @Param('boardId', ParameterIdPipe) boardId: number,
  ): Promise<TSuccessResponse> {
    return await this.boardService.deleteBoard(boardId);
  }
}
