const { baristaRepository } = require('./Barista-repository')
const { encryptPassword, comparePassword } = require('../../Utils/Common/crypto')
const { time_slot_hour, constants } = require('../../Utils/constants')
const { barista_logged_in } = require('./Barista-emitter')
const moment = require("moment");
const { ClockinModel } = require('./Barista-model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var _ = require('lodash');

module.exports.addBarista = async function (req, res, _) {
    const { barista_name, password, created_by } = req.body
    await encryptPassword(password, function (err, hash) {
        if (err) {
            return res.api(500, "Internel server Error!,Could not generate password hash", null, false)
        }
        baristaRepository.addBarista(barista_name, hash, created_by)
            .then(barista => {
                return res.api(200, 'Barista created successfullty', { barista }, true)
            })
    })
}

module.exports.barista_login = async function (req, res, _) {
    const { barista_name, password, device_id, type } = req.body

    let branch_info = await baristaRepository.get_branchInfo(device_id || "")
    if (branch_info) {
        var result = await baristaRepository.compare_password(barista_name, password)
        if (result.barista_details != null) {
            var current_hour = moment().utc().tz(constants.TIME_ZONE).format('H');
            var current_time_slot = "";
            var time_slot = time_slot_hour()
            for (let i = 0; i < time_slot.length; ++i) {
                var current_pair = time_slot[i].split('-');
                if (parseInt(current_pair[0]) == current_hour) {
                    current_time_slot = i;
                }
            }
            let isActive = type == "logged_in" ? true : false
            let info = await baristaRepository.getClockinRecord(branch_info._id, result.barista_details._id)
            if (info && type == "checked_in") {
                res.api(422, "Already checked in", null, false)
            }
            else {
                if (info) {
                    return result.status == true ? barista_logged_in(result.barista_details, res) : res.api(422, "invalid password", null, false)
                } else {
                    if(result.status == true){
                        baristaRepository.addClockin(result.barista_details._id, branch_info._id, current_time_slot, type, isActive)
                       return barista_logged_in(result.barista_details, res)
                    }
                    else{
                        return res.api(422, "invalid password", null, false)
                    }
                }
            }
        } else {
            return res.api(404, "Not registered barista, please contact admin", null, false)
        }
    }
    else {
        return res.api(404, "IPAD not registered to any Branch", null, false)
    }

}

module.exports.get_barista_details_by_id = async function (req, res) {
    const { id } = req.body
    await baristaRepository.get_barista_details({ "_id": id }).then(barista_details => {
        return barista_details ? res.api(200, "barista detail retrived successfully", { barista_details }, true) : res.api(200, "No Barista found", { barista_details }, false)
    })
}
module.exports.get_report = async function (req, res) {
    const { dates, branch } = req.body
    let data = await baristaRepository.getReport(dates, branch)
    let dataJson = JSON.parse(JSON.stringify(data))
    let grouped = _.groupBy(dataJson, function (data, key) {
        return data.barista_id
    })
    let response = []
    for (const [key, value] of Object.entries(grouped)) {
        let item = Object()
        let branch_array = []
        let datesArray = []
        var totalHours = 0
        var totalMins = 0
        var totDiffMins = 0
        var totDiffHours = 0
        value.forEach((element, index) => {
            if (!branch_array.includes(element.branch_id)) {
                branch_array.push(element.branch_id)
            }

            if (!datesArray.includes(moment(element.createdAt).format("DD MM YYYY"))) {
                datesArray.push(moment(element.createdAt).format("DD MM YYYY"))
            }

            let m1 = moment(element.loginTime)
            let m2 = moment(element.logoutTime || new Date())
            var m3 = m2.diff(m1, 'minutes');
            var m4 = m2.diff(m1, 'hours', true);
            totDiffMins += Math.floor((m3 % 1440))
            console.log(m4, "diff", element.barista_id)
        });

        totalHours = Math.floor(totDiffMins / 60);
        totalMins = Math.floor(totDiffMins % 60);

        let data = await baristaRepository.getBarista_transaction(dates, branch, key)

        item.barista_id = key
        item.color = value[0].barista_info.color
        item.barista_name = value[0].barista_info.barista_name
        item.no_of_branches_worked = branch_array.length
        item.no_days_worked = datesArray.length
        item.hours = totalHours + "h " + totalMins + "m"
        item.txn_data = data[0]

        response.push(item)
    }
    return res.api(200, "barista detail retrived successfully", response, true)
}

function getTimeAsNumber(time, login_time = "") {
    let time_to_cast = ""

    if (time == null) {
        if (Number(moment(login_time).format("DD")) < Number(moment().format("DD"))) {
            console.log(time, Number(moment(login_time).format("DD")), Number(moment().format("DD")), "gurutcesas")
            time_to_cast = moment(login_time)
        }
        else {
            time_to_cast = moment()
        }
    }
    else {
        time_to_cast = moment(time)
    }
    let hr = Number(time_to_cast.format("HH")) + 2
    let mins = Math.round((Number(time_to_cast.format('mm')) / 60 * 10))
    return Number(hr + "." + mins)
}
module.exports.get_report_graph = async function (req, res) {
    const { dates, branch } = req.body
    let data = await baristaRepository.getReportGraph(dates, branch)
    let dataJson = JSON.parse(JSON.stringify(data))
    let grouped = _.groupBy(dataJson, function (data, key) {
        return data.barista_info.barista_name
    })

    let array = Object.values(grouped)
    let branches = []
    let colors = []
    let response = []
    let baristas = []
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        let item = []
        if (element.length > 1) {
            if (dates == null || dates.end == null || dates.start == dates.end) {
                let from = 25
                let to = 0
                let logInTime = ""
                let logoutTime = ""
                for (let index_j = 0; index_j < element.length; index_j++) {
                    const element_item = element[index_j];
                    if (from > getTimeAsNumber(element_item.loginTime)) {
                        from = getTimeAsNumber(element_item.loginTime)
                        logInTime = element_item.loginTime
                    }

                    if (to < element_item.logoutTime != null ? getTimeAsNumber(element_item.logoutTime) : getTimeAsNumber(element_item.logoutTime, element_item.loginTime)) {
                        to = element_item.logoutTime != null ? getTimeAsNumber(element_item.logoutTime) : getTimeAsNumber(element_item.logoutTime, element_item.loginTime)
                        logoutTime = element_item.logoutTime != null ? moment(element_item.logoutTime) : Number(moment(element_item.loginTime).format("DD")) < Number(moment().format("DD")) ? moment(element_item.loginTime) : moment()
                    }
                }
                let record = { login_date_graph: moment(logInTime).unix(), logout_date_graph: logoutTime.unix(), branch: element[0].branch_info.branch_name, from_hr: moment(logInTime).utc().tz('Europe/Madrid').format("hh:mm A"), to_hr: logoutTime.utc().tz('Europe/Madrid').format("hh:mm A"), date: logoutTime.utc().tz('Europe/Madrid').format("DD/MM/YYYY"), from: from, to: to, barista: element[0].barista_info.barista_name, color: element[0].barista_info.color, barista_id: element[0].barista_info._id }
                colors.push(element[0].barista_info.color)
                baristas.push(element[0].barista_info._id)
                if (branches.indexOf(element[0].branch_info.branch_name) < 0) {
                    branches.push(element[0].branch_info.branch_name)
                }
                item.push(record)
                response.push(item)
            } else {
                for (let index_j = 0; index_j < element.length; index_j++) {
                    const element_item = element[index_j];
                    let from = getTimeAsNumber(element_item.loginTime)
                    let to = element_item.logoutTime != null ? getTimeAsNumber(element_item.logoutTime) : getTimeAsNumber(element_item.logoutTime, element_item.loginTime)
                    toHrDate = element_item.logoutTime != null ? moment(element_item.logoutTime) : moment()
                    let record = { login_date_graph: moment(element_item.loginTime).unix(), logout_date_graph: moment(element_item.logoutTime == null ? element_item.loginTime : element_item.logoutTime).unix(), branch: element_item.branch_info.branch_name, from_hr: moment(element_item.loginTime).utc().tz('Europe/Madrid').format("hh:mm A"), to_hr: toHrDate.utc().tz('Europe/Madrid').format("hh:mm A"), date: toHrDate.utc().tz('Europe/Madrid').format("DD/MM/YYYY"), from: from, to: to, barista: element_item.barista_info.barista_name, color: element_item.barista_info.color, barista_id: element[0].barista_info._id }
                    colors.push(element_item.barista_info.color)
                    baristas.push(element_item.barista_info._id)
                    if (branches.indexOf(element_item.branch_info.branch_name) < 0) {
                        branches.push(element_item.branch_info.branch_name)
                    }
                    response.push([record])
                }
            }

        }
        else {
            for (let index_j = 0; index_j < element.length; index_j++) {
                const element_item = element[index_j];
                let from = getTimeAsNumber(element_item.loginTime)
                let to = element_item.logoutTime != null ? getTimeAsNumber(element_item.logoutTime) : getTimeAsNumber(element_item.logoutTime, element_item.loginTime)
                toHrDate = element_item.logoutTime != null ? moment(element_item.logoutTime) : moment()
                let record = { login_date_graph: moment(element_item.loginTime).unix(), logout_date_graph: moment(element_item.logoutTime).unix(), branch: element_item.branch_info.branch_name, from_hr: moment(element_item.loginTime).utc().tz('Europe/Madrid').format("hh:mm A"), to_hr: toHrDate.utc().tz('Europe/Madrid').format("hh:mm A"), date: toHrDate.utc().tz('Europe/Madrid').format("DD/MM/YYYY"), from: from, to: to, barista: element_item.barista_info.barista_name, color: element_item.barista_info.color, barista_id: element[0].barista_info._id }
                colors.push(element_item.barista_info.color)
                baristas.push(element_item.barista_info._id)
                if (branches.indexOf(element_item.branch_info.branch_name) < 0) {
                    branches.push(element_item.branch_info.branch_name)
                }
                item.push(record)
            }
            response.push(item)
        }
    }


    return res.api(200, "barista detail retrived successfully", { response, branches, colors, baristas }, true)
}

