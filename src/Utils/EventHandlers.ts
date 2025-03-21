import { TogglePasswordEvent } from "../Types/types";

export class EventHandlers {
  static toKeyboardEvent = (
    event: TogglePasswordEvent,
  ): React.KeyboardEvent<HTMLElement> => {
    return event as React.KeyboardEvent<HTMLElement>;
  };

  static isKeyboardEvent = (
    event: TogglePasswordEvent,
  ): event is React.KeyboardEvent<HTMLElement> => {
    return event.type === "keydown" || event.type === "keyup";
  };

  static handleKeyboardEvent = (
    event: React.KeyboardEvent<HTMLElement>,
    isKeyDown: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    // callback: (visible: boolean) => void,
  ) => {
    if (event.key === " " || event.key === "Enter") {
      setVisible(isKeyDown);
      //   callback(isKeyDown);
    }
  };
}
