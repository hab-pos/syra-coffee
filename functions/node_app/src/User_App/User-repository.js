const { UserModel, UserCreditCards} = require('./User-model')

class UserRepository {
    async addUser(first_name, last_name, birth_day,email,password,default_store){
        let count = await UserModel.count()
        var color = Math.floor(0x1000000 * (Math.random() + count)).toString(16);
        var colorString = '#' + ('000000' + color).slice(-6);
        let unique_ref = "SY_" + Math.floor((Math.random() * 1000) + count).toString();
        return UserModel.create({
            first_name: first_name,
            last_name: last_name,
            birth_day: birth_day,
            email: email,
            password : password,
            default_store : default_store,
            color : colorString,
            user_reference_number : unique_ref
        });
    }

    loginStatus(id,status){
        return UserModel.update({is_logged_in : status},{where : {_id : id}})
    }
    deleteUser(id){
        return UserModel.update({is_deleted : true},{where : {_id : id}})
    }
    updateUser(request){
        return UserModel.update(request,{where : {_id : request.id}})
    }

    addCard(data){
        return UserCreditCards.create({
            user_id : data.user_id,
            holder_name : data.holder_name,
            card_number : data.card_number,
            tokenUser : data.tokenUser,
            idUser : data.idUser,
            cardHash : data.cardHash,
            expiry_date : data.expiry_date,
            is_default : data.is_default || false
        })
    }
    getCard(user_id){
        return user_id ?  UserCreditCards.findAll({where : {user_id : user_id, is_deleted : false}}) : UserCreditCards.findAll({where : {is_deleted : false}})
    }
    updateCard(request){
        console.log(request)
        return UserCreditCards.update(request,{where : {_id : request._id}})
    }
    deleteCard(id){
        return UserCreditCards.update({is_deleted : true},{where : {_id : id}})
    }
}
module.exports.userRepository = new UserRepository()