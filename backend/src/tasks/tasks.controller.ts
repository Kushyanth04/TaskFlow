import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksGateway } from './tasks.gateway';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, IsOptional, IsEnum, IsDateString, MinLength } from 'class-validator';
import { TaskStatus, TaskPriority } from './task.schema';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  assignee?: string;

  @IsString()
  @IsOptional()
  assigneeName?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  boardId: string;

  @IsString()
  workspaceId: string;
}

export class MoveTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private tasksGateway: TasksGateway,
  ) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @CurrentUser() user: any) {
    const task = await this.tasksService.create({
      ...dto,
      createdBy: user.id,
    } as any);
    this.tasksGateway.emitTaskCreated(dto.workspaceId, task);
    return task;
  }

  @Get()
  findAll(
    @Query('boardId') boardId?: string,
    @Query('assignee') assignee?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.tasksService.findWithFilters({ boardId, assignee, status, priority });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateTaskDto>) {
    const task = await this.tasksService.update(id, dto as any);
    this.tasksGateway.emitTaskUpdated(task.workspaceId, task);
    return task;
  }

  @Patch(':id/move')
  async moveTask(@Param('id') id: string, @Body() dto: MoveTaskDto) {
    const task = await this.tasksService.moveTask(id, dto.status);
    this.tasksGateway.emitTaskMoved(task.workspaceId, task);
    return task;
  }

  @Patch(':id/pause')
  async togglePause(@Param('id') id: string) {
    const task = await this.tasksService.togglePause(id);
    this.tasksGateway.emitTaskUpdated(task.workspaceId, task);
    return task;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const task = await this.tasksService.findById(id);
    await this.tasksService.delete(id);
    this.tasksGateway.emitTaskDeleted(task.workspaceId, id);
    return { deleted: true };
  }
}
