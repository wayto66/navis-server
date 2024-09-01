export interface ServerResponse<T> {
  items: Array<T>;

  error?: boolean;
  message: string;
}
