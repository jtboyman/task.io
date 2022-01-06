//this file holds all the models
const User = require('./User');
const Group = require('./Group');
const Point = require('./Point');
const Comment = require('./Comment');

Group.hasMany(User, {
    foreignKey: 'group_id'
});

User.belongsTo(Group, {
    foreignKey: 'group_id'
});

User.hasMany(Point, {
    foreignKey: 'user_id'
});

Point.belongsTo(User, {
    foreignKey: 'user_id'
});


//comment stuff - we didnt need to specify comment as a through bc
//we don't need to access Post through Comment, we just want to see the user's
//comment and which post it was for
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Group, {
    foreignKey: 'group_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Group.hasMany(Comment, {
    foreignKey: 'group_id'
});

module.exports = {User, Group, Point, Comment};

/* vote stuff lol idk
//the votes association to connect Post and User through them
//these two methods allow the models to query each other's info in the context
//of a vote (we can see a single user's votes, or all the users that voted
//on a single post!)
User.belongsToMany(Post, {
    through: Point,
    as: 'voted_posts', //name of Point model displayed as this when queried
    foreignKey: 'user_id' //the foreign key is in Point
});

Post.belongsToMany(User, {
    through: Point,
    as: 'voted_posts',
    foreignKey: 'post_id' //user_id and post_id pairings must be unique, so single user cannot vote multiple times on one post (foreign key constraint)
});*/