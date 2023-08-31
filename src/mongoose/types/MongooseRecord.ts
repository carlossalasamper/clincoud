type MongooseRecord<DomainModelType> = Omit<
  DomainModelType,
  "id" | "createdAt" | "updatedAt"
> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export default MongooseRecord;
