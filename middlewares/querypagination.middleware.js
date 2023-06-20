import { model } from "mongoose";

function querypagination(model, dependentModel=null, mid = null) {
  return async (req, res, next) => {
      try {
          //res.json(req.modelName, model);
            //res.status(500).json({ message: req.user });
            //console.log( mid); 
            if(dependentModel && mid){
              //console.log(mid);
              //const obj = { [mid] : 'value'};
              const modelId = req.params[mid];
              console.log(modelId);
               const modelDataDependent = await dependentModel.findOne({_id:modelId});
               //console.log(modelDataDependent);
               if(!modelDataDependent){
                  res.status(400).json({ status:false, message: 'No data found'});
               }
            }
            let reqQuery = {...req.query};
            let removeFields = ['limit', 'sort', 'page', 'select'];
            removeFields.forEach( param =>  delete reqQuery[param]);

            let queryStr;
            queryStr = JSON.stringify( reqQuery );
            
            console.log(queryStr);
            queryStr = queryStr.replace(/\b(eq|ne|in|lt|lte|gt|gte)\b/g, match => `$${match}`);
            
            queryStr = JSON.parse(queryStr);
            console.log(queryStr);
            
            let appendFilterQuery = model.find(queryStr);
            
            if(req.query.select){
              const selectData = req.query.select.split(',').join(' ');
              appendFilterQuery.select(selectData );
            }

            if(req.query.sort){
              const sortData = req.query.sort.split(',').join(' ');
              appendFilterQuery.sort(sortData );
          }else {
            appendFilterQuery.select('-createdAt');
          }
          //pagination
          const page = req.query.page ||  1;
          const limit = parseInt(req.query.limit) || 10;
          const skipData = (page-1)*limit;
          //console.log(skipData, page, limit)
          appendFilterQuery = appendFilterQuery.skip(skipData).limit(limit);
          const results = await appendFilterQuery;
          
          const totalData = await appendFilterQuery.countDocuments();
          
          
          console.log(results.length);
          if(results.length > 0){
              req.paginatedResult = {
                  status:true,
                  //total: total,
                  data: results
              };
              next();
          } else {
            req.paginatedResult = {status:false, message: 'No course found'};
            next();
          }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  }
}

/* const querypagination = ( modelName ) => async (req, res, next) => {
  res.json(req.modelName, model);
} */

export default querypagination