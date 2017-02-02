let admin = require("firebase-admin");
let firebase = require("firebase");
let fb = require("../../config/config.json");
let fs = require("fs");
let serviceAccount = require("../../config/doing-utah-daily.json");
let FroalaEditor = require('../../assets/thirdparty/wysiwyg-editor-node-sdk/lib/froalaEditor.js');
const express = require('express');
const router = express.Router();
let mailchimp = require('mailchimp-v3');
mailchimp.setApiKey('cd3c184d8fb3d6bdfc07e8d3f84f80ec-us13');
let config = {
    apiKey : fb.apiKey,
    authDomain : fb.authDomain,
    databaseURL : fb.databaseURL,
    storageBucket : fb.storageBucket,
    messagingSenderId : fb.messagingSenderId
};
firebase.initializeApp(config);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: fb.databaseURL
});

/* Start of Routes */

/* User Admin */
router.post('/saveUserInDb', function(req, res) {
    firebase.database().ref('users/' + req.body.uid).update(req.body);
    res.send("User Updated Successfully");
});
router.post('/locateUser', function(req, res) {
    admin.auth().getUser(req.body.uid)
        .then(function(userRecord) {
            // See the tables below for the contents of userRecord
            console.log("Successfully fetched user data:", userRecord.toJSON());
            res.send(userRecord.toJSON());
        })
        .catch(function(error) {
            console.log("Error fetching user data:", error);
        });
});

router.post('/createUser', function(req, res) {
    admin.auth().createUser({
        email: req.body.email,
        emailVerified: false,
        password: req.body.password,
        disabled: false
    })
        .then(function(userRecord) {
            console.log("Successfully created new user:", userRecord.uid);
            res.send(userRecord.uid);
        })
        .catch(function(error) {
            console.log("Error creating new user:", error);
            res.send(error);
        });
});
router.post('/checkUser', function(req, res) {
    admin.auth().verifyIdToken(req.body.token)
        .then(function(decodedToken) {
            let uid = decodedToken.uid;
            res.send(uid);
        }).catch(function(error) {
    });

});
router.post('/adminUpdate', function(req, res) {
    admin.auth().updateUser(req.body.uid, {
        displayName: req.body.displayName,
        email: req.body.email,
        photoURL: req.body.profilePic
    })
        .then(function(userRecord) {
            console.log("Successfully updated user", userRecord.toJSON());
            res.send("User updated!!")
        })
        .catch(function(error) {
            console.log("Error updating user:", error);
        });
});

router.post('/updateUser', function(req, res) {
    firebase.database().ref('/users/' + req.body.uid).update(req.body);
    res.send("All Done Successfully");
});
router.post('/loadUsers', function(req, res) {
    firebase.database().ref('users/').once('value').then(function(snapshot) {
        console.log(snapshot.val());
        res.send(snapshot.val());
    });
});
/* Comment Management */
router.post('/addComment', function(req, res) {
    firebase.database().ref('comments/' + req.body.uid).set(req.body);
    res.send("Comment Added Successfully");
});
router.post('/loadComments', function(req, res) {
    firebase.database().ref('/comments/').once('value').then(function(snapshot){
        console.log(snapshot.val());
        res.send(snapshot.val());
    })
});
router.post('/approveComment', function(req, res) {
    firebase.database().ref('/comments/' + req.body.uid).update(req.body);
    res.send("Comment Approval Status Changed Successfully");
});
router.post('/deleteComment', function(req, res) {
    firebase.database().ref('/comments/' + req.body.uid).remove();
    res.send("Comment Deleted Successfully");
});

/* Blog Management */

router.post('/deletePhoto', function(req, res) {
    console.log('Deleting file ' + req.body.path);
    fs.unlink('.' + req.body.path, function(response) {
        if (response.Error) {
            throw response.Error;
        }
        console.log(response);
        res.send ({
            status: "200",
            responseType: "string",
            response: "success"
        });
    });
});

