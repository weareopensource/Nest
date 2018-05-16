export interface Service<T> {
  add(entity: any): Promise<any>;
  getAll(): Promise<any>;
  get(id: number): Promise<T>;
  update(entity: any): Promise<T>;
  remove(entity: any): Promise<T>;
}