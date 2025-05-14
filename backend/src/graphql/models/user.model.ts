import Prisma from ".prisma/client";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class UserModel {
  @Field((_) => ID)
  id!: string;

  @Field((_) => String)
  username!: string;

  @Field((_) => String, { nullable: true })
  fullName!: string | null;

  @Field((_) => String, { nullable: true })
  email!: string | null;

  @Field((_) => Date)
  createdAt!: Date;

  @Field((_) => Date)
  updatedAt?: Date;

  static fromPrisma(data: Prisma.User): UserModel {
    return {
      id: data.id.toString(),
      username: data.username,
      fullName: data.full_name,
      email: data.email,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static fromPrismaArray(data: Prisma.User[]): UserModel[] {
    return data.map((user) => UserModel.fromPrisma(user));
  }
}
