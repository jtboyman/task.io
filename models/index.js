//this file holds all the models
const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

//create associations
User.hasMany(Post, {
    foreignKey: 'user_id' //links the referenced id column from User to user_id in Post
});

Post.belongsTo(User, { //must make the reverse association too
    foreignKey: 'user_id' //links, and makes sure each post can have only one user associated
})

//the votes association to connect Post and User through them
//these two methods allow the models to query each other's info in the context
//of a vote (we can see a single user's votes, or all the users that voted
//on a single post!)
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts', //name of Vote model displayed as this when queried
    foreignKey: 'user_id' //the foreign key is in Vote
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id' //user_id and post_id pairings must be unique, so single user cannot vote multiple times on one post (foreign key constraint)
});

//creating some one to many associations directly between the models
//ex: we can see a total count of votes for a single post when queried
//this would be difficult if hadn't associated Vote model directly with other 2

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

//comment stuff - we didnt need to specify comment as a through bc
//we don't need to access Post through Comment, we just want to see the user's
//comment and which post it was for
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = {User, Post, Vote, Comment};