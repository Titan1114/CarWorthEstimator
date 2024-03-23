import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private repo: Repository<Report>
    ){}

    create(reportDto: CreateReportDto, user: User){
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report);
    }
    
    async changeApproval(id: string, approved: boolean){
        const report= await this.repo.findOneBy({id: parseInt(id)});
        if(!report){
            throw new NotFoundException('report not found');
        }
        report.approved = approved;
        return this.repo.save(report);
    }

    async createEtimate({ make, model, year, mileage, lng, lat}: GetEstimateDto){
        return this.repo.createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make= :make', { make })
        .andWhere('model= :model', { model })
        .andWhere('year- :year BETWEEN -3 AND 3', { year })
        .andWhere('lat- :lat BETWEEN -5 AND 5', { lat })
        .andWhere('lng- :lng BETWEEN -5 AND 5', { lng })
        .andWhere('approved is TRUE')
        .orderBy('ABS(mileage- :mileage)', 'DESC').setParameters({ mileage })
        .limit(3)
        .getRawOne()
    }
}