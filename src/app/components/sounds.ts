import { Howl } from "howler";

export const timerStartSound = new Howl({
  src: ["/sounds/start.mp3"],
  preload: true,
});

export const timerEndSound = new Howl({
  src: ["/sounds/end.mp3"],
  preload: true,
});
