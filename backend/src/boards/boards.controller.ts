import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, MinLength } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  workspaceId: string;
}

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post()
  create(@Body() dto: CreateBoardDto, @CurrentUser() user: any) {
    return this.boardsService.create(dto.name, dto.workspaceId, user.id);
  }

  @Get()
  findByWorkspace(@Query('workspaceId') workspaceId: string) {
    return this.boardsService.findByWorkspace(workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardsService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateBoardDto>) {
    return this.boardsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.boardsService.delete(id);
  }
}
