import DishInfo from "./DishInfo";

export interface TagReads {
  tagID: string;
  timesSeen: number[];
  dishData?: DishInfo;
}
