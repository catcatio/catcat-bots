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
  AllowNull
} from 'sequelize-typescript'

@Table({
  tableName: 'producer',
  timestamps: true
})
export class Producer extends Model<Producer> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public id: string

  @Unique
  @Column
  public email: string

  @AllowNull
  @Column
  public displayName: string

  @AllowNull
  @Column(DataType.TEXT)
  public displayImageUrl: string

  @Column(DataType.JSON)
  public providers: any

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
