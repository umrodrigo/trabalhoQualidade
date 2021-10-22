import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateTableNotes1629052055741 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'notes',
                columns: [
                    {
                        name: 'id',
                        type: 'serial',
                        isPrimary: true,
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'varchar',
                        isPrimary: true,
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: "details",
                        type: 'varchar',
                        length: '200',
                        isNullable: true,
                    },
                    { name: "created_at", type: "timestamp", isNullable: false },
                    { name: "updated_at", type: "timestamp", isNullable: false },
                ],
            })
            );
        await queryRunner.createForeignKey(
            "notes",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("notes", true, true, true);
    }

}
