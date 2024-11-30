import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentService } from '../services';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';

@Controller('comments')
@ApiTags('Comments')
@ApiBearerAuth()
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  public async createComment(
    @Request() req: any,
    @Body() data: CreateCommentDto,
  ) {
    const newComment = await this.commentService.createComment(
      req.user.sub,
      data,
    );
    return {
      statusCode: HttpStatus.OK,
      data: newComment,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  public async updateComment(
    @Request() req: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body()
    data: UpdateCommentDto,
  ) {
    const updateComment = await this.commentService.updateComment(id, data);
    return {
      statusCode: HttpStatus.OK,
      data: updateComment,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteComment(
    @Request() req: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.commentService.deleteComment(id, req.user.sub);
    return {
      statusCode: HttpStatus.OK,
      data: true,
    };
  }
}
