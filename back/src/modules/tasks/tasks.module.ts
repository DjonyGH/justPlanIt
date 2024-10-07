import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { MyJwtModule } from 'src/jwt/myJwt.module';
import { TasksController } from './tasks.controller';
import { TaskModel } from './tasks.model';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TaskModel,
        schemaOptions: {
          collection: 'tasks',
        },
      },
    ]),
    MyJwtModule,
    ConfigModule,
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
