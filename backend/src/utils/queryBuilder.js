const buildFilter = (fields = {}) => {

    const filter = {};

    Object.entries(fields).forEach(

        ([key, value]) => {

            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {

                filter[key] = value;

            }

        }

    );

    return filter;

};

module.exports = {
    buildFilter
};