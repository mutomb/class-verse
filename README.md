# GO<sup>2</sup>

A simple web-based classroom application that allows specialists to add courses with lessons, while clients can enroll in these courses and track their progress. - developed using the latest versions of **React.js**(React Hooks, Redux/Context API), **Node.js**, **Express.js** and **MongoDB** (Mongoose). The UI is built on top of **MaterialUI 5**, which is simple & light designed to provide all the basic components using the `sx` prop for a developer need to create slick page views.

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

Dark Theme            |  Light Theme
:-------------------------:|:-------------------------:
![localhost_3000_ (3)](https://github.com/user-attachments/assets/b9cf547b-8b8d-406a-8aff-7c12c8f9a18c) | ![localhost_3000_ (1 1)](https://github.com/user-attachments/assets/45267c82-bf23-4e5b-b377-9c471fc6396e)

### SignUp

Extra Small                    |Small                      | Medium+
:-------------------------:|:-------------------------:|:-------------------------:
![localhost_3000_ (11)](https://github.com/user-attachments/assets/50e34fba-367c-4042-9ece-8adc283c5d6c)  |  ![localhost_3000_ (10)](https://github.com/user-attachments/assets/cfa12ea6-fbdd-47d1-8916-6e80d9c57a2b)  | ![localhost_3000_ (9)](https://github.com/user-attachments/assets/1194c9d4-899f-4698-a67d-ac8083a0ac87)



### SignIn
Extra Small                    |Small                      | Medium+
:-------------------------:|:-------------------------:|:-------------------------:
  
### Specialist Profile

Extra Small                    |Small                      | Medium+
:-------------------------:|:-------------------------:|:-------------------------:
![localhost_3000_ (21)](https://github.com/user-attachments/assets/b46f4eee-e739-41a5-939a-3719db45d456)  | ![localhost_3000_ (20)](https://github.com/user-attachments/assets/97c5e4d2-f083-4904-bf70-82a5fad28d49)  | ![localhost_3000_ (19)](https://github.com/user-attachments/assets/fdac4e1a-0337-43e1-b910-4bf04aea12cf)


### Browse Courses and Specialists

Extra Small                    |Small                      | Medium+
:-------------------------:|:-------------------------:|:-------------------------:

### Selling Course

Extra Small                    |Small                      | Medium+
:-------------------------:|:-------------------------:|:-------------------------:
![localhost_3000_](https://github.com/user-attachments/assets/50d2f53e-5015-484f-a878-aee1b51137f8)  |  ![localhost_3000_ (2)](https://github.com/user-attachments/assets/cc036a18-088b-43de-b409-ba500727cc54) |  ![gosquare onrender com_](https://github.com/user-attachments/assets/bff3908c-9ab1-46ad-9128-54a971869a1d)


### Buying Course

Extra Small                    |Small                      | Medium+
:-------------------------:|:-------------------------:|:-------------------------:
![localhost_3000_ (8)](https://github.com/user-attachments/assets/c9e530a6-018c-478b-9b83-fc6235814f99)  | | ![localhost_3000_ (7)](https://github.com/user-attachments/assets/e12be8e4-eb41-4765-8b30-ab25fec1788c)

### Course-based Specialist Consulation via Global and Private Chat and video call

Extra Small                    |Small                      | Medium+
:-------------------------:|:-------------------------:|:-------------------------:
![localhost_3000_ (18)](https://github.com/user-attachments/assets/eb72db60-80bb-401e-8cfb-03438d1cf786) |  ![localhost_3000_ (17)](https://github.com/user-attachments/assets/409f9058-bb82-475d-9f79-8638479900fb)  |  ![localhost_3000_ (16)](https://github.com/user-attachments/assets/dc0c1984-ff7f-4c3a-8101-13cffab06162)
:-------------------------:|:-------------------------:|:-------------------------:
![localhost_3000_ (24)](https://github.com/user-attachments/assets/c232c1c0-f417-4f42-ae6d-1a7075c3aafb)  | ![localhost_3000_ (23)](https://github.com/user-attachments/assets/c16ffe6a-108c-458e-ac10-ef4000636a71)  |  ![localhost_3000_ (22)](https://github.com/user-attachments/assets/4516216f-bb8e-4e79-999b-c060b82a884f)

### Customer Service and ChatBot
For visitors and registered users to interact with Support team</br>
Extra Small                    |Small                      | Medium+
:-------------------------:|:-------------------------:|:-------------------------:
![localhost_3000_ (5)](https://github.com/user-attachments/assets/12fce53d-b6c8-45dd-b447-ff5507c80a6c)  |  ![localhost_3000_ (6)](https://github.com/user-attachments/assets/e78e4948-2d5c-4f57-b1c9-97c2446780fd)  | ![localhost_3000_ (4)](https://github.com/user-attachments/assets/49bafcae-e8d8-4afd-9973-b07197029fb3)

### Course Enrollment and Progress Tracking

Extra Small                    |Small                      | Medium+
:-------------------------:|:-------------------------:|:-------------------------:
![localhost_3000_ (14)](https://github.com/user-attachments/assets/f24e7b69-8660-4377-84f3-1769c27b4074)  | ![localhost_3000_ (13)](https://github.com/user-attachments/assets/2b1b03e9-94b1-4aab-848e-fddb81fcc610)  | ![localhost_3000_ (12)](https://github.com/user-attachments/assets/256b695a-7306-4f9a-bfd0-e55fc547d32e)


### Course Completion Certification

Extra Small                    |Small                      | Medium+
:-------------------------:|:-------------------------:|:-------------------------:

### [Live Demo](http://URL_To_Demo "GreenOrangeSquare") 

#### What you need to run this code
1. Node (20.15.1)
2. NPM (10.7.0)
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
