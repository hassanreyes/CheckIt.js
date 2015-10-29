/**
 * Created by Hassan on 10/28/2015.
 */
'use strict';
/**
 * Insert initial values
 ***/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Setup code
 */
var User = mongoose.model('User'),
    History = mongoose.model('History'),
    Checklist = mongoose.model('Checklist');
/**
 * Create Admin user if not
 * */
var user = new User( {
    firstName : 'Admin',
    lastName : '.',
    displayName : 'Administrator',
    username: 'Admin',
    password : 'admin123',
    roles : ['admin'],
    email : 'hassan.reyes@gmail.com',
    status : 'active',
    provider : 'local'
});

User.findOne({ username : user.username}).exec(function(err, adminUser){
    if(err){ }
    else {
        if(!adminUser){
            user.save(function(err, adminUser){
                if(err){  console.error(err); }
                else{
                    //Update all current checklist creator user, to use this
                    var conditions = {  }
                        , update = { $set: { user: adminUser._id }}
                        , options = { multi: true };

                    Checklist.update(conditions, update, options, function(err, numAffected) {
                        if(err){
                            console.error('Updating existing checklists: ' + err);
                        }
                        console.log('Updating existing checklists: User Records updated: ' + numAffected);
                    });
                }
            });
        }
    }
});

/* Clear all User's favorites */
//  var conditions = {  }
//   , update = { $set: { favorites: [] }}
//   , options = { multi: true };

// User.update(conditions, update, options, function(err, numAffected) {
//     if(err){
//         console.error('Clear Favorites: ' + err);
//     }
//     console.log('Clear Favorites: User Records updated: ' + numAffected);
// });

// History.remove({}).exec(function(err){
//     if(err) { console.error('Clearing Histroy: ' + err); }
//     else { console.log('Clearing Histroy'); }
// });

var Category = mongoose.model('Category');
User.findOne({ username : user.username }).exec(function(err, adminUser) {
    if(adminUser){
        Category.findOne({name:'Software Engineering'}).exec(function(error, result){
            if(!result){
                var cat0 = new Category({name:'Software Engineering', user : adminUser}),
                    cat1 = new Category({name:'Software Implementation', user : adminUser}),
                    cat1_1 = new Category({name:'Architectual Design', user : adminUser}),
                    cat1_2 = new Category({name:'Construction', user : adminUser}),
                    cat1_2_1 = new Category({name:'C_C++', user : adminUser}),
                    cat1_2_2 = new Category({name:'Java', user : adminUser}),
                    cat1_3 = new Category({name:'Detailed Design', user : adminUser}),
                    cat1_4 = new Category({name:'Integration', user : adminUser}),
                    cat1_5 = new Category({name:'Qualification Testing', user : adminUser}),
                    cat1_6 = new Category({name:'Requirements Analysis', user : adminUser}),
                    cat2 = new Category({name:'Software Reuse', user : adminUser}),
                    cat2_1 = new Category({name:'Domain Engineering', user : adminUser}),
                    cat2_2 = new Category({name:'Reuse Asset Management', user : adminUser}),
                    cat2_3 = new Category({name:'Reuse Program Management', user : adminUser}),
                    cat3 = new Category({name:'Software Support', user : adminUser}),
                    cat3_1 = new Category({name:'Audit', user : adminUser}),
                    cat3_2 = new Category({name:'Configuration Management', user : adminUser}),
                    cat3_3 = new Category({name:'Documentation Management', user : adminUser}),
                    cat3_4 = new Category({name:'Problem Resolution', user : adminUser}),
                    cat3_5 = new Category({name:'Quality Assurance', user : adminUser}),
                    cat3_6 = new Category({name:'Review', user : adminUser}),
                    cat3_7 = new Category({name:'Validation', user : adminUser}),
                    cat3_8 = new Category({name:'Verification', user : adminUser});

                cat1.parent = cat0;
                cat1_1.parent = cat1;
                cat1_2.parent = cat1;
                cat1_2_1.parent = cat1_2;
                cat1_2_2.parent = cat1_2;
                cat1_3.parent = cat1;
                cat1_4.parent = cat1;
                cat1_5.parent = cat1;
                cat1_6.parent = cat1;
                cat2.parent = cat0;
                cat2_1.parent = cat2;
                cat2_2.parent = cat2;
                cat2_3.parent = cat2;
                cat3.parent = cat0;
                cat3_1.parent = cat3;
                cat3_2.parent = cat3;
                cat3_3.parent = cat3;
                cat3_4.parent = cat3;
                cat3_5.parent = cat3;
                cat3_6.parent = cat3;
                cat3_7.parent = cat3;
                cat3_8.parent = cat3;

                cat0.save(function(){
                    cat1.save(function(){
                        cat1_1.save(function(){

                        });
                        cat1_2.save(function(){
                            cat1_2_1.save();
                            cat1_2_2.save();
                        });
                        cat1_3.save();
                        cat1_4.save();
                        cat1_5.save();
                        cat1_6.save();
                    });
                    cat2.save(function(){
                        cat2_1.save();
                        cat2_2.save();
                        cat2_3.save();
                    });
                    cat3.save(function(){
                        cat3_1.save();
                        cat3_2.save();
                        cat3_3.save();
                        cat3_4.save();
                        cat3_5.save();
                        cat3_6.save();
                        cat3_7.save();
                        cat3_8.save();
                    });
                });
            }
        });
    }
});
