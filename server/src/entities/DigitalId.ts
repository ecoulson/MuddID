import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class DigitalId extends BaseEntity {
	@Field()
	@PrimaryColumn()
	public id: string;

	@Field()
	@Column()
	public logoPhotoUrl: string;

	@Field()
	@Column()
	public facePhotoUrl: string;

	@Field()
	@Column()
	public name: string;

	@Field()
	@Column()
	public type: "STUDENT";

	@Field()
	@Column()
	public dateOfBirth: Date;

	@Field()
	@CreateDateColumn()
	public createdAt: Date;

	@Field()
	@UpdateDateColumn()
	public updatedAt: Date;

	constructor(
		id: string,
		logoPhotoUrl: string,
		facePhotoUrl: string,
		name: string,
		type: "STUDENT",
		dateOfBirth: Date
	) {
		super();
		this.id = id;
		this.logoPhotoUrl = logoPhotoUrl;
		this.facePhotoUrl = facePhotoUrl;
		this.name = name;
		this.type = type;
		this.dateOfBirth = dateOfBirth;
	}
}
