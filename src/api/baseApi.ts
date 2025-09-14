import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import swal, { SweetAlertIcon } from "sweetalert2";
import to from "await-to-js";

const config: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  baseURL: "/api",
};

export class ApiResult<T> {
  error: AxiosError | null;
  errorMessage: string;
  errorCode: number | null = null;
  data: T | null;

  constructor(err: Error | null, res: AxiosResponse<T> | undefined) {
    this.error = err as AxiosError;
    if (
      typeof this.error?.response?.data === "object" &&
      this.error?.response?.data !== null
    ) {
      this.errorMessage = this.error.message;
    } else this.errorMessage = this.error?.response?.data as string;
    this.data = res?.data ?? null;
    this.errorMessage = this.errorMessage || (this.data as any)?.error;
    this.errorCode = this.errorCode || (this.data as any)?.errorCode || null;
  }

  getData(showWarning: boolean = true) {
    if (this.errorMessage) {
      if (showWarning) showSwalIf(true, this.errorMessage);
      return null;
    }
    return this.data;
  }
}

function showSwalIf(
  condition: any,
  title: string,
  message?: string,
  icon: SweetAlertIcon = "error"
) {
  if (condition) {
    return swal.fire(title, message || "", icon);
  }
  return new Promise((resolve) => resolve(true));
}

export abstract class BaseApi {
  private api: AxiosInstance;
  public constructor() {
    this.api = axios.create(config);
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        if (!error.response && error.isAxiosError && error.message) {
          return { data: { error: error.message } };
        }
        return Promise.reject(error);
      }
    );

    this.api.interceptors.request.use((config) => {
      return config;
    });
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResult<T>> {
    const [axiosError, axiosResponse] = await to(this.api.get(url, config));
    return new ApiResult(axiosError, axiosResponse);
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResult<T>> {
    const [axiosError, axiosResponse] = await to(this.api.delete(url, config));
    return new ApiResult(axiosError, axiosResponse);
  }

  public async post<T>(
    url: string,
    data?: string | object,
    config?: AxiosRequestConfig
  ): Promise<ApiResult<T>> {
    const [axiosError, axiosResponse] = await to(
      this.api.post(url, data, config)
    );
    return new ApiResult(axiosError, axiosResponse);
  }

  public async postFormData<T>(
    url: string,
    data: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResult<T>> {
    const [axiosError, axiosResponse] = await to(
      this.api.post(url, data, config)
    );
    return new ApiResult(axiosError, axiosResponse);
  }

  public async put<T>(
    url: string,
    data?: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResult<T>> {
    const [axiosError, axiosResponse] = await to(
      this.api.put(url, data, config)
    );
    return new ApiResult(axiosError, axiosResponse);
  }
}
