const { Model, DataTypes } = require('sequelize'); //from sequelize package
const sequelize = require('../config/connection'); //MySQL connection

//create Post model
class Post extends Model {
    static upvote(body,models) {//js's built in static keyword to indicate the upvote method is one that's based on the Post model and not an instance method like we used earlier with the user model
        //now we can use Post.upvote() as if it were one of Sequelize's built in methods
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
                ]
            });
        });

    }
}

//create fields/columns for Post model
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true //pretty cool validator for url
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: { //this is how we show who posted it
                model: 'user', //the other model we reference
                key: 'id' //the primary key from the other model
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;