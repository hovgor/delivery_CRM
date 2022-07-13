import { Test, TestingModule } from '@nestjs/testing';
import TaskListEntityBase from '../task_list/task_list.entity';
import { AuthService } from '../auth/auth.service';
import { TaskListService } from '../task_list/task_list.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  const mockTasksService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        TaskListService,
        AuthService,
        TaskListEntityBase,
      ],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    controller = module.get<TasksController>(TasksController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
