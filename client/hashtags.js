Template.hashtags.rendered = function() {
	$("#reviews-link").removeClass('selected');
	$("#profile-link").removeClass('selected');
	$("#rankings-link").removeClass('selected');
	$("#search-link").removeClass('selected');
	$("#login-link").removeClass('selected');
}
//go to collection and post to reviews page
Template.hashtags.helpers({
	hashtagged: function() {
		var reviews = Reviews.find({"hashtagged":1}, {sort: {createdAt: -1}});
		return reviews;
	},
	admin: function() {
		var adminId = Meteor.users.findOne({"emails.address": "e0201623@u.nus.edu"})._id;
		var userId = Meteor.userId();
		if (userId === adminId) {
		return true;
	}
	},

		comms: function() {
      var comms = Comments.find({}, {sort: {createdAt: -1}});
      return comms;
    },

		displayComments: function() {
			return Session.equals('showCommentsId', this._id);
		},
});
Template.hashtags.events({

	"click #hashtag": function() {
		var hashtag = Reviews.findOne({_id: this._id}).hashtag;
		console.log(hashtag);
		Meteor.call('endHashtag');
		Meteor.call('returnHashtag', hashtag);
	},

	"click #like": function() {
		var thisUser = Meteor.userId();
		var thisReview = Reviews.findOne({_id: this._id})._id;
		var reviewAuthor =Reviews.findOne({_id: this._id}).userId;
		var Name =  Meteor.user().profile.username;
		var thisReviewsVotes = Reviews.findOne({_id: this._id}, {voted: {$in: Name}}).voted;

		//detect doublevoting
		if (thisReviewsVotes.indexOf(Name) > -1) {
			Bert.alert("You cannot vote twice", "danger", "growl-top-right");
			// In the array!, meaning user has voted
		} else {
			// Not in the Array, Do stuff.
			Meteor.call("countVote", thisReview, Name);
			Meteor.call("userPointLike", reviewAuthor);
			Meteor.call("likeVote", thisUser, thisReview);
			Bert.alert("Your Vote Was Placed", "success", "growl-top-right");

		}

		if (Name == thisReviewsVotes) {
			Bert.alert("You cannot vote for your own review", "danger", "growl-top-right");
		}
	},


	"click #dislike": function() {
		var thisUser = Meteor.userId();
		var thisReview = Reviews.findOne({_id: this._id})._id;
		var reviewAuthor = Reviews.findOne({_id: this._id}).userId;
		//var Name = Meteor.user().username;
		var Name = Meteor.user().profile.username;;
		var thisReviewsVotes = Reviews.findOne({_id: this._id}, {voted: {$in: Name}}).voted;

		if (thisReviewsVotes.indexOf(Name) > -1) {
			Bert.alert("You cannot vote twice", "danger", "growl-top-right");
			// In the array!, meaning user has voted
		} else {
			// Not in the Array, Do stuff.
			Meteor.call("countVote", thisReview, Name);
			Meteor.call("userPointDislike", reviewAuthor);
			Meteor.call("dislikeVote", thisUser, thisReview);
			Bert.alert("Your Vote Was Placed", "success", "growl-top-right");

		}

		if (Name == thisReviewsVotes) {
			Bert.alert("You cannot vote for your own review", "danger", "growl-top-right");
		}
	},
	"click #showcomment": function() {
	//	var thisUser = Meteor.userId();
	//	var thisReview = Reviews.findOne({_id: this._id})._id;
	//	var reviewAuthor = Reviews.findOne({_id: this._id}).userId;
	Session.set('showCommentsId', this._id);
},

"click #hide-comment": function() {
	Session.set('showCommentsId', null);
},

});
