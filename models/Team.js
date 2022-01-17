const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Team extends Model { 
    static addPoint(body, models) {
        return models.Point.create({
            admin_id: body.admin_id,
            team_id: body.team_id
        }).then(()=> {
            return Team.findOne({
                where: {id: body.team_id},
                attributes: [
                    'id',
                    'team_name',
                    'team_description',
                    'created_at',
                    [sequelize.literal('(SELECT COUNT(*) FROM point WHERE team.id = point.team_id)'), 'point_count']
                ],
                include: [
                    {
                        model: models.Task,
                        attributes: ['id', 'task_text', 'admin_id', 'team_id', 'created_at'],
                        include: {
                            model: models.Admin,
                            attributes: ['admin_name']
                        }
                    }
                ]
            });
        });
    }
}

Team.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        team_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        team_description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        admin_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'admin',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'team'
    }
);

module.exports = Team;