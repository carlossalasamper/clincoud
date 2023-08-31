type MongooseSchemaMethods<DomainModelType> = {
  toDomain: () => DomainModelType;
};

export default MongooseSchemaMethods;