module.exports.get_all_barista = async function (req, res) {
    const { id } = req.body
    await baristaRepository.get_all_baristas().then(barista_details => {
        return res.api(200, "barista detail retrived successfully", { barista_details }, true)
    })
}
module.exports.update_test = async function (req, res) {
    const { id } = req.body
    let data = await ClockinModel.findAll()
    data.forEach(element => {
        ClockinModel.update({ loginTime: element.createdAt, logoutTime: element.updatedAt }, {
            where: {
                _id: element._id
            }
        })
    });
    return res.api(200, "barista detail retrived successfully", { data }, true)

}

module.exports.logout = async function (req, res, _) {
    const { id, device_id } = req.body
    //id => barista id
    let branch_info = await baristaRepository.get_branchInfo(device_id || "")
    if (branch_info) {
        await baristaRepository.clock_out_all(branch_info._id)

        await baristaRepository.update_login_status(id, false).then(update_data => {
            var current_hour = moment().utc().tz(constants.TIME_ZONE).format('H');
            var current_time_slot = "";
            var time_slot = time_slot_hour()
            for (let i = 0; i < time_slot.length; ++i) {
                var current_pair = time_slot[i].split('-');
                if (parseInt(current_pair[0]) == current_hour) {
                    current_time_slot = i;
                }
            }
            return (update_data[0] > 0) ? res.api(200, "logged out successfully", { is_logged_in: false }, true) : res.api(200, "No Barista found", null, false)
        })
    }
    else {
        return res.api(404, "IPAD not registered to any Branch", null, false)
    }

}
module.exports.delete_barista = async function (req, res, _) {
    const { id } = req.body
    await baristaRepository.delete_barista(id).then(deleteData => {
        return (deleteData > 0) ? res.api(200, "deleted successfully", null, true) : res.api(200, "No barista found", null, false)
    })
}
module.exports.update_barista_password = async function (req, res, _) {
    const { id, old_password, password } = req.body
    let barista_details = await baristaRepository.get_barista_details({ "_id": id })

    if (old_password != null && old_password != undefined && password != null && password != undefined) {
        if (barista_details) {
            await comparePassword(old_password, barista_details.password).then(authStatus => {
                return authStatus ? encryptPassword(password, (err, hash) => {
                    baristaRepository.update_password(id, hash).then(_ => {
                        res.api(200, "password updated successfully", { barista_details }, true)
                    })
                }) : res.api(200, "Incorrect password, please contact admin!", null, false)
            })
        }
        else {
            return res.api(200, "No barista found", { barista_details }, false)
        }
    }
    else {
        return res.api(200, "Please check your params", { barista_details }, false)
    }
}


