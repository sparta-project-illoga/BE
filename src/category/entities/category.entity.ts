import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Plan } from "src/plan/entities/plan.entity";
import { CategoryName } from "../types/category.type";

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn({ type: 'int' })
    categoryId: number;

    @Column({ type: 'int', nullable: false })
    planId: number;

    @Column({ type: 'enum', enum: CategoryName, nullable: false })
    category_name: CategoryName;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Plan, (plan) => plan.category, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'planId' })
    plan: Plan;
}