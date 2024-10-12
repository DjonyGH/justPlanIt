import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { MyJwtModule } from 'src/jwt/myJwt.module';
import { GoalsController } from './goals.controller';
import { GoalModel } from './goals.model';
import { GoalsService } from './goals.service';

@Module({
  controllers: [GoalsController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GoalModel,
        schemaOptions: {
          collection: 'Goals',
        },
      },
    ]),
    MyJwtModule,
    ConfigModule,
  ],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
