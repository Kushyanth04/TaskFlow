import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './workspace.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
  ) {}

  async create(name: string, ownerId: string): Promise<Workspace> {
    const workspace = this.workspacesRepository.create({
      name,
      ownerId,
      members: [ownerId],
    });
    return this.workspacesRepository.save(workspace);
  }

  async findAllForUser(userId: string): Promise<Workspace[]> {
    const workspaces = await this.workspacesRepository.find();
    return workspaces.filter(
      (ws) => ws.ownerId === userId || (ws.members && ws.members.includes(userId)),
    );
  }

  async findById(id: string): Promise<Workspace> {
    const workspace = await this.workspacesRepository.findOne({ where: { id } });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }

  async update(id: string, userId: string, data: Partial<Workspace>): Promise<Workspace> {
    const workspace = await this.findById(id);
    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('Only workspace owner can update');
    }
    Object.assign(workspace, data);
    return this.workspacesRepository.save(workspace);
  }

  async addMember(workspaceId: string, userId: string, memberId: string): Promise<Workspace> {
    const workspace = await this.findById(workspaceId);
    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('Only workspace owner can add members');
    }
    if (!workspace.members) workspace.members = [];
    if (!workspace.members.includes(memberId)) {
      workspace.members.push(memberId);
    }
    return this.workspacesRepository.save(workspace);
  }

  async delete(id: string, userId: string): Promise<void> {
    const workspace = await this.findById(id);
    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('Only workspace owner can delete');
    }
    await this.workspacesRepository.remove(workspace);
  }
}
