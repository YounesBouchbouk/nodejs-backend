class ApiFeature{
    constructor(query , qurystr){
        this.query =query
        this.qurystr = qurystr
    }

    filter(){
        const excludeparams = ['page' , 'sort' , 'limite' , 'fields']
        const queryObj = {...this.qurystr}

        //delete page , sort , limite from queryobj
        excludeparams.forEach(el => delete queryObj[el])

        // switch from JSON obj to Js obj to change gte or gt ... to $gte , $gt
        let qurystr =JSON.stringify(queryObj)

        //change it with this line of code !!!!!!!
         qurystr =  qurystr.replace(/\b(gte|gt|lt|lte)\b/g , match => `$${match}` )
        
        //now w send JSON obj in query to have result 
         this.query.find(JSON.parse(qurystr))

         return this;

    }
    sort(){
        if(this.qurystr.sort) {
            //if http://.../sort=price,duration by price thene duration ...
            let sortmultiple = this.qurystr.sort.split(',').join(' ')

            // console.log(sortmultiple);  sortmultiple = 'price duration'
            this.query = this.query.sort(sortmultiple)   

        }else {
            //sort by default par date
            this.query = this.query.sort('-CreatedAt')   

        }
        return this;

    }

    limitefields(){
        if(this.qurystr.fields){
            //link https://..../fields=name,price,duration
            let strlimite = this.qurystr.fields.split(',').join(' ')
            // console.log(strlimite); strlimite = name price duration
            this.query = this.query.select(strlimite)   // select('duration , price , name ...')
        }
        return this;

    }

    paningtation(){
        if(this.qurystr.limite){

            const page = this.qurystr.page * 1 || 1 
            const limite = this.qurystr.limite *1 || 1
            // console.log(page , limite);
    
            const skipe = (page - 1 ) * limite;
            // console.log(skipe);
    
            this.query = this.query.skip(skipe).limit(limite)
    
        }
        return this

    }

}

module.exports = ApiFeature