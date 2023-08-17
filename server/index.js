const express = require("express")
const cors = require("cors")
const app = express()
const PORT = 8080;
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config()
const session = require('express-session')


app.use(cors({
  origin: 'https://megamarketlive.vercel.app',
  methods: ['GET','POST'],
  credentials: true
}))

app.use(express.json())
app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  SameSite: 'none'
}));





const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    //console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
  }
}
connectDB().catch(err => console.log(err));

const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  color: { type: String },
  size: { type: String },
  details: Object,
  image: { type: String, required: true },
  images: { type: [String], required: true },
}, { timestamps: true });

const cartSchema = new Schema({
  items: { type: [Object], required: true, default: [] },
  userId: { type: String, default: 1 }
}, { timestamps: true });

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  username: String,
  addresses: { type: [Object], default: [] },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

const orderSchema = new Schema({
  items: [Object],
  shipping_charges: Number,
  discount_in_percent: Number,
  shipping_address: Object,
  total_items: Number,
  total_cost: Number,
}, { timestamps: true })

const Product = new mongoose.model('Product', productSchema);
const Cart = new mongoose.model('Cart', cartSchema);
const User = new mongoose.model('User', userSchema);
const Order = new mongoose.model('Order', orderSchema);




app.post('/login',(req,res)=>{
  //console.log(req.body.user);
  User.findOne({username: req.body.user.username, password:req.body.user.password}).populate('orders').then(result=>{
      if(result){
          console.log(result)
          req.session.user = result;
          console.log("req",req.session.user)
          res.send({status:true, user:result});
      } else{
          res.status(404).send({status:false});
      }
      
  })
})

app.get('/logout',(req,res)=>{

 req.session.user = null;
 res.send({status: true})
})

app.post('/signup',(req,res)=>{


  let user = new User({...req.body.user, email: req.body.user.username, orders:[]})
 
  User.findOne({username:req.body.user.username}).then(result=>{
      if(result){
          res.status(404).send({status:false});
      } else {
          user.save().then(usr=>{
              req.session.user = usr;
              res.send({status:true, user:usr});
          })
      }
  });


})
//session commented
// app.get('/user',(req,res)=>{
// if(req.session.user){
//     User.findOne({username: req.session.user.username}).populate('orders').then(result=>{
//           req.session.user = result;
//           res.send({status:true, user:result});
//   })
// } else {
//   console.log("getuser", req.session)
//   res.send({status:false});
// }
// });
// you will need to call this for order updates. Not the best solution. you can make and Order GET API also.
app.get('/user',(req,res)=>{
    User.findOne({}).populate('orders').then(result=>{
    // req.session.user = result;
    res.send({status:true, user:result});
    })
  
  });


app.get('/product', (req, res) => {
  Product.find({}).then((result) => {
    res.send(result)
  })
})

app.get('/cart', (req, res) => {
  // let userId = req.session.user._id;
  console.log(req.session.user._id)
  let userId = "64db7d182c52632013fe54f7"
    // console.log("userId", userId)
  // console.log("req.session",req.session)
  // console.log("req.session._id",req.session.user._id)


  Cart.findOne({ userId: userId }).then((result) => {
    if (result) {
      res.send(result)
    }
    else {
      res.send({ userId: "64db7d182c52632013fe54f7", items: [] })
    }
  })
})

app.post('/cart', (req, res) => {

   // This will be solved by Sessions
  // const userId = req.session.user._id;
  console.log(req.session.user._id)
  let userId = "64db7d182c52632013fe54f7";

  
  const item = req.body.item;
  if (!item.quantity) {
    item.quantity = 1;
  }
  Cart.findOne({ userId: userId }).then(result => {
    if (result) {
      console.log("if(result) : ", result)
      const itemIndex = result.items.findIndex(it => it._id == item._id);
      if (itemIndex >= 0) {
        result.items.splice(itemIndex, 1, item);
      } else {
        result.items.push(item);
      }
      result.save().then(cart => {
        res.send(cart);
      })
    } else {
      let cart = new Cart();
      cart.userId = userId;
      cart.items = [item];
      cart.save().then(cart => {
        console.log("cart.save : ",cart)
        res.send(cart);
      })
    }


  })
});

app.post('/removeItem', (req, res) => {

  // const userId = req.session.user._id;
  const userId = "64db7d182c52632013fe54f7";
  const item = req.body.item;
  Cart.findOne({ userId: userId }).then(result => {

    const itemIndex = result.items.findIndex(it => it._id == item._id);
    result.items.splice(itemIndex, 1);
    result.save().then(cart => {
      res.send(cart)
    })
  });

});

app.post('/emptyCart', (req, res) => {
  // const userId = req.session.user._id;
  const userId = "64db7d182c52632013fe54f7";
  Cart.findOne({ userId: userId }).then(result => {
    result.items = [];
    result.save().then(cart => {
      res.send(cart)
    })
  });

});

// app.get('/user', (req, res) => {
//   User.findOne({}).populate('orders').then(result => {
//     res.send(result);
//   })

// });

app.post('/updateUserAddress', (req, res) => {
  const userId = "64db7d182c52632013fe54f7";
  const address = req.body.address;
  User.findOne({ _id: userId }).then((user) => {
    user.addresses.push(address);
    user.save().then(user => {
      res.send(address);
    })
  }).catch((err) => {
    //console.log("UpdateAddressError", err);
  })
})

app.post('/order', (req, res) => {
  const userId = "64db7d182c52632013fe54f7"
  
  const order = req.body.order;

  let newOrder = new Order(order);
  newOrder.save().then(savedOrder => {
    User.findOne({ _id: userId }).then((user) => {
      user.orders.push(savedOrder._id);
      user.save().then(user => {
        res.send(savedOrder);
      })
    })
  })

})


// app.get('/createProduct', (req, res) => {
//   let product = new Product({

//     name: 'Nikon Xl54',
//     price: 1200.75,
//     category: 'Camera',
//     rating: 3,
//     color: 'black',
//     size: '',
//     details: {
//       product: "",
//       warranty: "",
//       merchant: ""
//     },
//     image: 'product-4-square',
//     images: ['product-4', 'product-4-2', 'product-4-3']

//   })
//   product.save().then((success) => {
//     res.send(success)
//   }).catch(err => {
//     res.error(err)
//   })

// })



// app.get('/createUser', (req, res) => {

//   let user = new User({
//     name: 'John',
//     email: 'john@example.com',
//     addresses: [],
//     orders: []
//   })

//   user.save().then((success) => {
//     res.send(success)
//   }).catch(err => {
//     res.error(err)
//   })

// })


app.listen(PORT, () => {
  //console.log(`Connected to Port ${PORT}`);
})


