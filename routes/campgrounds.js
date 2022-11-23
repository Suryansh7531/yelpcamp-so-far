const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');


const validateCampground = (req, res, next) => {
  console.log(req.body.campground)
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    // throw new ExpressError(error.details,400);
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  else {
    next();
  }
}

// router.get('/makecampground',async(req, res)=> {
//     const camp = new Campground({ title: 'My backyard', description: 'cheap camping!' });
//     await camp.save();
//     res.send(camp);
// })

router.get('/', catchAsync(async (req, res,) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});


router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
  // res.send(req.body);
  // if(!req.body.campground)throw new ExpressError('Invalid Campground Data',400);

  // const result= campgroundSchema.validate(req.body);
  // if(result.error){
  //   throw new ExpressError(result.error.details,400);
  // }
  // console.log(result);
  //first console log what properties are involved then destructure accordingly
}));

router.get('/:id', catchAsync(async (req, res) => {
  // res.render('campgrounds/show');
  const campground = await Campground.findById(req.params.id).populate('reviews');
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
  // res.send("hi editor");
}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted campground')
  res.redirect(`/campgrounds`);
}));

module.exports = router;