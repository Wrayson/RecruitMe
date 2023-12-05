const express = require('express');
const cors = require('cors')
const path = require('path');
const docx = require("docxtemplater");
const pizzip = require("pizzip");
const bcrypt = require("bcrypt")


const libre = require('libreoffice-convert');
const fs = require('fs');

const frontApp = express();
const apiApp = express();

const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'recruitme'
})
connection.connect()

apiApp.use(express.json())
apiApp.use(cors());
/*
// Handling CORS
apiApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",
        "http://localhost:4200");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/

async function getCurrentTime(){
    const sessTS = new Date()
    return Math.ceil(sessTS.getTime()/1000)
}

async function generateHash(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,-_/';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

async function getContractType(recruitment){
    //FIXME Make Code more compact
    //If Own Bills
    if (+recruitment['ownBills'] === 1){
        //If Own bills and from outside switzerland
        if(+recruitment['foreignBills'] === 1){
            //FIXME Freelancer also possible. Or is Freelancer = Bill, just in English?
            return {result: true, type: 'extern', filename: 'Bill_Zug.docx'}
            //If Own bills from switzerland
        }else if(+recruitment['foreignBills'] === 0){
            //If own bills from switzerland with MwSt
            if (+recruitment['VAT'] === 0){
                return {result: true, type: 'extern', filename: 'Bill_MwSt_Zur.docx'}
                //if own bills from switzerland without MwSt
            }else if(+recruitment['VAT'] === 0){
                return {result: true, type: 'extern', filename: 'Bill_Zug.docx'}
                //If MwSt Selection unlike 1 or 0
            }else {
                return {result: false, code: 1, msg: 'Invalid VAT selection.'}
            }
            //if MwSt Selection unlike 1 or 0
        }else {
            return {result: false, code: 1, msg: 'Invalid foreignBill selection.'}
        }
        //If Contract
        //FIXME Provision logic
    }else if (+recruitment['ownBills'] === 0){
        //If Contract and wage paid
        if (+recruitment['wage'] === 1){
            //If Contract, wage paid and wage under or exactly 148200 CHF per year
            if (recruitment['salary'] > 148200){
                return {result: true, type: 'intern', filename: 'Contract_Zug.docx'}
                //If contract, wage paid and wage over 148200 CHF per year
            }else{
                return {result: true, type: 'intern', filename: 'Contract_GAV_Zug.docx'}
            }
            //If contract, wage not paid
        }else if (+recruitment['wage'] === 0){
            //If contract, wage not paid but provision
            if (+recruitment['provision'] === 1){
                return {result: true, type: 'intern', filename: 'Provision.docx'}
            } else {
                //if provision unlike 1
                return {result: false}
            }
            // if wage unlike 1 or 0
        }else {
            return {result: false, code: 1, msg: 'Invalid wage selection.'}
        }
    }else{
        return {result: false, code: 1, msg: 'Invalid ownBills selection.'}
    }
}

async function validateSession(authEnc){
    let auth = atob(authEnc).split(';')

    //If Authorization Token is older than 8 hours in seconds (60*60*8)
    if (auth[2] > (await getCurrentTime() + 28800)){
        return {result: false, code: 1, msg: 'Authorization Token expired.'}
    }

    const result = await sendQuery(
        "SELECT * FROM recruitme.session WHERE user_id = ? AND hash = ? AND iat = ?",
        [auth[0], auth[1], auth[2]]
    )
    //Check if there was a row found
    if (result[1].length === 1)  return {result: true}

    return {result: false, code: 1, msg: 'Invalid Authorization Token.'}
}

async function undoChanges(level, ids){
    //FIXME re-work undochanges
    let result;

}


async function sendQuery(query, payload) {
    //All Queries are made over .query instead of .prepare and .execute, because .execute does not return errors or IDs.
    //If there's a good workaround, the code can easily be changed to prepared statements.
    let result, sql;
    try {
        sql = mysql.format(query, payload)
        result = await connection.promise().query(sql)
        return [1, result[0]]
    } catch (e) {
        console.log(e)
        return [0, e]
    }
}

apiApp.post('/api/v1/createUser', async function(req, res){
    //TODO CreateUser

    /* How to generate BCRYPT-Password
    *     await bcrypt
        .genSalt(15)
        .then(salt => {
            console.log('Salt: ', salt)
            return bcrypt.hash(req.headers['password'], salt)
        })
        .then(hash => {
            pwHash = hash
            console.log('Hashyy: ', hash)
        })
        .catch(err => console.error(err.message))
        * */
})

