import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://inna42320:innessa12345@inna.eewddjy.mongodb.net/blog',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
