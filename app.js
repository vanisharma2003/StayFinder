const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,"public")));
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const truncateText = require('./helper');
main()
.then(()=>{console.log("Connection eastablished")})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://sharmavani440:vani2003@cluster0.q2hzxcm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}
app.get("/",async (req,res)=>{
  let allListings= await Listing.find({});
  res.render("home.ejs",{allListings});
});
app.get("/listing",async (req,res)=>{
   let allListings= await Listing.find({});
   res.render("index.ejs",{allListings,truncateText});
});
app.get("/listing/:id",async (req,res)=>{
  let {id}=req.params;
  let data= await Listing.findById(id);
  res.render("show.ejs",{data});
  
});
app.get("/new",(req,res)=>{
  res.render("new.ejs");
});
app.post("/listing",async (req,res)=>{
  let {title,price,location,description,url,image,country}=req.body;
  const newinfo=await new Listing({
    title: title,
    price: price,
    location: location,
    description: description,
    image: {
      url: image.url,
    },
    country: country,
  });
  newinfo.save();
  res.redirect("/listing");
});
app.get("/listing/:id/edit",async (req,res)=>{
  let {id}=req.params;
  let data= await Listing.findById(id);
  res.render("edit.ejs",{data});
});
app.put("/listing/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
 

  try {
    // Retrieve the existing listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    // Update fields from the form data
    listing.title = updatedData.title || listing.title;
    listing.description = updatedData.description || listing.description;
    listing.price = updatedData.price || listing.price;
    listing.location = updatedData.location || listing.location;
    listing.country = updatedData.country || listing.country;
    listing.image.url = updatedData.url || listing.image.url;

    // Save the updated listing
    await listing.save();

    res.redirect(`/listing/${id}`);
  } catch (error) {
    console.error("Error updating listing: ", error);
    res.status(500).send("Error updating listing");
  }
});
app.delete("/listing/:id",async (req,res)=>{
  let {id}=req.params;
await Listing.findByIdAndDelete(id);
res.redirect("/listing");
})


app.listen(3000,()=>{
    console.log("app is listening on port 3000");
})