const { catelougeEmitter } = require("../emitters/admin-emitter");
const { catelougeRepository } = require("./catelouge-repository");

const addCatelougeMiddelware = () => {
    catelougeEmitter.on('insertd.catelouge', function (data) {

        console.log(data.data.catelouge, "inside");
        data.data.ids.forEach(element => {
            catelougeRepository.delete_Relation(data.data.catelouge._id).then(() => {
                catelougeRepository.checkUniquenessinMiddleware(element, data.data.catelouge._id).then((res) => {
                    if (res.length == 0) {
                        catelougeRepository.insert_middelware(element, data.data.catelouge._id).then(() => {
                            console.log("finished")
                        })
                    }
                })
            })
        });
    })
}

module.exports.addCatelougeMiddelware = addCatelougeMiddelware