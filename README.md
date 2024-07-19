# GreenOrangeSquare

A simple web-based classroom application that allows specialists to add courses with lessons, while clients can enroll in these courses and track their progress. - developed using **React.js**(and React Hooks, Redux/Context API), **Node.js**, **Express.js**, **MongoDB** and **Firebase**. The UI is built on top of **MaterialUI 5**, which is simple & light designed to provide all the basic components using the `sx` prop for a developer need to create slick page views.

<br/><br/>

This is a full-stack e-learning application that can be up and running with just a few steps. 
Its frontend is built with [Material UI](https://material-ui.com/) running on top of React.
The backend is built with Express.js, Node.js, MongoDB and Firebase
Real-time bi-directional communication features are developed using [Socket.IO](https://socket.io/).

### Features
This application provides users with the following features
<br/>

- [x]  **JWT, Google or GitHub Tokens** for user Account creation/login with and API calls to backend
- - - [X] Authentication and authorization with JWT tokens
- - - [X] Optional 24-hours valid cookies
- - - [X] Featured Specialist user profile
- - - [ ] Two-factor authentication with Google
- - - [ ] OAuth login with Google and Github
- - - [ ] Forgot password
- [x] **Browse Courses and Specialists** for visitors to buy courses or book consulation session with specialist
- - - [x] Serverside Pagination
- - - [x] Filter based on category single tag
- - - [ ] Filter based on categories multiple tags
- - - [X] Recommanded popular course based on course enrollment statistics
- [x] **Selling Course** for Specialists to publish and sell a course
- - - [X] Create, update, delete unpublished course
- - - [X] Create, update, delete lessons with lessons and previews
- - - [ ] Rich Text Editor integration for course/lesson creation
- - - [ ] Activate monthly subscription (Stripe, Shopify/Paypal) to allow Specialist to sell course
- - - [X] Queue course for verification by support team before publishing
- - - [X] Once approved, the course is published and previewable to all via search engine
- - - [X] Update published course content but not allowed to take down the course
- [x] **Buying Course** for Clients to buy a course and enroll into a course
- - - [X] Visitors/Clients can can add client to shopping cart
- - - [ ] Allow registerd Clients to buy course (Stripe, Shopify/Paypal)
- - - [X] Clients can enroll into course
- - - [X] Clients can view and complete lessons in sequence and consult course-specific specialist via chat or video call
- [x] **Global Chat** for which facilitate real-time end to end group communication between Clients, Specialist and/or site support team, encrypted using *AES (Advanced Encryption Standard)* algorithm for encrypting and decrypting the messages
- - - [X] Once enrolled in course, Clients can consult the course-specific specialist via group chat
- - - [ ] Message encryption 
- [x] **Private Chat** for private communication between Clients, Specialist and/or site support team
- - - [X] Visitors, Clients and Specialist can interact can consult support team via ChatBot
- - - [X] Once enrolled in course, Clients can consult the course-specific Specialist via one-one-one chat
- - - [ ] **Upskilling-based Consultation** for Specialist to interact with up to 10 clients simulatneous via *chat* and *video chat* for assistance in a specific technology
- - - [X] Video calling based once-off token between two registered
- - - [ ] Once enrolled in course, Clients can consult the course-specific Specialist via video chat 
- - - [ ] Message encryption 
- [x] **Course Enrollment and Certification** Client to save and track learning progress by completing short lessons in a sequence carefully curated by the Specialist to allow for smoother learning curve, self-paced learning, and easier information uptake.
- - - [X]  Dashboard for viewing enrolled in course and related sections, lessons, articles, videos, code and progress statistics
- - - [X]  Mark lesson as completed
- - - [X]  Optional video playlist sequenced according to the order of lessons
- - - [ ] Examination dashboard
- - - [ ] Auto-generate unique Certificate PDF based on details
- [x] **Course Statics** for Specilist to get enrollment and completion statics of their course.
- - - [ ] Interactive video screen 
- [ ] **Course Promotions** for Clients to buy a course that is on sale at reduced price for a fix short period
- [ ] **Course Review** for enrolled client to write a comment reviewing the course and made public for users
- [ ] **Course Rating** Upvote/Downvote a Course via star-rating
- [ ] **Specialist Rating** Upvote/Downvote a Specialist via star-rating

Take a look the live demo here 👉![GreenOrangeSquare Prototype](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png "GreenOrangeSquare")

## Snapshots
### HomePage
  ![HomePage](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />

### SignUp
  ![HomePage](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />

### SignIn
  ![HomePage](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />
  
### Specialist Profile
  ![Dashboard](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />

### Browse Courses and Specialists
  ![Dashboard](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />

### Selling Course
  ![Dashboard](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />

### Buying Course
  ![Dashboard](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />

### Global Chat
  ![Dashboard](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />

### Private Chat
  ![Dashboard](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />

### Course Enrollment and Certification
  ![Dashboard](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />

### Course Statistics
  ![Dashboard](https://github.com/mutomb/greenorangesquare/blob/skeleton/client/public/images/prototype.png)
  <br />

### [Live Demo](http://URL_To_Demo "GreenOrangeSquare") 

#### What you need to run this code
1. Node (13.12.0)
2. NPM (6.14.4)
3. MongoDB (7.0.5)

####  How to run this code
1. Make sure MongoDB is running on your system
2. git clone https://github.com/nour-karoui/secure-chat .
3. Open command line in the cloned folder,
   - To install dependencies, run ```  npm install  ```
   - To run the application for development, run ```  npm run dev  ```
4. Open [localhost:3000](http://localhost:3000/) in the browser
----

## Author

👤 **Jeanluc**

* Github: [@mutomb](https://github.com/mutomb)
* LinkedIn: [@jeanlucmutomb](https://www.linkedin.com/in/jeanlucmutomb/)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/mutomb/gosquare/issues)

## Show your support

Give a [STAR](https://github.com/mutomb/gosquare) if this project helped you

### Things to note

* The frontend is built without using [create-react-app](https://github.com/facebook/create-react-app)
* Database connections in the backend are handled using the [Mongoose ODM](https://mongoosejs.com/)
* Code quality is ensured using (ESLint)[https://eslint.org/]

### Disclaimer

This repository is not comprehensive, fully test and might contain some things I wish to change or remove. I maintain this slowly when I have free time to fix issues and add features. You are welcome to open issues if you find any and I will accept PR's as well.
<br/><br/>

Cheers 💻 🍺 🔥 🙌
