import DishInfo from "../types/DishInfo";
import { TagInfo } from "../types/TagInfo";
import API from "./API";

export default class DishHelper {
  static url = "https://rfp7desgu5.execute-api.us-east-1.amazonaws.com/prod";

  // Maps every tagID to a menuItemID
  tagInfo: {
    [tagID: string]: TagInfo;
  } = {};
  // Maps every menuItemID to a dish
  dishData: {
    [dishID: string]: DishInfo;
  } = {};

  ready: boolean = false;

  constructor(
    tagInfo: { [tagID: string]: TagInfo } = {},
    dishData: { [dishID: string]: DishInfo } = {},
    ready: boolean = false
  ) {
    this.tagInfo = tagInfo;
    this.dishData = dishData;
    this.ready = ready;
  }

  static async getData(): Promise<DishHelper> {
    const tags: TagInfo[] = await API.apiCall("tag_ids").then(
      (response) => response.ids
    );

    const tagInfo: { [tagID: string]: TagInfo } = {};

    for (const tag of tags) {
      tagInfo[tag.tagID] = tag;
    }

    const dish_data = await API.apiCall("dish_data").then(
      (response) => response.dish_data
    );

    const dishData: { [dishID: string]: DishInfo } = {};

    for (const dish of dish_data) {
      dishData[dish.id] = {
        ...dish,
        expirationTime: parseInt(dish.expirationTime),
      };
    }

    return new DishHelper(tagInfo, dishData, true);
  }

  getDishID(tagID: string): string {
    return this.tagInfo[tagID].menuItemID;
  }

  getDishData(dishID: string): DishInfo {
    return this.dishData[dishID];
  }
}
