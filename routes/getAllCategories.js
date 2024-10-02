const express = require('express');
const router = express.Router();
const axios = require('axios');
const Category = require('../models/Categories');  
router.post('/', async (req, res) => {
  try {
    await Category.deleteMany({});
    const response = await axios.get(`${process.env.API_LINK}`+`${process.env.API_KEY}`);
    const categories = response.data;
    await Category.insertMany(categories);
    res.status(200).json({ message: 'Categories updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating categories' });
  }
});

router.post('/seeList',async(req,res)=>{
  try{
    const response = await Category.find({});
    res.status(200).json(response);
  }catch(error){
    console.log(error);
    res.status(500).json({message:'An error occured while getting different categories'});
  }
})

module.exports = router;


