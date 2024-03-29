import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@Controller(':planId/schedule')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @Post()
    async create(
        @Param("planId") planId: number,
        @Body() createScheduleDto: CreateScheduleDto) {
        const createSchedule = await this.scheduleService.create(planId,createScheduleDto);

        return {
            statusCode: HttpStatus.CREATED,
            message: "스케쥴이 생성되었습니다",
            createSchedule,
        };
    }

    // @Get()
    // findAll() {
    //   return this.planService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.planService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    //   return this.planService.update(+id, updatePlanDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.planService.remove(+id);
    // }

}
