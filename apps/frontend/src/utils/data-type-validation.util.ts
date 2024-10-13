export class DataTypeValidationUtil {
  private constructor() {}

  public static isUuid(testString: string): boolean {
    const regex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

    return regex.test(testString);
  }
}
