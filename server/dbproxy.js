
class db
{
    constructor(connection) {
        this.dbcon = connection
    }

    run(sql, ...params) {
        this.dbcon.run(sql, ...params, (err) => {
            console.log(err.name + " | " + err.message)
            throw err
        })
    }

    get(sql, ...args) {
        let callback = args.pop()
        this.dbcon.get(sql, ...args, (err, result) => {
            if (err) {
                console.log(err.name + " | " + err.message)
                throw err                    
            } else {
                callback(result)
            }
        })
    }

    all(sql, ...args) {
        let callback = args.pop()
        this.dbcon.all(sql, ...args, (err, result) => {
            if (err) {
                console.log(err.name + " | " + err.message)
                throw err                    
            } else {
                callback(result)
            }
        })
    }
}
