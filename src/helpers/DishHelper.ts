import DishInfo from "../types/DishInfo";
import { TagInfo } from "../types/TagInfo";
import API from "./API";

export default class DishHelper {
  static url = "https://rfp7desgu5.execute-api.us-east-1.amazonaws.com/prod";

  // Maps every tagID to a menuItemID
  tagToDish: {
    [tagID: string]: string;
  } = {};
  // Maps every menuItemID to a dish
  dishData: {
    [dishID: string]: DishInfo;
  } = {};

  ready: boolean = false;

  constructor(
    tagToDish: { [tagID: string]: string } = {},
    dishData: { [dishID: string]: DishInfo } = {},
    ready: boolean = false
  ) {
    this.tagToDish = tagToDish;
    this.dishData = dishData;
    this.ready = ready;
  }

  static async getData(): Promise<DishHelper> {
    const tags: TagInfo[] = await API.apiCall("tag_ids").then(
      (response) => response.ids
    );

    const tagToDish: { [tagID: string]: string } = {};

    for (const tag of tags) {
      tagToDish[tag.tagID] = tag.menuItemID;
    }

    const dish_data = await API.apiCall("dish_data").then(
      (response) => response.dish_data
    );

    const dishData: { [dishID: string]: DishInfo } = {};

    for (const dish of dish_data) {
      dishData[dish.id] = dish;
    }

    return new DishHelper(tagToDish, dishData, true);
  }

  getDishID(tagID: string): string {
    return this.tagToDish[tagID];
  }

  getDishData(dishID: string): DishInfo {
    return this.dishData[dishID];
  }
}
