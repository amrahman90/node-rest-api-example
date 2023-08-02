import { Table, Model, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './User';

@Table({
  timestamps: true,
  tableName: 'tokens',
})
export class Token extends Model<Token> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  token!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiredTime!: Date;
}

export default Token;