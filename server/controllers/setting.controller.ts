import {Setting} from '../models'
import extend from 'lodash/extend'

const create = async (req, res) => {
  if(!req.profile && !req.profile._id) return res.status('400').json({ error: "Could not create settings"})
  try {
    let setting = new Setting(req.body); 
    setting.user= req.profile
    await setting.save()
    return res.status(200).json({setting})
  } catch (err) {
    console.log(err)
    return res.status('400').json({
      error: "Could not create setting"
    })
  }
}
const read = async (req, res) => {
  if(!req.profile && !req.profile._id) return res.status('400').json({ error: "Could not read setting"})
  try {
    let setting = await Setting.findOne({user: req.profile._id}).exec()
    return res.status(200).json({setting})
  } catch (err) {
    console.log(err)
    return res.status('400').json({
      error: "Could not update setting"
    })
  }
}

const update = async (req, res) => {
  if(!req.profile && !req.profile._id) return res.status('400').json({ error: "Could not update setting"})
  try {
    let setting = await Setting.findOne({user: req.profile._id}).exec()
    setting = extend(setting, req.body)
    setting.updated = Date.now()
    await setting.save()
    return res.status(200).json({setting})
  } catch (err) {
    console.log(err)
    return res.status('400').json({
      error: "Could not update setting"
    })
  }
}

const setting = async (req, res, next) => {
  /**Append setting for next handler*/
  if(req.jwt && req.jwt.user){
    try{ 
      let setting = await Setting.findOne({user: req.jwt.user._id})
      req.setting = setting 
    }catch(e){
      console.log(e)
    }
  }
  next()
}

export default {create, read, update, setting}