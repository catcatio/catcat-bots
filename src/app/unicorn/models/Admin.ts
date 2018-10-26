import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({
  tableName: 'admin',
})
export class Admin extends Model<Admin> {
  @PrimaryKey
  @Column
  public name: string

  @Column
  public value: string
}