apiApp.post('/api/v1/archiveUser', async function(req, res){
    //TODO DeleteUser
})

apiApp.post('/api/v1/updateUser', async function(req, res){
    //TODO UpdateUser
})

apiApp.get('/api/v1/getSession', async function(req, res){
    //If ID and hash not in header
    if (req.headers['user_id'] === undefined || req.headers['hash'] === undefined || req.headers['iat'] === undefined){
        res.json({
            status: {
                code: 1,
                msg: 'UserID, Hash or IAT is missing in request header.'
            },
        })
        return
    }

    const result = await sendQuery(
        "SELECT * FROM recruitme.session WHERE user_id = ? AND hash = ? AND iat = ?",
        [req.headers['user_id'], req.headers['hash'], req.headers['iat']]
    )

    //Check if there is more or less than 1 row
    if (result[1].length !== 1){
        res.json({
            status: {
                code: 1,
                msg: 'No Session found.'
            },
        })
        return
    }

    //Check if iat is expired
    if (result[1][0]['iat'] < req.headers['iat']){
        res.json({
            status: {
                code: 1,
                msg: 'Session expired.'
            },
        })
        return
    }

    const user = await sendQuery(
        "SELECT user_id, username, role_id, firstName, lastName FROM recruitme.user WHERE user_id = ?",
        [req.headers['user_id']]
    )

    res.json({
        status: {
            code: 0,
            msg: 'Success'
        },
        data: {
            user: user[1][0]
        }
    })
})

apiApp.get('/api/v1/getUser', async function (req, res){
    //TODO Get Users by exact Username and SHA-256 Hash
    //TODO Error handling if empty
    //If Username and password not in header
    /*if (req.headers['username'] === undefined || req.headers['password'] === undefined){
        res.json({
            status: {
                code: 1,
                msg: 'Username or password missing in request header.'
            },
        })
        return
    }*/

    //Get Password from Database matching to supplied User
    const result = await sendQuery(
        "SELECT user_id, username, role_id, firstName, lastName, password FROM recruitme.user WHERE username = ?",
        [req.headers['username']]
    )
    //If SQL Command completed
    if (result[0]){
        //If no matching row found
        if (result[1].length === 0){
            res.json({
                status: {
                    code: 1,
                    msg: 'Benutzername und Passwort stimmen nicht überrein.'
                },
            })
            return
        }
        //If SQL Command error
    }else{
        res.json({
            status: {
                code: 1,
                msg: 'Error while validating Login.'
            },
        })
        return
    }

    if (await bcrypt.compare(req.headers['password'], result[1][0]['password'])){
        console.log("Password matches.. granting access to requested user.")
        const sessHash = await generateHash(32)
        const sessTS = new Date()
        await sendQuery(
            "REPLACE INTO recruitme.session (user_id, hash, iat) VALUES (?, ?, ?)",
            [result[1][0]['user_id'], sessHash, Math.ceil(sessTS.getTime()/1000)]
        )
        //remove password from row
        delete result[1][0]['password']
        //add Sessionhash and iat to row
        result[1][0]['hash'] = sessHash
        result[1][0]['iat'] = Math.ceil(sessTS.getTime()/1000)
        res.json({
            status: {
                code: 0,
                msg: 'Success'
            },
            data: {
                user: result[1][0]
            }
        })
    }else{
        res.json({
            status: {
                code: 1,
                msg: 'Benutzername und Passwort stimmen nicht überrein.'
            },
        })
    }
})

apiApp.post('/api/v1/setCandidateArchived', async function (req, res){
    console.log("Got a Request for /api/v1/archiveCandidate")
    //TODO Error Handling
    if (req.body.archived !== undefined && req.body.personals_id !== undefined){
        const result = await sendQuery(
            "UPDATE recruitme.personals SET archived = ? WHERE personals_id = ?",
            [req.body.archived, req.body.personals_id]
        )
    }
    res.json({
        status: {
            code: 0,
            msg: "Successfully toggled Archive on Candidate."
        }
    })

})

