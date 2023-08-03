export interface UseCase<PayloadType = void, ResponseType = void> {
  execute(payload: PayloadType): Promise<ResponseType>;
}
