import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

// @UseGuards(AuthGuard("jwt"))
@Controller(':planId/schedule')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @Post()
    async create(
        @Param("planId") planId: number,
        @Body() createScheduleDto: CreateScheduleDto) {
        const createSchedule = await this.scheduleService.create(planId, createScheduleDto);

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
        @Body() updateScheduleDto: UpdateScheduleDto) {

        const updateSchedule = await this.scheduleService.update(planId, id, updateScheduleDto)

        return updateSchedule;
    }

    @Delete(':id')
    async remove(
        @Param("planId") planId: number,
        @Param('id') id: number) {

        const deleteSchedule = await this.scheduleService.remove(planId, id)

        return deleteSchedule;

    }

}
