export class camelCasedKey {
  camelCasedKey(data: any) {
    if (Array.isArray(data)) {
      return data.map((item) => {
        const newItem = {};
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            const newKey = key.replace(/_([a-z])/g, (_, letter) =>
              letter.toUpperCase(),
            );
            newItem[newKey] = item[key];
          }
        }
        return newItem;
      });
    } else {
      const newItem = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const newKey = key.replace(/_([a-z])/g, (_, letter) =>
            letter.toUpperCase(),
          );
          newItem[newKey] = data[key];
        }
      }
      return newItem;
    }
  }
}
