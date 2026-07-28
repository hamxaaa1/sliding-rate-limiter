export interface Store {

  get(
    key: string
  ): Promise<number[]>;


  add(
    key: string,
    timestamp: number
  ): Promise<void>;


  removeExpired(
    key: string,
    before: number
  ): Promise<void>;


  count(
    key: string
  ): Promise<number>;


  delete(
    key: string
  ): Promise<void>;

}