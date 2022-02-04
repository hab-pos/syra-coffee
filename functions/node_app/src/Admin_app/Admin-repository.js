const { AdminModel } = require('./Admin-model')
const { comparePassword } = require('../../Utils/Common/crypto');
const { hasAlpha } = require('jimp');
class AdminRepository {
    addAdmin(name, email, message, password) {
        return AdminModel.create({
            user_name: name,
            email_id: email,
            admin_recipt_message: message,
            password: password
        });
    }

    get_admin_details(query) {
        console.log(query);
        return AdminModel.findOne({ where: query })
    }

    update_login_status(user_id, status) {
        return AdminModel.update({ is_logged_in: status }, {
            where:
            {
                _id: user_id
            }
        })
    }

    update_password(id, hash) {
        return AdminModel.update({ password : hash}, {
            where: {
                _id : id
            }
        })
    }

    update_user_name(id,user_name) {
        return AdminModel.update({ user_name : user_name,email_id : user_name}, {
            where: {
                _id : id
            }
        })
    }

    update_user_name_and_pwd(id,user_name,hash){
        return AdminModel.update({ user_name : user_name,email_id : user_name,password : hash}, {
            where: {
                _id : id
            }
        })
    }

    update_admin_messages(id, admin_recipt_message){
        return AdminModel.update({ admin_recipt_message : admin_recipt_message}, {
            where: {
                _id : id
            }
        })
    }

    delete_admin(_id) {
        return AdminModel.destroy({ where: { "_id": _id } })
    }

    isUniqueEmail(email){
        return AdminModel.findOne({where : {"email_id" : email}})
    }

    isUniqueName(name){
        return AdminModel.findOne({where : {"user_name" : name}})
    }

    async compare_password(email_id, password){
        var admin_details = await this.get_admin_details({"email_id" : email_id})
        if(admin_details){
            return await comparePassword(password,admin_details.password).then((status) => {
                return {status,admin_details}
            })
        }else{
            return {status : false, admin_details : null}
        }
    }
}

module.exports.adminRepository = new AdminRepository()