apiApp.get('/api/v1/getContract', async function (r, res){
    console.log(r.headers['personals_id'])
    console.log("Got a Request for /api/v1/getContract")
    let result, contractType;
    let data = {};

    //Get Personals
    result = await sendQuery(
        "SELECT * FROM recruitme.personals WHERE personals_id = ?",
        [r.headers['personals_id']]
    )
    if (!result[0] || result[1][0] === undefined) {
        //If SQL Error
        res.json({
            status: {
                code: 1,
                msg: 'SQL-Error while fetching Personals'
            },
        })
        return;
    }

    data.personals = result[1][0]

    //Get Address
    result = await sendQuery(
        "SELECT * FROM recruitme.address WHERE address_id = ?",
        [data.personals['address_id']]
    )
    if (!result[0] || result[1][0] === undefined) {
        //If SQL Error
        res.json({
            status: {
                code: 1,
                msg: 'SQL-Error while fetching Personals'
            },
        })
        return;
    }

    data.personals.address = result[1][0]

    //Get Recruitment Data
    result = await sendQuery(
        "SELECT * from recruitme.recruitment WHERE recruitment_id = ?",
        [data['personals']['recruitment_id']]
    )
    if (!result[0] || result[1][0] === undefined) {
        //If SQL Error
        res.json({
            status: {
                code: 1,
                msg: 'SQL-Error while fetching Recruitmentdata.'
            },
        })
        return;
    }
    data.recruitment = result[1][0]


    contractType = await getContractType(data.recruitment)
    if (!contractType.result){
        res.json({
            status: {
                code: 1,
                msg: 'Could not fetch contractType.'
            }
        })
    }

    if (contractType.type === 'intern'){
        result = await sendQuery(
            "SELECT * FROM recruitme.employee WHERE personals_id = ?",
            [data.personals['personals_id']]
        )
        data['intern'] = result[1][0]
        data.recruitment['salary'] = data.intern.salary
        //Re-Read ContractType to get GAV or Non-GAV.
        contractType = await getContractType(data.recruitment)

        //
        result = await sendQuery()
    }else if(contractType.type === 'extern'){
        //TODO ADD Extern functionality
    }

    //Generate Contract from Template
    const content = fs.readFileSync(
        path.resolve(__dirname, "./src/templates/"+contractType.filename),
        "binary"
    );
    const zip = new pizzip(content);
    const doc = new docx(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    console.log(data)

    //TODO Render Document by Object
    doc.render(data)
    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });

    //Randomly generate PDF name
    const tempFname = Math.random().toString(36).slice(2) + ".pdf"
    const tempFolder = __dirname + '/src/generated/'
    //Export rendered docx buffer to PDF
    await libre.convert(buf, ".pdf", undefined, async (err, done) => {
        if (err) {
            console.log('Error:' + err);
        }
        //Save PDF Buffer to PDF File
        fs.writeFileSync(tempFolder + tempFname, done);
        //Send PDF-Contract Back
        await res.download(tempFolder+tempFname, null, function (){
            //Delete PDF-Contract
            fs.unlink(tempFolder+tempFname,err => {
                if (err){
                    console.log(err)
                }else{
                    console.log(tempFname + " file deleted.")
                }
            })
        })
    });
})

apiApp.get('/api/v1/getCountries', async function(req, res){
    //TODO: Get Countries from DB and return as array
})

apiApp.get('/api/v1/getPeriods', async function(req, res){
    //TODO: Get Countries from DB and return as array
})

apiApp.get('/api/v1/getCandidates', async function(r, res){
    console.log("Got a Request for /api/v1/getCandidates")
    let sqlCmd = ''
    if (r.headers['archived'] === 'false') sqlCmd += 'WHERE archived = 0 '
    if (r.headers['upperlimit'] !== undefined) sqlCmd += 'LIMIT '+ +r.headers['upperlimit']
    else{sqlCmd += 'LIMIT 50'}

    //TODO Error Handling, Recruitment
    let result = await sendQuery('SELECT personals_id, firstName, lastName, DATE_FORMAT(birthDate,\'%d.%m.%Y\') AS birthDate, archived FROM recruitme.personals ' + sqlCmd)
    if (result[1].length === 0){
        res.json("No Rows found")
    }else{
        res.json(result)
    }
})

