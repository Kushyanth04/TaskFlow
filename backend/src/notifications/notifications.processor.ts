import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('notifications')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  @Process('task-assigned')
  async handleTaskAssigned(job: Job) {
    const { taskTitle, assignee, assigneeName } = job.data;
    this.logger.log(
      `📧 Notification: Task "${taskTitle}" assigned to ${assigneeName || assignee}`,
    );
    // In production: send email, push notification, or save to notifications collection
    return { sent: true, type: 'task-assigned' };
  }

  @Process('due-reminder')
  async handleDueReminder(job: Job) {
    const { taskTitle, assignee, dueDate } = job.data;
    this.logger.log(
      `⏰ Reminder: Task "${taskTitle}" is due at ${dueDate} (assigned to ${assignee})`,
    );
    return { sent: true, type: 'due-reminder' };
  }

  @Process('task-overdue')
  async handleTaskOverdue(job: Job) {
    const { taskTitle, assignee, dueDate } = job.data;
    this.logger.warn(
      `🚨 Escalation: Task "${taskTitle}" is OVERDUE (was due ${dueDate}, assigned to ${assignee})`,
    );
    return { sent: true, type: 'task-overdue' };
  }
}
