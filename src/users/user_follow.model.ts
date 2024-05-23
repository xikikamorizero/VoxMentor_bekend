import { Column, Table, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './users.model';

@Table({ tableName: 'Subscription' })
export class Subscription extends Model<Subscription> {
  @Column
  subscriberId: string;

  @ForeignKey(() => User)
  @Column
  authorId: string;

  @BelongsTo(() => User, 'authorId')
  author: User;

  @BelongsTo(() => User, 'subscriberId')
  subscriber: User;
}