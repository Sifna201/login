const Book = require('../models/Books');
const userBook = require('../models/userbook');
const category = require('../models/category');
const userData= require("../models/user.js")
const group = require('../models/categoriesgroup');
class Books{
 async getAllBooks  (req, res, next)  {
    let book;
    try {
        book = await Book.find()
    } catch (err) {
        console.log(err)
    }
    if (!book) {
        return res.json({ status : "fail",message: 'Unable to Find Book' })
    }
    return res.json({status : "success" ,message:book })

}
 async searchBook (req, res, next) {
    
    
    let book;
    try {
        book = await Book.find({$or:[{name:req.body.name},{author:req.body.author},{category:req.body.category}]})
        //console.log(book)
        
       
    } catch (err) {
        console.log(err)
    }
    if (!book) {
        return res.json({status : "fail" ,message: 'Oops! Not Found' })
    }
    return res.json({status : "success" ,message: book })
}
 async addBook (req, res, next) {
    const { name, author, description, image, category } = req.body
    bookexist = await Book.findOne({name:name})
    
    let book;
    try {
        if(!bookexist){
        book = new Book({
            name,
            author,
            description,
            image,

        })
        await book.save()
        }
        else{
            return res.json({status : "fail" ,message: 'book already exist' }) 
        }

    } catch (err) {
        console.log(err)
    }
    if (!book) {
        return res.json({ status : "fail" ,message: 'Unable to Add By this Id' })
    }
    return res.status(201).json({ book })

}
 async deleteBook (req, res, next) {
    const id = req.params.id;
    console.log(id)
    let book;
    try {
        book = await Book.findByIdAndRemove(id)
    } catch (err) {
        console.log(err)
    }
    if (!book) {
        return res.json({status : "fail", message: 'Unable to Delete By this Id' })
    }
    return res.json({ status : "success",message: 'Product Successfully Deleted!!' })
}
async groupcat (req, res, next) {
    const categoriesGroup=await group.create({
        book_id:req.body.bookId,
        category_id:req.body.categoryId
    })
    await categoriesGroup.save()
    res.json({ status : "success",message:categoriesGroup})
}
}


module.exports=Books
