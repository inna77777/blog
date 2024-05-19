### API ENDPOINTS:

API HEROKU : **https://blog-camping-cbb2c4cfea86.herokuapp.com/**

Required fields: **must be provided**
Optional fields: **can be provided but not necessary**

#### Users :

**POST /users/sign-up:** Allows users to create a new account by providing necessary details.

Required fields: **login, password, nickname**
Optional fields: **description**

**POST /users/login:** Allows users to log in by providing their credentials and returns an authentication token.
Required fields: **login, password**

**GET /users:** Retrieves a list of all users.

**GET /users/user/:id :** Retrieves a specific user by their ID.
**GET /users/current-user :** Retrieves a logined in user by its ID.

**PATCH /users/edit:** Updates the profile information of the authenticated user.

Optional fields: **description**

After it'll be possible to change another filds as login, pass, nick.
upload-avatar && upload-background also update user info but i did it as another route

**POST /users/upload-avatar:** Allows authenticated users to upload a new avatar image.
Optional fields: **avatar**

**POST /users/upload-background:** Allows authenticated users to upload a new background image.
Optional fields: **background**

**DELETE /users/delete:** Deletes the profile of the authenticated user.

#### Posts :

**POST /posts/create:** Allows authenticated users to create a new post by providing post details and an optional image.

Required fields: **title, content, image**

**PATCH /posts/update/:postId:** Allows authenticated users to update an existing post

Optional fields: **title, content, image**

**GET /posts/post/:id :** Retrieves a specific post by its ID.

**GET /posts/all/user/:id :** Retrieves all posts of one user.

**GET /posts/all :** Retrieves all posts from the service

**DELETE /posts/delete/post/:id** Delete post. It can do only user who created this post

#### Comments :

**POST /comments/add/post/:postId:** Allows authenticated users to add a comment to a specific post.
Required fields: **content**

**GET /comments/all/post/:postId:** Retrieves all comments associated with a specific post.

**DELETE /comments/delete/:commentId:** Allows authenticated users to delete a comment by its ID, ensuring only the comment creator or post owner can perform this action.

**PATCH /comments/update/:commentId:** Allows authenticated users to update the content of a comment, with validation to ensure only the comment creator or post owner can modify it.

Optional fields: **content**

#### Likes :

**POST /likes/add/post/:postId:** Allows authenticated users to like a specific post, throwing an error if they've already liked it, and updating the post's likes count accordingly.

**DELETE /likes/delete/post/:postId:** Enables authenticated users to remove their like from a post, updating the post's likes count and removing the like from the database.

**GET /likes/all/post/:postId:** Get count of likes of one post


#### Following/followers :

**POST /follow/user/:userId:** Allows authenticated users to follow another user identified by userId, ensuring that they are not already following the user.

**DELETE /follow/delete/user/:userId:** Enables authenticated users to unfollow a user identified by userId, verifying that they are currently following the user.

**GET /follow/user/followers:** Retrieves the list of followers for the authenticated user, based on their user ID .

**GET /follow/user/following:** Retrieves the list of users whom the authenticated user is following, based on their user ID.

### MongoDB Schemas description:

##### User

*Fields*:

**login:**

*Type*: string
*Required*: true
*Unique*: true
*Description*: Represents the user's login credentials.

**password:**
*Type*: string
*Required*: true
*Description*: Stores the user's password.

**nickname:**
*Type*: string
*Required*: true
*Unique*: true
*Description*: Holds the user's nickname.

**description:**
*Type*: string
*Required*: false
*Description*: A brief description or bio of the user.

**avatar:**
*Type*: string
*Required*: false
*Description*: URL of the user's avatar image.

**background:**
*Type*: string
*Required*: false
*Description*: URL of the user's background image.

**posts:**
*Type*: Array of Post references
*Required*: false
*Description*: References to posts made by the user.


**created_at:**
*Type*: Date
*Default*: Date.now
*Description*: Timestamp indicating when the user account was created.

##### Post:


*Fields*:

**title:**
*Type*: string
*Required*: true
*Description*: The title of the post.

**content:**
*Type*: string
*Required*: true
*Description*: The content of the post.

**image:**
*Type*: string
*Required*: true
*Description*: URL of the image associated with the post.

**userId:**
*Type*: ObjectId (reference to User)
*Required*: true
*Description*: Reference to the user who created the post.

**comments:**
*Type*: Array of Comment references
*Required*: false
*Description*: References to comments made on the post.

**likes:**
*Type*: Array of Like references
*Required*: false
*Description*: References to likes received by the post.

**created_at:**
*Type*: Date
*Default*: Date.now
*Description*: Timestamp indicating when the post was created.

##### Comment:

*Fields*:

**content:**
*Type*: string
*Required*: true
*Description*: The content of the comment.

**userId:**
*Type*: ObjectId (reference to User)
*Required*: true
*Description*: Reference to the user who made the comment.

**postId:**
*Type*: ObjectId (reference to Post)
*Required*: true
*Description*: Reference to the post on which the comment was made.

**created_at:**
*Type*: Date
*Default*: Date.now
*Description*: Timestamp indicating when the comment was created.


##### Follow:
*Fields*:

**followerId:**
*Type*: ObjectId (reference to User)
*Required*: true
*Description*: Reference to the user who is following another user.

**followedById:**
*Type*: ObjectId (reference to User)
*Required*: true
*Description*: Reference to the user who is being followed by another user.

##### Like:
*Fields*:

**postId:**
*Type*: ObjectId (reference to Post)
*Required*: true
*Description*: Reference to the post that received the like.

**userId:**
*Type*: ObjectId (reference to User)
*Required*: true
*Description*: Reference to the user who gave the like.
