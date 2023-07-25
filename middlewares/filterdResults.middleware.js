export const filteredResults = (Model) => async (req, res, next) => {
        const reqQuery = {...req.query};
        //field to remove
        const removeFields = ['select', 'sort', 'limit', 'page'];
        removeFields.forEach( param => delete reqQuery[param]);
        //console.log('reqQuery',reqQuery);
       
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(eq|gt|gte|lt|lte|ne|in)\b/ig, match => `$${match}`);
        //console.log(queryStr);
        //console.log(req.query, queryStr);
        let query;
        query = JSON.parse(queryStr);
        //console.log(query);return;
        let appendFilterQuery = Model.find(query);

        if(req.query.select){
            const selectFields = req.query.select.split(",").join(" ");
            //console.log('fields', fields);

            appendFilterQuery.select(selectFields);
        }

        if(req.query.sort){
            const sortFields = req.query.sort.split(",").join(" ");
            //console.log('fields', fields);

            appendFilterQuery.sort(sortFields);
        } else {
            appendFilterQuery.sort('-createdAt');
        }
        const total = await Model.countDocuments(query); 
        //pagination
        //console.log(typeof req.query.page);
        const page = parseInt(req.query.page) || 1; //Number
        const limit = parseInt(req.query.limit) || 10; //Number
        const skipData = (page - 1) * limit;
        //const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        appendFilterQuery = appendFilterQuery.skip(skipData).limit(limit);

        const models = await appendFilterQuery;
        //console.log(models)
        //const total = await Model.countDocuments();  
        const pagination = {};
        //ther is no next page in last page
        if(endIndex < total){
                pagination.next = {
                    page:page+1,
                    limit
                };
        }
        //ther is no previous page in page 1
        if(skipData > 0){
            pagination.prev = {
                page:page-1,
                limit
            };
        }
        //console.log(models.length);
        if (models.length > 0){
            res.filteredResults = {
                success: true,
                data: models,
                pagination,
                total
            };
            next();                        
        }else{            
           return res.status(404).json({
                success: false,
                message: `No ${Model.collection.collectionName} found`,
            })
        }
}