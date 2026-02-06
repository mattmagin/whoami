const toCamelCase = (str: string) =>
    str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

export const transformResponse = (object: Record<string, any>) => {
    return Object.fromEntries(
        Object.entries(object).map(([key, value]) => [toCamelCase(key), value])
    );
};