module.exports.update_barista_password = async function (req, res, _) {
    const { _id, user_name, password } = req.body
    let barista_details = await baristaRepository.get_barista_details({ "_id": _id })

    if (barista_details) {
        if (user_name != "" && password != "" && user_name != null && password != null && user_name != undefined && password != undefined) {
            encryptPassword(password, (err, hash) => {
                baristaRepository.update_user_and_pwd(_id, user_name, hash).then(_ => {
                    res.api(200, "barista details updated successfully", { barista_details }, true)
                })
            })
        }
        else if (password != null && password != undefined && password != "") {
            encryptPassword(password, (err, hash) => {
                baristaRepository.update_password(_id, hash).then(_ => {
                    res.api(200, "password updated successfully", { barista_details }, true)
                })
            })
        }
        else {
            if (user_name != "") {
                baristaRepository.update_user_name(_id, user_name).then(_ => {
                    res.api(200, "barista name updated successfully", { barista_details }, true)
                })
            }
            else {
                res.api(20, "barista name could not be empty", null, false)
            }
        }
    }
    else {
        return res.api(200, "No barista found", { barista_details }, false)
    }
}

module.exports.clockout = async function (req, res, _) {
    const { device_id, active_barista_id, barista_id } = req.body
    if (active_barista_id == barista_id) {
        return res.api(200, "Could not clock out, pls make sure that he is not a active barista", null, false)
    }
    else {
        let branch_info = await baristaRepository.get_branchInfo(device_id || "")
        if (branch_info) {
            await baristaRepository.clock_out(branch_info._id, barista_id)
            return res.api(200, "Clocked out successfully", null, true)
        }
        else {
            return res.api(404, "IPAD not registered to any Branch", null, false)
        }

    }
}
module.exports.switch_user = async function (req, res, _) {
    const { device_id, old_barista_id, new_barista_id, clockoutBarista } = req.body
    let branch_info = await baristaRepository.get_branchInfo(device_id || "")
    if (branch_info) {
        if (clockoutBarista == true) {
            await baristaRepository.clock_out(branch_info._id, old_barista_id)
        }
        baristaRepository.switch_user(branch_info._id, old_barista_id, false)
        await baristaRepository.switch_user(branch_info._id, new_barista_id, true)

        return res.api(200, "switched successfully", null, true)
    }
    else {
        return res.api(404, "IPAD not registered to any Branch", null, false)
    }
}
module.exports.get_branch_logged_in_users = async function (req, res, _) {
    const { device_id } = req.body
    console.log(req.body)
    let branch_info = await baristaRepository.get_branchInfo(device_id || "")
    if (branch_info) {
        let user_list = await baristaRepository.getClockin(branch_info._id)
        console.log(JSON.parse(JSON.stringify(user_list)))
        return res.api(200, "list retrived", user_list, true)
    }
    else {
        return res.api(404, "IPAD not registered to any Branch", null, false)
    }
}
