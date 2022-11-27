const signupModal=require("./modal/signup-modal");
const bcrypt =require("bcryptjs")
const checkExistinguser = async (email) => {
    let existinguser = false
    await signupModal.find({ email: email }).then((userData) => {
        if (userData.length) {
            existinguser = true
        }
    })
    return existinguser
};
const generatePasswordHash = (password) => {
    
    const salt = 10;
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(salt).then((saltHash) => {
         
            bcrypt.hash(password, saltHash).then((passwordHash) => {
               
                resolve(passwordHash)
            })
        })


    });


}

const toSorting = (e) =>{
    var sortOrder = 1;
    if(e[0] === "-") {
        sortOrder = -1;
        e = e.substr(1);
    }
    return function (a,b) {
        var result = (a[e] < b[e]) ? -1 : (a[e] > b[e]) ? 1 : 0;
        return result * sortOrder;
    }}
module.exports = { checkExistinguser, generatePasswordHash,toSorting }