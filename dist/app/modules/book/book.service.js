"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const book_constants_1 = require("./book.constants");
const insertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const data = new Date(payload === null || payload === void 0 ? void 0 : payload.publicationDate);
    payload.publicationDate = data;
    // console.log('insert Data', payload)
    const result = yield prisma_1.default.book.create({
        data: payload,
        // include: { category: true },
    });
    return result;
});
const getAllBooks = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { size, page, skip } = paginationHelpers_1.paginationsHelpers.calculatePagination(options);
    const { search, category, minPrice, maxPrice } = filters, filterData = __rest(filters, ["search", "category", "minPrice", "maxPrice"]);
    const andConditions = [];
    if (search) {
        andConditions.push({
            OR: book_constants_1.booksSearchableFields.map(field => ({
                [field]: {
                    contains: search,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (category) {
        andConditions.push({
            OR: book_constants_1.booksSearchableFields.map(field => ({
                [field]: {
                    contains: category,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (minPrice !== undefined) {
        andConditions.push({
            price: {
                gte: parseFloat(minPrice),
            },
        });
    }
    if (maxPrice !== undefined) {
        andConditions.push({
            price: {
                lte: parseFloat(maxPrice),
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (book_constants_1.booksSearchableFields.includes(key)) {
                    return {
                        [book_constants_1.booksRelationalFieldsMapper[key]]: {
                            id: filterData[key],
                        },
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key],
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.book.findMany({
        include: {
            category: true,
        },
        where: whereConditions,
        skip,
        take: size,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                publicationDate: 'desc',
            },
    });
    const total = yield prisma_1.default.book.count({
        where: whereConditions,
    });
    const totalPage = Math.ceil(total / size);
    return {
        meta: {
            total,
            page,
            size,
            totalPage,
        },
        data: result,
    };
});
const getBookBuCategoryId = (id, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { size, page } = paginationHelpers_1.paginationsHelpers.calculatePagination(options);
    const result = yield prisma_1.default.category.findMany({
        where: {
            id: id,
        },
        select: {
            books: true,
        },
    });
    const total = result[0].books.length;
    const totalPage = Math.ceil(total / size);
    const finalResult = {
        meta: {
            total,
            page,
            size,
            totalPage,
        },
        data: Array.isArray(result) ? result[0].books : result,
    };
    return finalResult;
});
const getSingleBookById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateSingleBookById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteSingleBookById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.bookService = {
    insertIntoDB,
    getAllBooks,
    getBookBuCategoryId,
    getSingleBookById,
    updateSingleBookById,
    deleteSingleBookById,
};
