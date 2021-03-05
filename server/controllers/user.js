const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req,res, next) =>{
    const db = req.app.get('db')
    const { username, password, profile_pic } = req.body

    const result = await db.user.find_user_by_username([username])
    const existingUser = result[0]
    if (existingUser){
      res.status(409).send('Username already in use')
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const registeredUser = await db.user.create_user([username, hash, profile_pic])

    const user = registeredUser[0]
    console.log(registeredUser[0])
    console.log(username, password)

    req.session.user = {
      id: user.id,
      username: user.username,
      profile_pic: `https://robohash.org/${user.username}.png`
    }

    console.log(req.session.user)

    return res.status(201).send(req.session.user)
  },
  login: async (req, res, next) =>{
    const db = req.app.get('db')
    const {username, password} = req.body

    const existingUser = await db.user.find_user_by_username([username])
    const user = existingUser[0]

    if(!user){
      res.status(401).send('User does not exist.')
    }
    
    console.log(user.password)

    const isAuthenticated = bcrypt.compareSync(password, user.password)
    if(!isAuthenticated){
      res.status(403).send('Incorrect credentials.')
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      profile_pic: user.profile_pic
    }
    return res.send(req.session.user)
  },
  logout: (req,res) => {
    req.session.destroy()

    return res.sendStatus(200)
  },
  getUser: (req,res) => {
    if(req.session.user){
      return res.status(200).send(req.session.user)
    }else{
      return res.sendStatus(404)
    }
  }
  

}