apiApp.post('/api/v1/createCandidate',  async function (r, res) {
    let recruitmentId, addressId, personalsId;
    let result, msg;
    let req = r

    console.log("Got a Request to create a candidate:")

    if (atob(req.headers['authorization']) === undefined){
            res.json({
                status: {
                    code: 1,
                    msg: 'Authorization-Token is missing in the HTTP-Header'
                },
            })
        return
    }

    const checkSess = await validateSession(req.headers['authorization'])
    if (!checkSess['result']){
        res.json({
            status: {
                code: checkSess['code'],
                msg: checkSess['msg']
            },
        })
        return
    }


    /*TODO 01.12.2023
    * ADD ERROR HANDLING TO RECRUITMENT
    * ADD/EDIT ALL OTHER ADDS
    * */
    //Add Recruitment
    result = await sendQuery(
        'INSERT INTO recruitme.recruitment (ownBills, foreignBills, vat, wage, provision) VALUES (?, ?, ?, ?, ?)',
        [req.body.recruitment['ownBills'], req.body.recruitment['foreignBills'], req.body.recruitment['VAT'],
            req.body.recruitment['wage'], req.body.recruitment['provision']]
    )
    recruitmentId = result[1].insertId
    console.log(" +Recruitment ID: " + recruitmentId)
    //TODO Error Handling



    //Add Address
    result = await sendQuery(
        "INSERT INTO recruitme.address (street, number, zip, city, country) VALUES (?, ?, ?, ?, ?)",
        [req.body.personal.address['street'], req.body.personal.address['number'], req.body.personal.address['zip'],
            req.body.personal.address['city'], req.body.personal.address['country']]
    )
    if (result[0]){
        addressId = result[1].insertId
        console.log(" +Personals Address ID: " + addressId)
    }else{
        //If SQL Error, no undoing needed
        res.json({status: "error", code: 1, message: "SQL Error while injecting Personal Address.",
            endpoint: "Create a Candidate"})
        return;
    }

    //Insert Personals
    result = await sendQuery(
        "INSERT INTO recruitme.personals " +
        "(firstName, lastName, gender, birthDate, nationality, permit_id, email, phone, ahv, marital_id, children, address_id, " +
        "createDate, modifyDate, archived, recruitment_id) "  +
        "SELECT ?, ?, ?, ?, ?, permit_id, ?, ?, ?, marital_id, ?, ?, NOW(), NOW(), 0, ? " +
        "FROM permit, marital " +
        "WHERE permit.name = ? " +
        "AND marital.name = ?",
        [req.body.personal.firstName, req.body.personal.lastName, req.body.personal.gender, req.body.personal.birthDate, req.body.personal.nationality,
            req.body.personal.email, req.body.personal.phoneNumber, req.body.personal.ahvNumber, req.body.personal.children, addressId,
            recruitmentId, req.body.personal.permit, req.body.personal.civilStatus]
    )
    if (result[0]){
        personalsId = result[1].insertId
        console.log(" +Personals ID: " + personalsId)
    }else{
        msg = await undoChanges(6, [addressId])
        res.json({status: "error", code: 1, message: msg,
            endpoint: "Create a Candidate"})
        return;
    }

    //Insert Partner
    //TODO Nationality and Permit
    if (req.body.personal.civilStatus === "Verheiratet" && Object.keys(req.body.family.partner).length > 1){
        result = await sendQuery(
            "INSERT INTO recruitme.partner (personals_id, firstName, lastName, birthDate, nationality, permit_id) SELECT ?, ?, ?, ?, ?, permit_id FROM permit WHERE permit.name = '-'",
            [personalsId, req.body.family.partner.firstName, req.body.family.partner.lastName,
                req.body.family.partner.birthDate, 'Schweiz', '-']
        )
        if (result[0]){
            console.log(" +Partner Added: ")
        }else{
            msg = await undoChanges(5, [addressId, personalsId])
            res.json({status: "error", code: 1, message: msg,
                endpoint: "Create a Candidate"})
            return;
        }
    }

    //Insert Child
    if (r.body.personal.children > 0 && Object.keys(req.body.family.children).length > 1){
        for (let i = 0; i < Object.keys(req.body.family.children).length; i++){
            result = await sendQuery(
                "INSERT INTO recruitme.child SELECT ?, ?, ?, ?",
                [personalsId, req.body.family.children['child'+(i+1)].firstName,
                    req.body.family.children['child'+(i+1)].lastName, req.body.family.children['child'+(i+1)].birthDate])
        }
        if (result[0]){
            console.log(" +Children Added")
        }else{
            msg = await undoChanges(4, [addressId, personalsId])
            res.json({status: "error", code: 1, message: msg,
                endpoint: "Create a Candidate"})
            return;
        }
    }

    req.body.recruitment['salary'] = req.body.intern.salary
    const contractType = await getContractType(req.body.recruitment)

    if (!contractType.result){
        res.json({
            status: {
                code: 1,
                msg: 'Invalid Recruitment Data. Could not resolve a valid path.'
            },
        })
    }
    if (contractType.type === 'intern'){
        let probationId, noticeId;

        //Not Ideal, to be improved in the future
        //Get Period ID
        result = await sendQuery(
            "SELECT period_id FROM recruitme.period WHERE value = ?",
            [req.body.intern.probationPeriod]
        )

        if(result[0]){
            probationId = result[1][0].period_id
            console.log(" +Probation ID: " + probationId)
        }else{
            console.log("Could not fetch Probation ID.")
            return;
        }

        //Get Notice ID
        result = await sendQuery(
            "SELECT period_id FROM recruitme.period WHERE value = ?",
            [req.body.intern.noticePeriod]
        )
        if(result[0]){
            noticeId = result[1][0].period_id
            console.log(" +Notice ID: " + noticeId)
        }else{
            console.log("Could not fetch Notice ID.")
            return;
        }


        //Create Employee
        result = await sendQuery(
            "INSERT INTO recruitme.employee " +
            "SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()",
            [personalsId, req.body.intern.companyName, req.body.intern.jobDesc, req.body.intern.salary,
                req.body.intern.workload, probationId, noticeId, req.body.intern.startDate, req.body.intern.endDate,
                req.body.intern.jobType]
        )
        if (!result[0]){
            msg = await undoChanges(3, [addressId, personalsId])
            res.json({
                status: {
                    code: 1,
                    msg: 'SQL-Error injecting Employee.'
                },
            })
            return;
        }
        res.json({
            status: {
                code: 0,
                msg: 'Successfully Created candidate.'
            },
        })
    }else if(contractType.type === 'extern'){
        let workAddress, companyId, billId;
        //Create address
        result = await sendQuery(
            "INSERT INTO recruitme.address (street, number, zip, city, country) VALUES (?, ?, ?, ?, ?)",
            [req.body.extern.address.street, req.body.extern.address.number,
                req.body.extern.address.zip, req.body.extern.address.city, req.body.extern.address.country]
        )
        if (result[0]){
            workAddress = result[1].insertId
            console.log(" +Company Address ID: " + workAddress)
        }else{
            msg = await undoChanges(3, [addressId, personalsId])
            res.json({
                status: {
                    code: 1,
                    msg: 'SQL-Error injecting Company Address.'
                },
            })
            return;
        }

        //Create Company
        result = await sendQuery(
            "INSERT INTO recruitme.company " +
            "SELECT null, ?, ?, ?, ?",
            [workAddress, r.body.extern.companyName, r.body.extern.cheNum, r.body.extern.companyType]
        )
        if(result[0]){
            companyId = result[1].insertId
            console.log(" +Company ID: " + companyId)
        }else{
            msg = await undoChanges(2, [addressId, personalsId, workAddress])
            res.json({
                status: {
                    code: 1,
                    msg: 'Successfully created Bill'
                },
            })
            return;
        }

        //Create Bill
        result = await sendQuery(
            "INSERT INTO recruitme.bill " +
            "SELECT ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()",
            [null, personalsId, companyId, req.body.extern.contact.firstName, req.body.extern.contact.lastName,
                req.body.extern.contact.phoneNumber, req.body.extern.contact.email]
        )
        if (result[0]){
            billId = result[1].insertId
            console.log(" +Bill ID: " + billId)
        }else{
            msg = await undoChanges(1, [addressId, personalsId, workAddress, companyId])
            res.json({
                status: {
                    code: 1,
                    msg: 'SQL-Error injecting Bill.'
                },
            })
            return;
        }
        res.json({
            status: {
                code: 0,
                msg: 'Successfully created Employee.'
            },
        })
    }else{
        //TODO Undochanges
        res.json({
            status: {
                code: 1,
                msg: 'Invalid Recruitment Data.'
            },
        })
    }
})

apiApp.listen(3001, () => {
    console.log('[RecruitMe - API-Express]: listening on port 3001');
})


frontApp.use(cors());
frontApp.use(express.static(path.resolve('./src/recruit-me')));
frontApp.get('*', (req, res) => {
    res.sendFile(path.resolve('./src/recruit-me/index.html'))
});
frontApp.listen(3000, () => {
    console.log(`[RecruitMe - Front-Express]: listening on port 3000`)
});