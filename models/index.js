const User = require('./User');
const Admin = require('./Admin');
const Team = require('./Team');

Admin.hasMany(Team, {
    foreignKey: 'admin_id'
});

Team.belongsTo(Admin, {
    foreignKey: 'admin_id'
})

module.exports = { User, Admin, Team };