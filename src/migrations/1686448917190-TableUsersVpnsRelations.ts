import {MigrationInterface, QueryRunner} from "typeorm";

export class TableUsersVpnsRelations1686448917190 implements MigrationInterface {
    name = 'TableUsersVpnsRelations1686448917190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."vpn" RENAME COLUMN "createdByUserId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" ADD CONSTRAINT "FK_3fe8e00e7f88cd2d0ef38414e95" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."vpn" DROP CONSTRAINT "FK_3fe8e00e7f88cd2d0ef38414e95"`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."vpn" RENAME COLUMN "userId" TO "createdByUserId"`);
    }

}
