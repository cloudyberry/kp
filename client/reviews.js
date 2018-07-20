Template.reviews.rendered = function() {
	$("#reviews-link").addClass('selected');
	$("#profile-link").removeClass('selected');
	$("#rankings-link").removeClass('selected');
	$("#search-link").removeClass('selected');
	$("#login-link").removeClass('selected');
}
//go to collection and post to reviews page
Template.reviews.helpers({
	reviews: function() {
		var reviews = Reviews.find({"vetted":1}, {sort: {createdAt: -1}});
		return reviews;
	},
	admin: function() {
		var adminId = Meteor.users.findOne({"emails.address": "e0201623@u.nus.edu"})._id;
		var userId = Meteor.userId();
		if (userId === adminId) {
		return true;
	}
	},
	// author: function() {
	// 	return Meteor.user().profile.username;
	// },

		comms: function() {
      var comms = Comments.find({}, {sort: {createdAt: -1}});
      return comms;
    },

		displayComments: function() {
			return Session.equals('showCommentsId', this._id);
		},

		liked: function () {
				return Session.equals('likeId', this._id);
		},
		disliked: function () {
				return Session.equals('dislikeId', this._id);
		}


});

Template.reviews.events({

	"click #hashtag": function() {
		var hashtag = Reviews.findOne({_id: this._id}).hashtag;
		console.log(hashtag);
		Meteor.call('endHashtag');
		Meteor.call('returnHashtag', hashtag);
	},

	"click #like": function() {
		Session.set('likeId', this._id);

		var thisUser = Meteor.userId();
		var thisReview = Reviews.findOne({_id: this._id})._id;
		var reviewAuthor =Reviews.findOne({_id: this._id}).userId;
		var Name =  Meteor.user().profile.username;
		var thisReviewsVotes = Reviews.findOne({_id: this._id}, {voted: {$in: Name}}).voted;

		// //detect doublevoting
		// if (thisReviewsVotes.indexOf(Name) > -1) {
		// 	Bert.alert("You cannot vote twice", "danger", "growl-top-right");
		// 	// In the array!, meaning user has voted
		// } else {
			// Not in the Array, Do stuff.
			Meteor.call("countVote", thisReview, Name);
			Meteor.call("userPointLike", reviewAuthor);
			Meteor.call("likeVote", thisUser, thisReview);


			if( (Session.get('dislikeId')!=null) ) {

				Meteor.call("countVote", thisReview, Name);
				Meteor.call("userPointunDislike", reviewAuthor);
				Meteor.call("undislikeVote", thisUser, thisReview);
				Session.set('dislikeId', null);

			}
		//
		// }

		if (Name == thisReviewsVotes) {

		}
	},

	"click #unlike": function() {
		Session.set('likeId', null);
		//means never like
		var thisUser = Meteor.userId();
		var thisReview = Reviews.findOne({_id: this._id})._id;
		var reviewAuthor =Reviews.findOne({_id: this._id}).userId;
		var Name =  Meteor.user().profile.username;
		var thisReviewsVotes = Reviews.findOne({_id: this._id}, {voted: {$in: Name}}).voted;

		// //detect doublevoting
		// if (thisReviewsVotes.indexOf(Name) > -1) {
		// 	Bert.alert("You cannot vote twice", "danger", "growl-top-right");
		// 	// In the array!, meaning user has voted
		// } else {
			// Not in the Array, Do stuff.
			Meteor.call("countVote", thisReview, Name);
			Meteor.call("userPointunLike", reviewAuthor);
			Meteor.call("unlikeVote", thisUser, thisReview);

		//
		// }

		if (Name == thisReviewsVotes) {

		}
	},


	"click #dislike": function() {
		Session.set('dislikeId', this._id);
		var thisUser = Meteor.userId();
		var thisReview = Reviews.findOne({_id: this._id})._id;
		var reviewAuthor = Reviews.findOne({_id: this._id}).userId;
		//var Name = Meteor.user().username;
		var Name = Meteor.user().profile.username;;
		var thisReviewsVotes = Reviews.findOne({_id: this._id}, {voted: {$in: Name}}).voted;


			// Not in the Array, Do stuff.
			Meteor.call("countVote", thisReview, Name);
			Meteor.call("userPointDislike", reviewAuthor);
			Meteor.call("dislikeVote", thisUser, thisReview);

			console.log(Session.get('likeId'));
			if( (Session.get('likeId')!=null) ) {

				Meteor.call("countVote", thisReview, Name);
				Meteor.call("userPointunLike", reviewAuthor);
				Meteor.call("unlikeVote", thisUser, thisReview);
				Session.set('likeId', null);

			}


		if (Name == thisReviewsVotes) {

		}
	},

	"click #undislike": function() {
		Session.set('dislikeId', null);
		var thisUser = Meteor.userId();
		var thisReview = Reviews.findOne({_id: this._id})._id;
		var reviewAuthor = Reviews.findOne({_id: this._id}).userId;
		//var Name = Meteor.user().username;
		var Name = Meteor.user().profile.username;;
		var thisReviewsVotes = Reviews.findOne({_id: this._id}, {voted: {$in: Name}}).voted;


			// Not in the Array, Do stuff.
			Meteor.call("countVote", thisReview, Name);
			Meteor.call("userPointunDislike", reviewAuthor);
			Meteor.call("undislikeVote", thisUser, thisReview);


		if (Name == thisReviewsVotes) {

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
