export class camelCasedKey {
  camelCasedKey(data: any): any {
    if (data instanceof Date) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.camelCasedKey(item));
    } else if (data !== null && typeof data === 'object') {
      const newItem: Record<string, any> = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const newKey = key.replace(/_([a-z])/g, (_, letter) =>
            letter.toUpperCase(),
          );
          newItem[newKey] = this.camelCasedKey(data[key]); // recursive
        }
      }
      return newItem;
    } else {
      return data;
    }
  }
}
