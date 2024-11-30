import { CommentRepository, UserRepository } from '@/database/repositories';
import { CommentFilter } from '@/shared/filters/comment.filter';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In } from 'typeorm';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private userRepository: UserRepository,
  ) {}

  async getListComments(filter: CommentFilter) {
    const { items, meta } = await this.commentRepository.paginate(filter);
    let userIds = items.map((item) => item.user_id);
    userIds = [...new Set(userIds)];
    let userInfos = {};
    if (userIds.length) {
      const users = await this.userRepository.find({
        where: { id: In(userIds) },
        select: ['id', 'email', 'username', 'avatar_url'],
      });
      userInfos = users.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
    }
    return {
      items: items.map((item) => ({
        ...item,
        user: userInfos[item.user_id] || null,
      })),
      meta,
    };
  }

  async getDetailComment(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!comment) {
      throw new NotFoundException('Notfound comment');
    }
    return {
      ...comment,
      user: {
        id: comment.user.id,
        username: comment.user?.username,
        email: comment.user?.email,
        avatar_url: comment.user?.avatar_url,
      },
    };
  }

  async createComment(user_id: string, data: CreateCommentDto) {
    const newComment = await this.commentRepository.save({
      user_id,
      ...data,
    });
    return await this.getDetailComment(newComment.id);
  }

  async updateComment(id: string, data: UpdateCommentDto) {
    await this.commentRepository.update({ id }, data);
    return await this.getDetailComment(id);
  }

  async deleteComment(id: string, user_id: string) {
    const currentComment = await this.commentRepository.findOne({
      where: { id, user_id },
    });
    if (!currentComment) {
      throw new NotFoundException('Notfound comment');
    }
    if (currentComment.user_id !== user_id) {
      throw new ForbiddenException('You not have permission to delete');
    }
    await this.commentRepository.delete({ id });
  }
}
