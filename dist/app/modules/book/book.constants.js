'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.booksRelationalFieldsMapper =
  exports.booksRrelationalfields =
  exports.booksSearchablePriceFields =
  exports.booksSearchableFields =
  exports.booksFilterableFields =
    void 0
exports.booksFilterableFields = ['search', 'category', 'minPrice', 'maxPrice']
exports.booksSearchableFields = ['title', 'categoryId', 'author', 'genre']
exports.booksSearchablePriceFields = ['price']
exports.booksRrelationalfields = ['categoryId']
exports.booksRelationalFieldsMapper = {
  categoryId: 'category',
}
