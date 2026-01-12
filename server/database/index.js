const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
const orm = new Sequelize('stories', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false
});

orm.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

const User = orm.define('users', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  badges: Sequelize.STRING
}, {
  timestamps: false
})

const Prompt = orm.define('prompts', {
  matchWords: Sequelize.STRING,//grabbed with external api
  parentID: { // <- Christian added this
    type: Sequelize.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true
});


const Badges = orm.define('badges', {
  mostLikes: {
    type: DataTypes.STRING,
    defaultValue: 'No winner yet'
  },
  mostWordMatchCt: {
    type: DataTypes.STRING,
    defaultValue: 'No winner yet'
  },
  mostContributions: {
    type: DataTypes.STRING,
    defaultValue: 'No winner yet'
  }
}, {
  timestamps: false
});

const Text = orm.define('texts', {
  text: Sequelize.STRING,
  winner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  wordMatchCt: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: false
});

const Story = orm.define('stories', {
  hasEnded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  timestamps: true,
});


// dummy table
// const FullStories = orm.define('fullStories', {
//   text: Sequelize.STRING
// }, {
//   timestamps: false
// });
// will actualy use a table like this
const UsersBookshelves = orm.define('usersBookshelves', {
  storyId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER
}, {
  timestamps: false
})

User.hasMany(Text);
// Text.belongsTo(User);
Prompt.hasMany(Text);
Text.belongsTo(Prompt);
Badges.hasMany(Prompt);
Prompt.belongsTo(Badges);
Story.hasOne(Prompt, { foreignKey: 'lastPrompt' })

// Linking the tables together
User.belongsToMany(Text, {through: UsersBookshelves, foreignKey: 'userId'});
Text.belongsToMany(User, {through: UsersBookshelves, foreignKey: 'storyId'});


User.sync()
Prompt.sync()
Text.sync()
Badges.sync()
Story.sync();
// added syncs
//FullStories.sync()
UsersBookshelves.sync()


exports.User = User;
exports.Prompt = Prompt;
exports.Text = Text;
exports.Badges = Badges;
exports.Story = Story;
// exports
//exports.FullStories = FullStories;
exports.UsersBookshelves = UsersBookshelves;
