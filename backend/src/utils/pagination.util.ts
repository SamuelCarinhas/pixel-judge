export type PaginationParams = {
    page?: number;
}

export type PaginationResult<T> = {
    data: T[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export async function paginate<T>(
    model: any,
    { page = 1 }: PaginationParams,
    queryOptions: object = {}
): Promise<PaginationResult<T>> {
    const limit = 20;
    const skip = (page - 1) * limit;

    const data = await model.findMany({
        skip,
        take: limit,
        ...queryOptions
    })

    const totalCount = await model.count({
        where: queryOptions.hasOwnProperty('where') ? queryOptions['where' as never] : {},
    })

    return {
        data,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
    }
}

export default {
    paginate
}