router.post('/uploadImage', function(req, res) {
    FroalaEditor.Image.upload(req, '/uploads/', function(err, data) {
        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/createBlog', function(req, res) {
    firebase.database().ref('blogs/' + req.body.uid).set(req.body);
    res.send("All Done Successfully");

});

router.post('/all', function(req, res) {
    firebase.database().ref('blogs/').once('value').then(function(snapshot) {
        res.send(snapshot.val());
    }).catch(function(err) {
        if (err) throw err;
    })

});

router.post('/deletePost', function(req, res) {
    let blog = firebase.database().ref('blogs/'+ req.body.uid);
    blog.remove().then(function(response) {
        res.send('Post Deleted Successfully');
    }).catch(function(err) {
        if (err) res.send(err);
    })

});

router.post('/updateBlog', function(req, res) {
    firebase.database().ref('blogs/' + req.body.uid).update(req.body).then(function(response) {
        res.send("All Done Successfully");
    }).catch(function(err) {
        if (err) res.send(err);
    });

});

/* Login */

router.post('/login', function(req, res) {
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
        .then(function(response) {
            firebase.auth().currentUser.getToken(/* forceRefresh */ true).then(function(idToken) {
                res.send(idToken);
            }).catch(function(err) {
                if (err) throw err;
            });
        })
        .catch(function(error) {
            if (error) {
                res.send(error);
            }
        });
});

router.post('/logout', function(req, res) {
    firebase.auth().signOut().then(function() {
    }, function(error) {
        if (error) throw error;
    });
});

router.post('/resetPassword', function(req, res) {
    firebase.auth().sendPasswordResetEmail(req.body.email).then(function() {
        res.send('Email Sent');
    }).catch(function(err) {
        if (err) {
            res.send(err);
        }
    })
});

router.post('/forgot', function(req, res) {
    firebase.auth().sendPasswordResetEmail(req.body.email).then(function() {
        res.send('Email Sent');
    }, function(error) {
        // An error happened.
    });
});

/* Category Management */

router.post('/addCategory', function(req, res) {
    firebase.database().ref('categories/' + req.body.uid).set({
        uid: req.body.uid,
        addedBy: req.body.author,
        name: req.body.name,
        created: Date.now()
    });
    res.send("Added Category Successfully");
});
router.post('/loadCategories', function(req, res) {
    firebase.database().ref('categories/').once('value').then(function(snapshot) {
        res.send(snapshot.val());
    }).catch(function(err) {
        if (err) throw err;
    })
});
router.post('/deleteCategory', function(req, res) {
    firebase.database().ref('categories/' + req.body.uid).remove().then(function(response) {
        res.send('Category deleted successfully!')
    }).catch(function(err) {
        if (err) res.send(err);
    });
});

/* Contest Management */
router.post('/addContest', function(req, res) {
    firebase.database().ref('contests/' + req.body.uid).set({
        uid: req.body.uid,
        addedBy: req.body.author,
        title: req.body.title,
        created: Date.now(),
        starts: req.body.startDate,
        ends: req.body.endDate,
        county: req.body.county,
        posted: req.body.posted,
        param: req.body.param,
        content: req.body.content,
        featuredImg: req.body.featuredImg,
        rules: req.body.rules
    });
    res.send('Added Contest Successfully');
});
router.post('/loadContests', function(req, res) {
    firebase.database().ref('contests/').once('value').then(function(snapshot) {
        res.send(snapshot.val());
    }).catch(function(err) {
        if (err) throw err;
    })
});
router.post('/deleteContest', function(req, res) {
    firebase.database().ref('contests/' + req.body.uid).remove().then(function(response) {
        res.send('Contest deleted successfully!')
    }).catch(function(err) {
        if (err) res.send(err);
    });
});
router.post('/postEmail', function(req, res){
    let batch = mailchimp.createBatch('lists/6c6caad172/members', 'POST');
    let batches = [
        {
            body: {
                status: 'subscribed',
                email_address: req.body.email
            }
        }
    ];

    batch
        .add(batches)
        .send()
        .then(function(response){
            console.log(response.id);
        })
        .catch(function(error){
            console.log(error);
        });
    res.send(true);
});

module.exports = router;

