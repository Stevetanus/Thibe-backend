import { Exclude } from 'class-transformer';
import slugify from 'slugify';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  slug: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createOn: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modifiedOn: Date;

  @Column({ default: '' })
  mainImageUrl: string;

  @Column()
  @Exclude()
  userId: number;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: User;

  @ManyToMany(() => Category, { eager: true })
  @JoinTable()
  categories: Category[];

  @BeforeInsert()
  slugifyPost() {
    this.slug = slugify(this.title.substring(0, 20), {
      lower: true,
      replacement: '_',
    });
  }
}
