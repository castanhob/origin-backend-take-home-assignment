type IDataMock<T> = {
  [P in keyof T]?: IDataMock<T[P]>
}

export const dataMock = <T>(instance: IDataMock<T> = {}): T => {
  return instance as any
}
