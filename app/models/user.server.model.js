'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Checklist = mongoose.model('Checklist'),
	Section = mongoose.model('Section'),
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema( {
    firstName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    displayName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    username: {
        type: String,
        unique: 'testing error message',
        required: 'Please fill in a username',
        trim: true
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],     
        default: ['user']
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    /* Check it fields */
    ocupation: {
        type: String
    },
    industry: {
        type: String
    },
    contry: {
        type: String
    },
    language: {
        type: String,
        default: "en"
    },
    status: {
        type: String,
        enum: ['inactive', 'active' ],
        default: 'inactive'
    },
    accept:{
        type: Boolean,
        required : "You must accept the Terms and Conditions"
    },
    favorites: [{ 
        type: Schema.ObjectId, 
        ref: 'Checklist'
    }],
    //On screen Working copy 
    workingOn: {
        //Time of last auto-saved modification 
        updated: { 
            type: Date,
            default: Date.now()
        },
        //On screen working copy of a checklist
        checklist: {
            id: {
                type: Schema.ObjectId,
                index: true
            },
            name: {
                type: String,
                default: 'My new Checklist',
                trim: true
            },
            description: {
                type: String,
                trim: true
            },
            reference: {
                type: String,
                trim: true
            },
            language: {
                type: String,
                default: 'en'
            },
        	category: {
                type: Schema.ObjectId,
                ref: 'Category'
            },
            sections: [
            {
                name: {
                    type: String,
                    default: '',
                    required: 'Please fill Checklist name',
                    trim: true
                },
        	    description: {
                    type: String,
                    trim: true
                },
                items: [
                {
                    content: {
                        type: String,
                        default: '',
                        trim: true
                    }
                }]
            }]
        }
    }
});

/**
 * History, visits by user
 **/
var HistorySchema = new Schema( {
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        index: true
    },
    checklist: {
        type: Schema.ObjectId,
        ref: 'Checklist',
        index: true
    },
    visited: {
        type: Date
    },
    visits: {
        type: Number,
        default: 0
    },
    useCount: {
        type: Number,
        default: 0
    }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

/**
 * Remove lastVisited array from the returned (to browser) JSON object
 * */
// UserSchema.set('toJSON', { transform : function(doc, ret, options){
//     delete ret.lastVisited;
//     return ret;
// }});

mongoose.model('User', UserSchema);
mongoose.model('History', HistorySchema);


 
