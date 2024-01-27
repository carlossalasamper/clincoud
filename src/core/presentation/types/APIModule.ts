import { DynamicModule } from "inversify-sugar";

export default interface APIModule {
  forRoot(): DynamicModule;
}
