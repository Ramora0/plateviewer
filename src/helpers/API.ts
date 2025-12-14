import { TagReads } from "../types/TagReads";

export default class API {
  static url = "https://rfp7desgu5.execute-api.us-east-1.amazonaws.com/prod";

  static async getPlates(): Promise<TagReads[]> {
    const tags = (await API.apiCall("tag_timestamps")).tags;
    const plateProps = [];

    for (const tagID in tags) {
      plateProps.push({
        tagID: tagID,
        timesSeen: tags[tagID].map((time: string) => Number(time)),
      });
    }

    return plateProps;
  }

  static async apiCall(id: string): Promise<any> {
    const toURL = `${API.url}/get-data?id=${id}&is_ipad=true`;
    console.log(toURL);
    const response = await fetch(toURL).then((response) => response.json());
    return response;
  }

  static async postAPICall(path: string, data: any): Promise<any> {
    const toURL = `${API.url}/${path}`;
    console.log(toURL);
    const response = await fetch(toURL, {
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => response.json());
    return response;
  }

  static async getAPICall(path: string): Promise<any> {
    const toURL = `${API.url}/${path}`;
    console.log(toURL);
    const response = await fetch(toURL, {
      method: "GET",
    }).then((response) => response.json());
    console.log("RESPONSE", response);
    return response;
  }
}
