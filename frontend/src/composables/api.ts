import { ITokenModel } from "../models/ITokenModel";
//import file from "./urls.json";
async function checkRefresh(token: ITokenModel): Promise<any> {
  try {
    const val = JSON.parse(atob(token.access_token.split(".")[1]));
    const expiration = val.exp ? val.exp * 1000 : 0;
    console.log(
      "Expiration Date: " + new Date(expiration),
      "\nCurrent Date: " + new Date(Date.now())
    );

    if (expiration < Date.now()) {
      console.log("Token is expired");
      /* const response = await fetch(file.refresh_token, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: token.refresh_token,
        }),
      });
      console.log(response); */
      localStorage.setItem("userLogin", "");
      window.location.href = "/";
    }
  } catch (e) {
    console.error(e);
  }
}

export async function GET(url: string, token: ITokenModel): Promise<any> {
  try {
    checkRefresh(token);
    const headers: any = {};

    if (token != null) {
      headers["Authorization"] = `${token.token_type} ${token.access_token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`GET request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("ERROR IN GET REQUEST: ", error);
  }
}

export async function POST(
  url: string,
  data: any,
  token?: ITokenModel
): Promise<any> {
  try {
    if (token) checkRefresh(token);
    const headers: any = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    if (token != null) {
      headers["Authorization"] = `${token.token_type} ${token.access_token}`;
    }
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`POST request failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.error("ERROR IN POST REQUEST: ", error);
  }
}

export async function PUT(
  url: string,
  data: any,
  token?: ITokenModel
): Promise<any> {
  try {
    if (token) checkRefresh(token);
    const headers: any = {
      "Content-Type": "application/json",
    };

    if (token != null) {
      headers["Authorization"] = `${token.token_type} ${token.access_token}`;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`PUT request failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("ERROR IN PUT REQUEST: ", error);
  }
}

export async function DELETE(url: string, token?: ITokenModel): Promise<any> {
  try {
    const headers: any = {};

    if (token != null) {
      headers["Authorization"] = `${token.token_type} ${token.access_token}`;
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`DELETE request failed with status: ${response.status}`);
    }

    try {
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return `Resource deleted successfully with status: ${response.status}`;
    }
  } catch (error) {
    console.error("ERROR IN DELETE REQUEST: ", error);
  }
}
