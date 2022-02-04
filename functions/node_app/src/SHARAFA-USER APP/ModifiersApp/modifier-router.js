const express = require('express')
const {addModifier,getModifiers,getActiveModifiers,updateModifiers,updateOnlineStatus,deleteModifiers} = require('./modifer-controller')
const router = express.Router()

router.post('/add_modifier',addModifier)
router.post('/get_modifer',getModifiers)
router.post('/update_modifier',updateModifiers)
router.post('/update_online_status' , updateOnlineStatus)
router.post('/delete_modifers',deleteModifiers)
router.post('/get_active_modifiers',getActiveModifiers)

module.exports.ModifiersRouter = router