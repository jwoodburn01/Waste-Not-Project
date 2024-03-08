const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const slideshowModel = require("./models/slideshow");
const localCharitiesModel = require("./models/localCharities");
const foodModel = require("./models/food");
const homeGoodsModel = require("./models/homeGoods");
const profileModel = require("./models/profile");
const { ObjectId } = require("mongodb");
const generateToken = require("./utils/generateToken");
const messageModel = require("./models/message");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

app.use(cors()); // cors allowing external resources
app.use(express.json()); // allows for json payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // allows javascript with html
app.use(express.urlencoded({ extended: true })); // helps with form data

// the connection to mongo uses my name and password and the database name to connect to it
(async () => {
  mongoose.connect(
    "mongodb+srv://jwoodburn01:Kju1Fn2TFEMHL9ti@wastenot.feclkon.mongodb.net/WasteNot"
  );

  // this gets the slideshow data from mongo
  app.get("/getSlideshow", async (req, res) => {
    await slideshowModel
      .find()
      .then((slides) => res.json(slides))
      .catch((err) => res.json(err));
  });

  // gets local charities using the search fror queries as well
  app.get("/getLocalCharities", async (req, res) => {
    const { q } = req.query;
    const keys = ["name"];
    const search = (data) => {
      return data.filter((charities) =>
        keys.some((key) =>
          charities[key].toLowerCase().includes(q.toLowerCase())
        )
      );
    };
    await localCharitiesModel
      .find()
      .then((charities) => res.json(search(charities)))

      .catch((err) => res.json(err));
  });

  // gets the food items and lets the search bar filter it
  app.get("/getFood", async (req, res) => {
    const { q } = req.query;
    const keys = ["name"];
    const search = (data) => {
      return data.filter((food) =>
        keys.some((key) => food[key].toLowerCase().includes(q.toLowerCase()))
      );
    };
    await foodModel
      .find()
      .then((food) => res.json(search(food)))
      .catch((err) => res.json(err));
  });

  //this gets the home goods and works with the search bar
  app.get("/getHomeGoods", async (req, res) => {
    const { q } = req.query;
    const keys = ["name"];
    const search = (data) => {
      return data.filter((homeGoods) =>
        keys.some((key) =>
          homeGoods[key].toLowerCase().includes(q.toLowerCase())
        )
      );
    };
    await homeGoodsModel
      .find()
      .then((homeGoods) => res.json(search(homeGoods)))
      .catch((err) => res.json(err));
  });

  // this sends the data collected in an add new form to be sent to the food model to add it to the database.
  app.post("/addFood", async (req, res) => {
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      location: req.body.location,
      userId: req.body.userId,
      reserved: req.body.reserved,
      reservedBy: req.body.reservedBy,
      dairy: req.body.dairy,
      wheat: req.body.wheat,
      nuts: req.body.nuts,
      shellFish: req.body.shellFish,
      egg: req.body.egg,
    });

    try {
      await food.save(); // saving the item
    } catch (err) {
      console.log(err);
    }
  });

  // same as above for the home goods here
  app.post("/addHomeGoods", async (req, res) => {
    const homeGoods = new homeGoodsModel({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      location: req.body.location,
      userId: req.body.userId,
      reserved: req.body.reserved,
      reservedBy: req.body.reservedBy,
      furniture: req.body.furniture,
      kitchen: req.body.kitchen,
      lighting: req.body.lighting,
      storage: req.body.storage,
      decor: req.body.decor,
      miscellaneous: req.body.miscellaneous,
    });

    try {
      await homeGoods.save();
    } catch (err) {
      console.log(err);
    }
  });

  // this fetches the food using the id as the reference to return the correct one
  app.get("/fetchFood/:id", async (req, res) => {
    fetchid = req.params.id;
    await foodModel
      .findById(new ObjectId(fetchid))
      .then((foodItem) => res.json(foodItem))
      .catch((err) => res.json(err));
  });

  // finding a specific home good item using the id and returning it to the front end
  app.get("/fetchGoods/:id", async (req, res) => {
    fetchid = req.params.id;
    await homeGoodsModel
      .findById(new ObjectId(fetchid))
      .then((foodItem) => res.json(foodItem))
      .catch((err) => res.json(err));
  });

  // adding a profile to the database
  app.post("/addProfile", async (req, res) => {
    const userAlreadyExists = await profileModel.findOne({
      email: req.body.email,
    });

    if (userAlreadyExists) {
      res.status(400).send({ auth: false, message: "Email already in use" });
      throw new Error("Email already in use");
    } else {
      const profile = new profileModel({
        _id: req.body.id,
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type,
        pic: req.body.pic,
        token: generateToken(req.body.id), // making a new token for the session
      });

      try {
        await profile.save();
      } catch (err) {
        console.log(err);
      }
    }
  });

  // authenticting the profile when the user tried to login
  app.post("/authProfile", async (req, res) => {
    const { email, password } = req.body;
    const user = await profileModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        type: user.type,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res
        .status(400)
        .send({ auth: false, message: "Invalid Username/Password" });
      throw new Error("Invalid Email or Password");
    }
  });

  // the update profile one can take a new entry if any or the old data if no data is entered
  app.post("/updateProfile", async (req, res) => {
    id = req.body.id;

    const user = await profileModel.findById(id);

    if (user) {
      user.fName = req.body.fName || user.fName;
      user.lName = req.body.lName || user.lName;
      user.email = req.body.email || user.email;
      user.pic = req.body.pic || user.pic;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fName: updatedUser.fName,
        lName: updatedUser.lName,
        email: updatedUser.email,
        pic: updatedUser.pic,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  });

  // this finds and returns a specific profile
  app.get("/profileDetails/:id", async (req, res) => {
    try {
      const id = req.params;

      const user = await profileModel.findById(new ObjectId(id));
      res.json(user);
    } catch (error) {
      res.json(error);
    }
  });

  // this remoces the item with the matching id from the database, it 1st checks the food and if it isnt there it will go to the home goods
  app.delete("/removeItem/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const foodItem = await foodModel.findById(id);
    const homeGoodsItem = await homeGoodsModel.findById(id);
    try {
      if (foodItem) {
        await foodModel.findByIdAndRemove(id);
        res.send({ status: "OK" });
      } else if (homeGoodsItem) {
        await homeGoodsModel.findByIdAndRemove(id);
        res.send({ status: "OK" });
      } else {
        res.status(404);
        throw new Error("Item not found");
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  // this takes the data from the front end and sends it to the charity model to be added to the db
  app.post("/addCharity", async (req, res) => {
    const localCharity = new localCharitiesModel({
      name: req.body.name,
      description: req.body.description,
      link: req.body.link,
      location: req.body.location,
    });

    try {
      await localCharity.save();
    } catch (err) {
      console.log(err);
    }
  });

  // this will remove a charity based on its id
  app.delete("/removeCharity/:id", async (req, res) => {
    const id = req.params.id;

    try {
      await localCharitiesModel.findByIdAndRemove(id);
      res.send({ status: "OK" });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  // this updated an item and like the other one can take either a new value or can keep the old value. It checks both collections as well for the item
  app.post("/updateItem", async (req, res) => {
    id = req.body.id;

    const foodItem = await foodModel.findById(id);
    const homeGoodsItem = await homeGoodsModel.findById(id);
    if (foodItem) {
      foodItem.name = req.body.name || foodItem.name;
      foodItem.description = req.body.description || foodItem.description;
      foodItem.dairy = req.body.allergenList.dairy;
      foodItem.wheat = req.body.allergenList.wheat;
      foodItem.nuts = req.body.allergenList.nuts;
      foodItem.shellFish = req.body.allergenList.shellFish;
      foodItem.egg = req.body.allergenList.egg;
      foodItem.image = req.body.image || foodItem.image;
      foodItem.location = req.body.location || foodItem.location;
      foodItem.reserved = req.body.reserved || foodItem.reserved;
      foodItem.reservedBy = req.body.reservedBy || foodItem.reservedBy;

      const updatedItem = await foodItem.save();

      res.json({
        _id: updatedItem._id,
        name: updatedItem.name,
        description: updatedItem.description,
        image: updatedItem.image,
        location: updatedItem.location,
        reserved: updatedItem.reserved,
        reservedBy: updatedItem.reservedBy,
      });
    } else if (homeGoodsItem) {
      homeGoodsItem.name = req.body.name || homeGoodsItem.name;
      homeGoodsItem.description =
        req.body.description || homeGoodsItem.description;
      homeGoodsItem.image = req.body.image || homeGoodsItem.image;
      homeGoodsItem.location = req.body.location || homeGoodsItem.location;
      homeGoodsItem.reserved = req.body.reserved || homeGoodsItem.reserved;
      homeGoodsItem.reservedBy =
        req.body.reservedBy || homeGoodsItem.reservedBy;

      const updatedItem = await homeGoodsItem.save();

      res.json({
        _id: updatedItem._id,
        name: updatedItem.name,
        description: updatedItem.description,
        image: updatedItem.image,
        location: updatedItem.location,
        reserved: updatedItem.reserved,
        reservedBy: updatedItem.reservedBy,
      });
    } else {
      res.status(404);
      throw new Error("Item not found");
    }
  });

  // this adds a message to the db with the data from the front end
  app.post("/msg", async (req, res) => {
    try {
      const { from, to, message } = req.body;
      const newMessage = await messageModel.create({
        message: message,
        Chatusers: [from, to],
        Sender: from,
      });

      return res.status(200).json(newMessage);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Internal Server Error");
    }
  });

  // this gets a char based on the users who sent and recieved it, using the 2 ids as a to and from
  app.get("/get/chat/msg/:user1Id/:user2Id", async (req, res) => {
    try {
      const from = req.params.user1Id;
      const to = req.params.user2Id;

      const newMessage = await messageModel
        .find({
          Chatusers: {
            $all: [from, to],
          },
        })
        .sort({ updatedAt: 1 });

      const allMessage = newMessage.map((msg) => {
        return {
          myself: msg.Sender.toString() === from,
          message: msg.message,
        };
      });

      return res.status(200).json(allMessage);
    } catch (error) {
      return res.status(500).json("Internal Server Error");
    }
  });

  // this will return chats based on 1 of the ids
  app.get("/get/chat/msg/:userId", async (req, res) => {
    const userId = req.params.userId;
    const messages = await messageModel
      .find({
        Chatusers: userId,
      })
      .sort({ updatedAt: 1 });

    const formattedMessages = messages.map((msg) => {
      return {
        Chatusers: msg.Chatusers,
      };
    });
    res.json(formattedMessages);
  });

  // this will return all of the profiles in one list and can be searched using the name as the query
  app.get("/getAllProfiles", async (req, res) => {
    const { q } = req.query;
    const search = (data) => {
      return data.filter((profile) => {
        const name = `${profile.fName} ${profile.lName}`;
        return name.toLowerCase().includes(q.toLowerCase());
      });
    };
    await profileModel
      .find()
      .then((profile) => res.json(search(profile)))
      .catch((err) => res.json(err));
  });

  // returns all of the users
  app.get("/getAllUsers", async (req, res) => {
    await profileModel
      .find()
      .then((profile) => res.json(profile))
      .catch((err) => res.json(err));
  });

  // can remove a user with their id
  app.delete("/removeUser/:id", async (req, res) => {
    const id = req.params.id;

    try {
      await profileModel.findByIdAndRemove(id);
      res.send({ status: "OK" });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  // the forgot password section takes an email and will send them an email with a link to a reset password form, which is got to with a token that is sent as part of the url
  app.post("/forgotPassword", async (req, res) => {
    const { email } = req.body;
    try {
      const user = await profileModel.findOne({ email });
      if (!user) {
        return res.json({ status: "Email not linked to account!" });
      }
      const secret = process.env.JWT_SECRET + user.password; // creates a new jwt secret token
      const token = jwt.sign({ email: user.email, id: user._id }, secret, {
        expiresIn: "60m", // times out in 60mins
      });
      const link = `http://localhost:3001/resetPassword/${user._id}/${token}`;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "jwoodburn782@gmail.com",
          pass: "naxl ixjg kbij izpj",
        },
      });
      // the transport uses my email to send the email

      var mailOptions = {
        from: "youremail@gmail.com",
        to: email,
        subject: "Waste Not Password Reset",
        text: "Reset Password Link: " + link,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (error) {}
  });

  // this authenticates the user and renders the reset form
  app.get("/resetPassword/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const user = await profileModel.findOne({ _id: id });
    if (!user) {
      return res.json({ status: "Email not linked to account!" });
    }
    const secret = process.env.JWT_SECRET + user.password;
    try {
      const verify = jwt.verify(token, secret);
      res.render("index", { email: verify.email, status: "Not Verified" });
    } catch (error) {
      res.json("Not Verified");
    }
  });

  // this takes the new password and assigns it to the account
  app.post("/resetPassword/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;
    const user = await profileModel.findById(id);
    if (!user) {
      return res.json({ status: "Email not linked to account!" });
    }
    const secret = process.env.JWT_SECRET + user.password;
    try {
      if (password === confirmPassword) {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = password;
        const user = await profileModel.findById(id);

        user.password = password;

        const updatedUser = await user.save();

        res.json("Password Changed, now try to login");
      }
    } catch (error) {
      console.log(error);
    }
  });

  // gets the server to run on port 3001
  const server = app.listen(3001, () => {
    console.log("Server is running");
  });

  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatsocket = socket;
    socket.on("addUser", (id) => {
      onlineUsers.set(id, socket.id);
    });

    // socket.io to send the messages in real time allowing them to update as the user sees them without reloads
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.message);
      }
    });
  });
})();
