const Goal = require('../models/Goal');
const User = require('../models/User');

module.exports = {
  all: function(req,res){
    passport.authenticate('bearer', function(err, user) {
      if (user) {
        Goal.find({},function(err,goals){
          if (err) res.send(500)
          res.json(goals)
        })
      } else {
        return res.redirect('/users/login')
      }
    })
  },


// pass id from goal into function
// use this id to find goal to update

  // complete: function(req, res) {
  //   // var goalProg = req.body;
  //   Goal.where('_id').equals(req.body._id).exec((err, user) => {
  //     console.log(goal);
  //     Goal.complete = true;
  //   // Goal.complete(goalProg._id, (err, goal) => {
  //   //   if(goalProg = complete:false)
  //   //   if (err) { return res.status(500).send(err); }
  //   //   return res.redirect(`/users/show/${req.body._user}`);
  //   })
  // },



  readOne: function(req, res) {
    Goal.
    findById(req.param('goalsId')).
    populate('_user').
    exec((err, goal) => {
      return res.render('goals/show', {err: err, goal: goal})
    });
  },

  update: function(req, res) {
    var goalInfo = req.body
    const id = req.params.goalsId
    var goalComplete;
    if(req.query.undo === "true"){
      goalComplete = false
    }else{
      goalComplete = true
    }
    Goal.update({ _id: id }, { complete: goalComplete }, (err, goal) => {
      if (err) { return res.status(500).send(err); }
      return res.redirect(req.header('Referer'));
    })
  },


  //// IMPORTANT
  create: function(req, res) {
    var goalInfo = req.body;
    var user = req.user
    goalInfo.user = user;
    Goal.create(goalInfo, (err, goal) => {
      if (err) { return res.status(500).send(err); }
      user.goals.push(goal)
      user.save((err) => {
        if (err) { return res.status(500).send(err); }
        return res.redirect(`/goals/index`);
      });
    })
  },

  readAll: function(req, res) {
    Goal.find({ 'user': req.user.id }, (err, goals) => {
      if (err) { return res.status(500).send(err); }
      var sortedGoals = goals.sort((a, b) => a.weight > b.weight);
      var totalWeight = goals.reduce((sum, goal) => sum + goal.weight, 0)
      return res.render('goals/index', {
        err: err,
        goals: sortedGoals,
        totalWeight: totalWeight,
        user: req.user.name
      })
    });
  },

  complete: function(req, res) {
    var goalId = req.param('goalId');
    Goal.findOneAndUpdate({ _id: goalId }, { complete: true }, (err) => {
      if (err) { return res.status(500).send(err); }
      return res.redirect('/goals/index')
    });
  },

  undo: function(req, res) {
    var goalId = req.param('goalId');
    Goal.findOneAndUpdate({ _id: goalId }, { complete: false }, (err) => {
      if (err) { return res.status(500).send(err); }
      return res.redirect('/goals/index')
    });
  }
}
