/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageFunc, MsgObj } from "../Types/types";

export class MsgUtils {
  static setMsg(
    message: string | MsgObj | any,
    args?: object,
  ): MsgObj | undefined {
    if (!message) return undefined;
    return {
      message: message?.message || message,
      args: args || message?.args || null,
    };
  }

  static getMessage = (
    message: string | MessageFunc,
    messageArgs: any,
    value: any,
    values: any,
  ) =>
    typeof message === "function"
      ? message({
          args: messageArgs,
          value,
          values,
        })
      : messageArgs
        ? {
            message,
            args: messageArgs,
          }
        : message;
}

export default MsgUtils;
