const express = require("express");
const urlRoute = require("./routes/url.router");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const PORT = 8001;

const app = express();
connectToMongoDB('mongodb://localhost:27017/short-url')
  .then(() => console.log("MongoDb Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use("/url", urlRoute);

app.get('/:shortId', async (req,res) =>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push:{
                visitHistory: 
                {
                    timestamp:Date.now(),
                },
        },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));
