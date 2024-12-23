import {
  CreateParams,
  CreateResult,
  DataProvider,
  fetchUtils,
  Identifier,
  RaRecord,
} from "react-admin";

const API_URL = "http://localhost:3030"; // Define your API URL here

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { field, order } = params.sort || { field: "", order: "" };
    const { pagination } = params;
    if (!pagination) {
      throw new Error("Pagination is required");
    }
    const { page, perPage } = pagination;
    // const response = await fetchUtils.fetchJson(
    //   `${API_URL}/${resource}?page=${page}&limit=${perPage}&sort=${field}&order=${order}`,
    // );

    const response = fetch(
      `${API_URL}/${resource}?page=${page}&limit=${perPage}&sort=${field}&order=${order}`,
    );
    // console.log(await response);
    return {
      data: response,
      // total: parseInt(response.headers.get("X-Total-Count") || "0", 10),
      total: 10,
    };
  },
  getOne: async (resource, params) => {
    const response = await fetchUtils.fetchJson(
      `${API_URL}/${resource}/${params.id}`,
    );
    return {
      data: response.json,
    };
  },
  getMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const response = await fetchUtils.fetchJson(
      `${API_URL}/${resource}?${fetchUtils.queryParameters(query)}`,
    );
    return {
      data: response.json,
    };
  },
  getManyReference: async (resource, params) => {
    const { field, order } = params.sort || { field: "", order: "" };
    const { page, perPage } = params.pagination;
    const query = {
      ...fetchUtils.flattenObject(params.filter),
      [params.target]: params.id,
      _sort: field,
      _order: order,
      _page: page,
      _limit: perPage,
    };
    const response = await fetchUtils.fetchJson(
      `${API_URL}/${resource}?${fetchUtils.queryParameters(query)}`,
    );
    return {
      data: response.json,
      total: parseInt(response.headers.get("X-Total-Count") || "0", 10),
    };
  },
  // create: async (resource, params) => {
  //   const response = await fetchUtils.fetchJson(`${API_URL}/${resource}`, {
  //     method: "POST",
  //     body: JSON.stringify(params.data),
  //   });
  //   return {
  //     data: { ...params.data, id: response.json.id },
  //   };
  // },
  update: async (resource, params) => {
    const response = await fetchUtils.fetchJson(
      `${API_URL}/${resource}/${params.id}`,
      {
        method: "PUT",
        body: JSON.stringify(params.data),
      },
    );
    return {
      data: response.json,
    };
  },
  updateMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) =>
        fetchUtils.fetchJson(`${API_URL}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        }),
      ),
    );
    return {
      data: responses.map((response) => response.json.id),
    };
  },
  delete: async (resource, params) => {
    const response = await fetchUtils.fetchJson(
      `${API_URL}/${resource}/${params.id}`,
      {
        method: "DELETE",
      },
    );
    return {
      data: response.json,
    };
  },
  deleteMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) =>
        fetchUtils.fetchJson(`${API_URL}/${resource}/${id}`, {
          method: "DELETE",
        }),
      ),
    );
    return {
      data: responses.map((response) => response.json.id),
    };
  },
  create: function <
    RecordType extends Omit<RaRecord, "id"> = any,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier },
  >(
    resource: string,
    params: CreateParams,
  ): Promise<CreateResult<ResultRecordType>> {
    throw new Error("Function not implemented.");
  },
};
