const Book = require('../models/Books');
const userbook = require('../models/userbook');
const category = require('../models/category');
const userData= require("../models/user.js")
const group = require('../models/categoriesgroup');
const getAllBooks = async (req, res, next) => {
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

};
const searchBook = async (req, res, next) => {
    
    
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
};
const addBook = async (req, res, next) => {
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
            category

        })
        await book.save()}
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

};
const updateBook = async (req, res, next) => {
    const id = req.params.id;
    const { name, author, description, image, category } = req.body
    let book;
    try {
        book = await Book.findByIdAndUpdate(id, {
            name,
            author,
            description,
            image,
            category

        });
        book = await book.save()
    } catch (err) {
        console.log(err)
    }
    if (!book) {
        return res.json({status : "fail", message: 'Unable to Update' })
    }
    return res.json({status : "success" ,message: book })
};
const deleteBook = async (req, res, next) => {
    const id = req.params.id;
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
const groupcat = async (req, res, next) => {
    const categoriesGroup=await group.create({
        book_id:req.body.bookId,
        category_id:req.body.categoryId
    })
    await categoriesGroup.save()
    res.json({ status : "success",message:categoriesGroup})
}
module.exports.getCategory = (id, callback) => {
    message.find({ category: id }, callback).populate('category')
}
//USER BOOK
// user=userData.find()
// console.log(user)
// const userBookList = async (req, res, next) => {
//     const userbook=await userBook.create({
//     custometId:String,
//     bookId:String,
//     date:new date(),
//     fine:Number
//     })

// }
exports.getAllBooks = getAllBooks;
exports.searchBook = searchBook
exports.addBook = addBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
exports.groupcat = groupcat;