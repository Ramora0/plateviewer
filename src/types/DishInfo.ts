export default interface DishInfo {
  name: string;
  expirationTime: number;
  status: string;
  id: string;
  plateID: string;
  categoryID: string;
  stationID: string;
  ingredients?: string[];
}

export interface BeltData {
  categoryData: { [categoryID: string]: CategoryData };
  expired: number;
  almostExpired: number;
  total: number;
}

export interface CategoryData {
  plates: { [plateName: string]: number };
  expired: number;
  almostExpired: number;
  total: number;
  averageAge: number;
}
