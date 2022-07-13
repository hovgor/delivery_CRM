export class Mapper {
  public static Map<G>(
    finalClass: any | Array<{ initial: string; [key: string]: string }>,
    inputObject: G | G[],
    count?: number,
  ): typeof finalClass | Array<typeof finalClass> {
    const outObj = Array.isArray(inputObject) ? inputObject : [inputObject];
    if (!finalClass.initial) {
      finalClass = { initial: finalClass };
    }
    const result: Array<typeof finalClass.initial> = [];
    for (const object of outObj) {
      const resultInstance = new finalClass.initial();
      const resultProperties = Object.getOwnPropertyNames(resultInstance);
      for (const prop of resultProperties) {
        if (resultProperties.includes(prop)) {
          if (
            Array.isArray(object[prop]) &&
            object[prop].length &&
            typeof object[prop][0] === 'object' &&
            finalClass[prop]
          ) {
            resultInstance[prop] = Mapper.Map(finalClass[prop], object[prop]);
          } else {
            resultInstance[prop] = object[prop];
          }
        }
      }
      result.push(resultInstance);
    }
    return count !== undefined
      ? {
          count: count,
          result: Array.isArray(inputObject) ? result : result[0],
        }
      : Array.isArray(inputObject)
      ? result
      : result[0];
  }
}
