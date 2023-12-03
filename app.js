const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const Todolist = require('./models/todolist.js')
const User = require('./models/user')
const AppError = require('./AppError')
const cookie = require('cookie-parser')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const session = require('express-session')
const brcypt = require('bcrypt')
const mongoose = require('mongoose')
const url = "mongodb+srv://prashantmishra:prashant123@cluster0.iabfukt.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url)

app = express();
app.use(session({
    secret: 'thisisnotagoodsecret',
    resave: true,
    saveUninitialized: false
}))


app.use(flash())
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser('Eflsdoksa123'))
app.use(methodOverride('_method'))
app.get('/new', (req, res)=>{
    if(!req.session.user_id){
        req.flash('info', 'you need to Login first')
       return res.redirect('/login')
    }
    res.render('add')
})
app.get('/show', async (req, res)=>{
    if(!req.session.user_id){
        req.flash('info', 'you need to Login first')
        return res.redirect('/login')
    }
    const todolisttasks = await Todolist.find({}).populate('taskby')
    console.log(todolisttasks)
    res.render('show', {todolisttasks, messages: req.flash('Name'), currentuser : req.session.user_id})
})

// app.get('/admin', (req, res)=>{
//     throw new AppError('You are not Admin', 403)
// })
app.post('/new', async (req, res)=>{
      if(!req.session.user_id){
        req.flash('info', 'you need to Login first')
        return res.redirect('/login')
    }
    const {taskname , taskdays, taskdescription, taskdate} = req.body
    const newtask = new Todolist({
        taskname : taskname,
        taskdays : taskdays,
        taskdescription : taskdescription,
        taskdate : taskdate,
        taskby : req.session.user_id
    });
    await newtask.save();
    req.flash('success', 'Added Your Task')
    res.redirect('/')
})
app.delete('/new/:id', async (req,res)=>{
    await Todolist.findByIdAndDelete(req.params.id)
    res.redirect('/show')
})

app.get('/newpath', (req,res) =>{
    res.cookie('fruit', 'grape', {signed : true})
    res.send("Sent you a Signed Cookie")
})


// Showing tasks to only Registered User

app.get('/register', (req, res)=>{
    res.render('register')
})

app.post('/register', async(req, res)=>{
    const {personname, username, password} = req.body;
    const hash = await brcypt.hash(password, 12)
    const newuser = new User({
        personname,
        username,
        password : hash
    })
    await newuser.save();
    res.redirect('/')
})

app.get('/login', (req,res)=>{
    res.render('login',{messages: req.flash('info')})
})  

app.post('/signout', (req,res)=>{
    req.session.destroy();
    res.render('home', {messages: 'Logged Out Successfully'})
})

app.post('/login', async (req,res)=>{
    const {username, password} = req.body;
    const finduser = await User.findOne({username})
    const uservalid = await brcypt.compare(password, finduser.password)
    if(uservalid){
        req.session.user_id  = finduser._id
        req.flash('Name', finduser.personname)
       return res.redirect('/show')
    }
    else{
        res.send('Not a Valid User')
    }
})

app.use((err, req, res, next)=>{
    const {status = 500, message = 'Something went Wrong'} = err;
    res.status(status).send(message)
})


app.use('/', (req, res)=>{
    if (req.session.user_id){
        return res.render('home', {set : 'Add New Task'})
    }
    res.render('home', {set : 'Add'})
})
app.listen(3000, ()=>{
    console.log(`Listening on 3000`)
})
