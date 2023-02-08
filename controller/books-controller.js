const Book = require('../models/Books');
const userBook = require('../models/userbook');
const category = require('../models/category');
const userData= require("../models/user.js")
const group = require('../models/categoriesgroup');
class Bookscont{
 async getAllBooks  (req, res, next)  {
    let book;
    try {
        book = await Book.find()
    } catch (err) {
        console.log(err)
    }
    if (!book) {
        return "{' status' : 'fail','message': 'Unable to Find Book' }"
    }
    return "{'status' : 'success' ,'message': }",book

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
        return "{'status' : 'fail','message': 'Oops! Not Found' }"
    }
    return "{'status' : 'success' ,'message': book }"
}
 async addBook (name, author, description, image, category) {
    
    var bookexist = await Book.findOne({name:name})
    
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
            return "{'status ': 'fail' ,'message': 'book already exist' }"
        }

    } catch (err) {
        console.log(err)
    }
    if (!book) {
        return "{ 'status ': fail ,message: 'Unable to Add By this Id' }"
    }
    return "{status : 'success','message':} ",book

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
        return "{'status ': 'fail', 'message': 'Unable to Delete By this Id' }"
    }
    return "{' status' : 'success','message': 'book Successfully Deleted!!' }"
}
async groupcat (req, res, next) {
    const categoriesGroup=await group.create({
        book_id:req.body.bookId,
        category_id:req.body.categoryId
    })
    await categoriesGroup.save()
    return "{' status' : 'success','message':categoriesGroup}"
}
}


module.exports=Bookscont
