import {
  Column,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
  Unique,
  DataType,
  HasMany,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Default,
  AllowNull,
  IsUUID
} from 'sequelize-typescript'

@Table({
  tableName: 'registration',
  timestamps: true
})
export class Registration extends Model<Registration> {
  @PrimaryKey
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column
  public id: string

  @Column
  public key: string

  @Column(DataType.JSON)
  public detail: any

  @AllowNull
  @Column
  public approved?: boolean


  @CreatedAt
  public creationDate: Date

  @UpdatedAt
  public updatedOn: Date

  @DeletedAt
  public deletionDate: Date

  constructor(values?: any, options?: any) {
    super(values, options)
  }
}
