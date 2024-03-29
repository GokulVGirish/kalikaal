const isLogged = async(req, res, next) => {
  try{
    if (req.session.user) {
      next();
    } else {
      res.redirect("/");
    }

  }
  catch(error){
    console.log(error)
  }
};

module.exports = {
  isLogged
};
