type ToDomain<InfrastructureType, DomainType> = (
  response: InfrastructureType
) => DomainType;

export default ToDomain;
