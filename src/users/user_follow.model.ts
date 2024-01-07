import { Column, Table, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './users.model';

@Table({ tableName: 'subscriptions_end' })
export class Subscription extends Model<Subscription> {
  @Column
  subscriberId: number;

  @ForeignKey(() => User)
  @Column
  authorId: number;

  @BelongsTo(() => User, 'authorId')
  author: User;

  @BelongsTo(() => User, 'subscriberId')
  subscriber: User;
}