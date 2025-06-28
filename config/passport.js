const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


passport.use(new LocalStrategy(async (username, password, done) => {
    console.log('Passport strategy called with:', { username, password: password ? '***' : 'missing' });
    
    try {
        
        const user = await User.findOne({ username: username });
        console.log('User found:', user ? user.username : 'not found');
        
        if (!user) {
            console.log('No user found with username:', username);
            return done(null, false, { message: 'Incorrect username.' });
        }
        
        
        if (user.password !== password) {
            console.log('Password mismatch for user:', username);
            return done(null, false, { message: 'Incorrect password.' });
        }
        
        console.log('Authentication successful for user:', username);
        return done(null, user);
    } catch (error) {
        console.error('Passport strategy error:', error);
        return done(error);
    }
}));

module.exports = passport;
