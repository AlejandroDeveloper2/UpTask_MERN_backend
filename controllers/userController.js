import User from "../models/User.js"
import generateId from "../helpers/generateId.js"
import generateJWT from "../helpers/generateJWT.js"
import {registerEmail, recoverPasswordEmail} from "../helpers/email.js"

const registerUser = async(req, res) => {
    //Check if there's a duplicate user
    const {email} =req.body
    const userExists=await User.findOne({email})

    if(userExists){
        const error=new Error('User already exists')
        return res.status(400).json({msg:error.message})
    }
    
    try{
        const user=new User(req.body)
        user.token=generateId()
        await user.save()
        //send confirm email  
        registerEmail({
            email:user.email,
            name:user.name,
            token:user.token
        })
        res.json({
            msg:'User created successfully, Check out your email for confirming your account!'
        })
    }catch(error){
        console.log(error);
    }   
}
const authenticateUser=async(req, res) => {
    const {email, password}=req.body
    console.log(req.body)
    //Check if the user already exists
    const user=await User.findOne({email})
    if(!user){
        const error=new Error("User does not exist")
        return res.status(404).json({msg: error.message})
    }
    //Check if the user is already confirmed
    if(!user.confirmed){
        const error=new Error("Your account has not been confirmed")
        return res.status(404).json({msg: error.message})
    }
    //Check password
    if(await user.checkPassword(password)){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateJWT(user._id)
        })
    }else{
        const error=new Error("Password is incorrect")
        return res.status(404).json({msg: error.message})
    }
}
const confirmUser=async (req, res) => {
    const {token}=req.params
    const userConfirm=await User.findOne({token})
    if(!userConfirm){
        const error=new Error("Token is not valid")
        return res.status(404).json({msg: error.message})
    }
    try{
        userConfirm.confirmed=true
        userConfirm.token=''
        await userConfirm.save()
        res.json({msg:'User confirmed successfully'})
    }catch(error){
        console.log(error)
    }
}
const recoverPassword = async(req, res) => {
    const {email}=req.body
    const user=await User.findOne({email})
    if(!user){
        const error=new Error("User does not exist")
        return res.status(404).json({msg: error.message})
    }
    try {
        user.token=generateId()
        await user.save()
        //send email to recover user password
        recoverPasswordEmail({
            email:user.email,
            name:user.name,
            token:user.token
        })
        res.json({msg: "We have sent you an email with the instructions"})
    } catch (error) {
        console.log(error)
    }
}
const checkToken = async(req, res) => {
    const {token}=req.params
    const validToken=await User.findOne({token})
    if(validToken){
       res.json({msg:'Token is valid'})
    }else{
        const error=new Error("Invalid token")
        return res.status(404).json({msg: error.message})
    }
}
const createNewPassword = async(req, res) => {
    const {token}=req.params
    const {password}=req.body
    const user=await User.findOne({token})
    if(user){
       user.password=password
       user.token=''
        try {
            await user.save()
            res.json({msg: 'Password has been modified successfully!'})
        } catch (error) {
            console.log(error)
        }
       
    }else{
        const error=new Error("Invalid token")
        return res.status(404).json({msg: error.message})
    }
}
const getUserProfile=async(req, res)=>{
    const {user}=req
    res.json(user)
}
export{
    registerUser,
    authenticateUser,
    confirmUser,
    recoverPassword,
    checkToken,
    createNewPassword,
    getUserProfile
}