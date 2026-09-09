const getPagination = (query = {}) => {

    const page = Math.max(
        parseInt(query.page) || 1,
        1
    );

    const limit = Math.min(
        Math.max(parseInt(query.limit) || 10, 1),
        100
    );

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip
    };

};

const createPaginationResponse = ({
    data,
    total,
    page,
    limit
}) => {

    return {

        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),

        hasNextPage:
            page < Math.ceil(total / limit),

        hasPreviousPage:
            page > 1,

        data

    };

};

module.exports = {

    getPagination,

    createPaginationResponse

};