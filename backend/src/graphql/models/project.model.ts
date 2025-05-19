import Prisma from ".prisma/client";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class ProjectModel {
  @Field((_) => ID)
  id!: string;

  @Field((_) => String)
  name!: string;

  @Field((_) => String)
  key!: string;

  @Field((_) => String, { nullable: true })
  description!: string | null;

  @Field((_) => Date)
  createdAt!: Date;

  @Field((_) => Date)
  updatedAt?: Date;

  static fromPrisma(data: Prisma.Project): ProjectModel {
    return {
      id: data.id.toString(),
      name: data.name,
      key: data.key,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static fromPrismaArray(data: Prisma.Project[]): ProjectModel[] {
    return data.map((item) => ProjectModel.fromPrisma(item));
  }
}
