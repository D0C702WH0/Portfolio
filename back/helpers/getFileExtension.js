const getFileExtension = name => {
    return name.substring(name.lastIndexOf(".")+1)
}

module.exports = getFileExtension;
