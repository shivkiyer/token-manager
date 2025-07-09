export default interface APIResponse<T> {
  data: T | null;
  message?: string;
}
