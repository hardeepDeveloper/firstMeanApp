if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://hardeepS:hardeepS9@ds123783.mlab.com:23783/vidjot-prod'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}