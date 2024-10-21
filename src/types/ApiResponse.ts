import { Message } from "@/model/Message";

export interface Apiresponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
