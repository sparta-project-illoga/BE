import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';

@UseGuards(AuthGuard("jwt"))
@Controller(':planId/schedule')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @Post()
    async create(
        @Param("planId") planId: number,
        @Body() createScheduleDto: CreateScheduleDto,
        @UserInfo() user: User,
    ) {
        const createSchedule = await this.scheduleService.create(planId, createScheduleDto, user);

        return {
            createSchedule,
        };
    }

    @Get()
    async findAll(@Param("planId") planId: number) {
        const findAllSchedule = await this.scheduleService.findAll(planId);

        return {
            findAllSchedule
        };
    }

    @Patch(':id')
    async update(
        @Param('planId') planId: number,
        @Param("id") id: number,
        @Body() updateScheduleDto: UpdateScheduleDto,
        @UserInfo() user: User,
    ) {

        const updateSchedule = await this.scheduleService.update(planId, id, updateScheduleDto, user)

        return updateSchedule;
    }

    @Delete(':id')
    async remove(
        @Param("planId") planId: number,
        @Param('id') id: number,
        @UserInfo() user: User,
    ) {

        const deleteSchedule = await this.scheduleService.remove(planId, id, user)

        return deleteSchedule;

    }

}
