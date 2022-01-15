const User = require('./User');
const Admin = require('./Admin');
const Team = require('./Team');
const Point = require('./Point');
const Task = require('./Task');

//realte admins to teams they create
Admin.hasMany(Team, {
    foreignKey: 'admin_id'
});

Team.belongsTo(Admin, {
    foreignKey: 'admin_id'
});

//realte points to the admins that make them and relate teams to the points they earn
Point.belongsTo(Admin, {
    foreignKey: 'admin_id'
});

Point.belongsTo(Team, {
    foreignKey: 'team_id'
});

Admin.hasMany(Point, {
    foreignKey: 'admin_id'
});

Team.hasMany(Point, {
    foreignKey: 'team_id'
});

//relate tasks to admin and teams so admins can post the tasks into the  teams
Task.belongsTo(Admin, {
    foreignKey: 'admin_id'
});

Task.belongsTo(Team, {
    foreignKey: 'team_id'
});

Admin.hasMany(Task, {
    foreignKey: 'admin_id'
});

Team.hasMany(Task, {
    foreignKey: 'team_id'
});

module.exports = { User, Admin, Team, Point, Task };