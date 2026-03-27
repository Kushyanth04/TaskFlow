import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './board.schema';

@Injectable()
export class BoardsService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  async create(name: string, workspaceId: string, userId: string): Promise<Board> {
    const board = new this.boardModel({
      name,
      workspaceId,
      members: [userId],
    });
    return board.save();
  }

  async findByWorkspace(workspaceId: string): Promise<Board[]> {
    return this.boardModel.find({ workspaceId }).exec();
  }

  async findById(id: string): Promise<Board> {
    const board = await this.boardModel.findById(id).exec();
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  async update(id: string, data: Partial<Board>): Promise<Board> {
    const board = await this.boardModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  async delete(id: string): Promise<void> {
    await this.boardModel.findByIdAndDelete(id).exec();
  }
}
