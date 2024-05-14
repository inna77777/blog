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

### MongoDB Schemas description:

##### User
A unique **login** (username or email).
A **password**.
A unique **nickname**.
**description**: Additional information about the user.
**avatar**: URL or reference to the user's profile picture.
**background**: URL or reference to the user's profile background image.
A reference to multiple **posts** created by the user.

##### Post:

A **title**.
**content**.
An **image**.
A reference to the **user** who created the post.
Optionally, a list of **comments** associated with the post.

