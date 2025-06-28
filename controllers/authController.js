const User = require('../models/user');
const passport = require('passport');


module.exports.showSignup = (req, res) => {
    res.render('signup', { error: null });
};


module.exports.signup = async (req, res) => {
    const { username, password } = req.body;
    console.log('Signup attempt:', { username, password: password ? '***' : 'missing' });
    
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Username already exists:', username);
            return res.render('signup', { error: 'Username already exists' });
        }
        
      
        const user = new User({ username, password });
        await user.save();
        console.log('User created successfully:', username);
      
        req.login(user, (err) => {
            if (err) {
                console.error('Login error after signup:', err);
                return res.render('signup', { error: 'Error logging in after signup' });
            }
            console.log('User logged in after signup:', username);
            return res.redirect('/blogs');
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.render('signup', { error: 'Error signing up' });
    }
};


module.exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};


module.exports.login = (req, res, next) => {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password: password ? '***' : 'missing' });
    
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Passport authentication error:', err);
            return next(err);
        }
        if (!user) {
            console.log('Authentication failed:', info.message);
            req.session.messages = { error: info.message };
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login error:', err);
                return next(err);
            }
            console.log('User logged in successfully:', user.username);
            return res.redirect('/blogs');
        });
    })(req, res, next);
};


module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.redirect('/blogs');
        }
        res.redirect('/login');
    });
};


