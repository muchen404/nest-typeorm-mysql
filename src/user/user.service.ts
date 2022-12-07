import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from 'src/logs/logs.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';

function response<TData = any>(isOK: boolean, data: TData, message?: string) {
  return {
    code: isOK ? 0 : 1,
    message: message ?? isOK ? 'success' : 'failed',
    data
  };
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Logs) private logsRepository: Repository<Logs>
  ) {}

  async find() {
    try {
      const result = await this.userRepository.find();
      return response(true, result);
    } catch (error) {
      return response(false, error);
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.userRepository.findOne({ where: { id } });
      return response(true, result);
    } catch (error) {
      return response(false, error);
    }
  }

  async create(user: User) {
    if (!user.password || !user.username) {
      return response(false, null, 'miss parameter username or password');
    }
    try {
      const userTmp = await this.userRepository.create(user);
      const result = await this.userRepository.save(userTmp);
      return response(true, result);
    } catch (error) {
      return response(false, error);
    }
  }

  async delete(id: number) {
    try {
      const result = await this.userRepository.delete(id);
      return response(true, result);
    } catch (error) {
      return response(false, error);
    }
  }

  async update(id: number, user: User) {
    try {
      const result = await this.userRepository.update(id, user);
      return response(true, result);
    } catch (error) {
      return response(false, error);
    }
  }

  async getUserProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true
      }
    });
  }

  async findUserLogs(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
        logs: true
      }
    });
  }

  async findLogsByGroup(id: number) {
    // SELECT logs.result as result, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result

    try {
      // const result = await this.logsRepository.query(
      //   `SELECT logs.result as result, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = ${id} GROUP BY logs.result`
      // );

      const result = await this.logsRepository
        .createQueryBuilder('logs')
        .select('logs.result', 'result')
        .addSelect('COUNT("logs.result")', 'count')
        .leftJoinAndSelect('logs.user', 'user')
        .where('user.id = :id', { id })
        .groupBy('logs.result')
        .orderBy('count', 'DESC')
        .addOrderBy('result', 'DESC')
        .offset(2)
        .limit(3)
        .getRawMany();
      return response(true, result);
    } catch (error) {
      return response(false, error);
    }
  }
}
