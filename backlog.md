# ready to work

[x] need an indicator that the user needs to login to access all modules and paths, and data is saved only for logged in users
    - Added amber lock banner in sidebar for guests (desktop + mobile)
    - Shows "Sign in to unlock" with explanation and sign-in link

[x] need a landing page at URL/home
    - Added `/home` route aliasing `HomePage` in App.tsx

[x] Dont show the users google avatar, instead add a emoji there, should be customizable
    - Replaced all photo usage with emoji in Layout, ProfilePage
    - Default: 🧑‍💻; customizable via Settings > Avatar Emoji picker (16 options)
    - Stored in Firestore `users/{uid}.avatarEmoji`

# still drafting / needs review

[ ] python module needs update....

- from now on lets make a detailed plan for each module manually
- NO AI for content , AI will only be used to format and code the content, fact check a lil, and bring everything together in a nice structured package.
