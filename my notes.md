- start with setting up a react vite project in this folder
- it shouldny be in a sub folder btw

---

- then start implimenting whats in the @DOCS folder

---

- you can use firebase cli to upload indexex, enable services setup rules etc
- firebase cli is already installed (lmk if u need help with firebase cli)

- here is the firebase config u can use:

```js
// Import the functions you need from the SDKs you need (npm install firebase)
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBsJdTB2vMl984SFxH8HexFWdNKXDqPUXU',
	authDomain: 'learning-staticalabs.firebaseapp.com',
	projectId: 'learning-staticalabs',
	storageBucket: 'learning-staticalabs.firebasestorage.app',
	messagingSenderId: '411557774187',
	appId: '1:411557774187:web:86a267dfb3bd1253f4422e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

For Auth we use login with google
