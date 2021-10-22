import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTableUsers1628817652226 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
        new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: 'username',
                    type: 'varchar',
                    length: '20',
                    isNullable: false,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '50',
                    isNullable: false,
                },
                { name: "created_at", type: "timestamp", isNullable: false },
                { name: "updated_at", type: "timestamp", isNullable: false },
            ]
        })
    );
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users", true, true, true);
    };

};

