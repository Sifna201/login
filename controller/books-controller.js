const Book = require('../models/Books');
const category = require('../models/category');

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
        console.log()
    }
    if (!book) {
        return res.json({status : "fail" ,message: 'Oops! Not Found' })
    }
    return res.json({status : "success" ,message: book })
};
const addBook = async (req, res, next) => {
    const { name, author, description, image, category } = req.body
    let book;
    try {
        book = new Book({
            name,
            author,
            description,
            image,
            category

        })
        await book.save()
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
        console.log()
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

// module.exports.getCategory = (id, callback) => {
//     message.find({ category: id }, callback).populate('category')
// }
// var query = Book.find({ "category": "novel" }).populate("category")
var result=category.aggregate([
    {
      $lookup:
        {
          from: Book,
          localField: "name",
          foreignField: "category",
          as: "newList"
        }
    }
  ])
    

exports.getAllBooks = getAllBooks;
exports.searchBook = searchBook
exports.addBook = addBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;