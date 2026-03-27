import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Task, TaskStatus } from './task.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async create(data: Partial<Task>): Promise<Task> {
    const task = new this.taskModel(data);
    const saved = await task.save();

    // Queue notification if task is assigned
    if (saved.assignee) {
      await this.notificationsQueue.add('task-assigned', {
        taskId: saved._id,
        taskTitle: saved.title,
        assignee: saved.assignee,
        assigneeName: saved.assigneeName,
      });
    }

    // Queue due date reminder if set
    if (saved.dueDate) {
      const reminderTime = new Date(saved.dueDate);
      reminderTime.setHours(reminderTime.getHours() - 24);
      const delay = Math.max(0, reminderTime.getTime() - Date.now());

      await this.notificationsQueue.add(
        'due-reminder',
        {
          taskId: saved._id,
          taskTitle: saved.title,
          assignee: saved.assignee,
          dueDate: saved.dueDate,
        },
        { delay },
      );
    }

    return saved;
  }

  async findByBoard(boardId: string): Promise<Task[]> {
    return this.taskModel.find({ boardId }).sort({ createdAt: -1 }).exec();
  }

  async findWithFilters(filters: {
    boardId?: string;
    assignee?: string;
    status?: string;
    priority?: string;
  }): Promise<Task[]> {
    const query: any = {};
    if (filters.boardId) query.boardId = filters.boardId;
    if (filters.assignee) query.assignee = filters.assignee;
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    return this.taskModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async moveTask(id: string, status: TaskStatus): Promise<Task> {
    const existingTask = await this.taskModel.findById(id).exec();
    if (!existingTask) throw new NotFoundException('Task not found');
    
    const updatePayload: any = { status };
    
    if (status === TaskStatus.IN_PROGRESS && existingTask.status !== TaskStatus.IN_PROGRESS) {
      updatePayload.startedAt = new Date();
      updatePayload.isPaused = false;
    } else if (status === TaskStatus.DONE && existingTask.status !== TaskStatus.DONE) {
      if (existingTask.startedAt && !existingTask.isPaused) {
        updatePayload.timeTakenSeconds = (existingTask.timeTakenSeconds || 0) + Math.floor((new Date().getTime() - existingTask.startedAt.getTime()) / 1000);
        updatePayload.startedAt = null;
      }
    }

    const task = await this.taskModel
      .findByIdAndUpdate(id, updatePayload, { new: true })
      .exec();
    return task;
  }

  async togglePause(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    if (task.status !== TaskStatus.IN_PROGRESS) return task;

    if (task.isPaused) {
      task.isPaused = false;
      task.startedAt = new Date();
    } else {
      task.isPaused = true;
      if (task.startedAt) {
        const elapsed = Math.floor((new Date().getTime() - task.startedAt.getTime()) / 1000);
        task.timeTakenSeconds = (task.timeTakenSeconds || 0) + elapsed;
        task.startedAt = null;
      }
    }
    return task.save();
  }

  async delete(id: string): Promise<void> {
    await this.taskModel.findByIdAndDelete(id).exec();
  }

  // Check for overdue tasks (called by a cron or on-demand)
  async checkOverdueTasks(): Promise<void> {
    const overdueTasks = await this.taskModel
      .find({
        dueDate: { $lt: new Date() },
        status: { $ne: TaskStatus.DONE },
      })
      .exec();

    for (const task of overdueTasks) {
      await this.notificationsQueue.add('task-overdue', {
        taskId: task._id,
        taskTitle: task.title,
        assignee: task.assignee,
        dueDate: task.dueDate,
      });
    }
  }
}
