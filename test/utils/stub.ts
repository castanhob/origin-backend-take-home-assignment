export const stub = <T extends any>(): T => {
  const typeAssertion = <any>{}

  for (const prop in typeAssertion) {
    if (typeAssertion.hasOwnProperty(prop)) {
      typeAssertion[prop] = undefined
    }
  }

  return typeAssertion
}
