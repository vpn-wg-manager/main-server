import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableServers1685190558460 implements MigrationInterface {
    name = 'CreateTableServers1685190558460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "servers" ("id" SERIAL NOT NULL, "name" character varying(20) NOT NULL, "addr" character varying(30) NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_555671bf0b4b7ec59c9985532e1" UNIQUE ("name"), CONSTRAINT "UQ_9a9876a3d761821299f4eaacb8c" UNIQUE ("addr"), CONSTRAINT "PK_c0947efd9f3db2dcc010164d20b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_555671bf0b4b7ec59c9985532e" ON "servers" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9a9876a3d761821299f4eaacb8" ON "servers" ("addr") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_9a9876a3d761821299f4eaacb8"`);
        await queryRunner.query(`DROP INDEX "IDX_555671bf0b4b7ec59c9985532e"`);
        await queryRunner.query(`DROP TABLE "servers"`);
    }

}
