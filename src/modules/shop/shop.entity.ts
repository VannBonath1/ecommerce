import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shopName: string;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => User, (user) => user.shops)
  user: User;

  @Column()
  userId: number;
}
