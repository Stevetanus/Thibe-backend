import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
  ) {}
  async create(createPostDto: CreatePostDto) {
    // const slug = createPostDto.title.split(' ').join('_').toLowerCase();
    // return await this.repo.insert({ ...createPostDto, slug });

    const post = new Post();
    if (!post.userId) post.userId = 1;
    if (!post.categories) {
      const noCategory = new Category();
      noCategory.id = 1;
      post.categories = [noCategory];
    }
    Object.assign(post, createPostDto);

    this.repo.create(post);
    return await this.repo.save(post);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.repo.update(id, updatePostDto);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
