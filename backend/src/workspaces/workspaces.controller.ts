import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @MinLength(2)
  name: string;
}

export class AddMemberDto {
  @IsString()
  memberId: string;
}

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  create(@Body() dto: CreateWorkspaceDto, @CurrentUser() user: any) {
    return this.workspacesService.create(dto.name, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.workspacesService.findAllForUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspacesService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CreateWorkspaceDto,
    @CurrentUser() user: any,
  ) {
    return this.workspacesService.update(id, user.id, { name: dto.name });
  }

  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @Body() dto: AddMemberDto,
    @CurrentUser() user: any,
  ) {
    return this.workspacesService.addMember(id, user.id, dto.memberId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.workspacesService.delete(id, user.id);
  }
}
