export const slugify = (str: string) =>
{
    const split = str.toLowerCase().replace('?', '').split(' ');
    return split.join('-');
};