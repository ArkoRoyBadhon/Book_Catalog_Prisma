export const booksFilterableFields: string[] = [
  'search',
  'category',
  'minPrice',
  'maxPrice',
]

export const booksSearchableFields: string[] = [
  'title',
  'categoryId',
  'author',
  'genre',
]

export const booksSearchablePriceFields: string[] = ['price']

export const booksRrelationalfields: string[] = ['categoryId']
export const booksRelationalFieldsMapper: { [key: string]: string } = {
  categoryId: 'category',
}
