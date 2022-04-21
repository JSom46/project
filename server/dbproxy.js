
class dbproxy
{
    constructor(dbconnection) {
        this.dbcon = dbconnection
    }

    run(sql, ...params) {
        this.dbcon.run(sql, ...params, (err) => {
            console.debug(err)
            // throw err
        })
    }

    get(sql, ...args) {
        let callback = undefined
        if (args[args.length - 1] instanceof Function) {
            callback = args.pop()
        }
        this.dbcon.get(sql, ...args, (err, result) => {
            if (!err) {
                callback?.(result)
            } else {
                console.debug(err)
                // throw err
            }
        })
    }

    all(sql, ...args) {
        let callback = undefined
        if (args[args.length - 1] instanceof Function) {
            callback = args.pop()
        }
        this.dbcon.all(sql, ...args, (err, result) => {
            if (!err) {
                callback?.(result)
            } else {
                console.debug(err)
                // throw err
            }
        })
    }

    each(sql, ...args) {
        let callback = undefined
        if (args[args.length - 1] instanceof Function) {
            callback = args.pop()
        }
        this.dbcon.all(sql, ...args, (err, result) => {
            if (!err) {
                callback?.(result)
            } else {
                console.debug(err)
            }
        })
    }
}
