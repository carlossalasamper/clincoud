type Presenter<ResponseType, ViewModelType> = (
  response: ResponseType
) => ViewModelType;

export default Presenter;