import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { RequireAnyPipe } from '@/libs/pipes/require-any.pipe';
import type { TSuccessResponse } from '@/libs/types/response.types';
import { BoardService } from '@/modules/board/board.service';
import { CreateBoardDto } from '@/modules/board/libs/dtos/create-board.dto';
import { PatchBoardDto } from '@/modules/board/libs/dtos/patch-board.dto';
import type {
  TBoard,
  TBoardBase,
  TCreateBoardResponse,
} from '@/modules/board/libs/types/board.types';
import { MoveDto } from '@/modules/shared/move/libs/dto/move.dto';
import { MovePipe } from '@/modules/shared/move/libs/pipes/move.pipe';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  public async getBoards(): Promise<TBoardBase[]> {
    return await this.boardService.getBoards();
  }

  @Post()
  public async createBoard(@Body() body: CreateBoardDto): Promise<TCreateBoardResponse> {
    return await this.boardService.createBoard(body);
  }

  @Post(':boardId/move')
  @HttpCode(HttpStatus.OK)
  public async moveBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body(MovePipe) body: MoveDto,
  ): Promise<TSuccessResponse> {
    return await this.boardService.moveBoard(boardId, body);
  }

  @Get(':boardId')
  public async getBoardById(@Param('boardId', ParseIntPipe) boardId: number): Promise<TBoard> {
    return await this.boardService.getBoardById(boardId);
  }

  @Patch(':boardId')
  public async patchBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body(new RequireAnyPipe(['title', 'description'])) body: PatchBoardDto,
  ): Promise<TSuccessResponse> {
    return await this.boardService.patchBoard(boardId, body);
  }

  @Delete(':boardId')
  public async deleteBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<TSuccessResponse> {
    return await this.boardService.deleteBoard(boardId);
  }
}
