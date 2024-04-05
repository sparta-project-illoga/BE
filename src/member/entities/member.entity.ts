import { Plan } from "src/plan/entities/plan.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MemberType } from "../types/member.type";
import { User } from "src/user/entities/user.entity";


@Entity({ name: 'members', })
export class Member {
    @PrimaryGeneratedColumn({ type: 'int' })
    memberId: number;

    @Column({ type: 'int', nullable: false })
    planId: number;

    @Column({ type: 'int', nullable: false })
    userId: number;

    //멤버로 추가된 사용자의 이름
    @Column()
    name: string;

    @Column({ type: 'enum', enum: MemberType, default: MemberType.Member })
    type: MemberType;

    @ManyToOne(() => Plan, (plan) => plan.member, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'planId' })
    plan: Plan;

    @ManyToOne(() => User, (user) => user.member, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
