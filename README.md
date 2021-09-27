![yehezgun.com](https://socialify.git.ci/yehezkielgunawan/yehez-invoice-generator/image?description=1&descriptionEditable=Generate%20simple%20invoice&language=1&logo=http%3A%2F%2Flogos-download.com%2Fwp-content%2Fuploads%2F2016%2F09%2FReact_logo_logotype_emblem.png&owner=1&pattern=Charlie%20Brown&theme=Dark)

The live version can be accessed at [https://invoice-generator.yehezgun.com/](https://invoice-generator.yehezgun.com/)

### Tools used in this project

- I made this project using [React JS](https://reactjs.org/) and [Typescript](https://www.typescriptlang.org/)
- I used [Chakra UI](https://chakra-ui.com/guides/integrations/with-cra) as a UI library.
- For the database and backend side, due to the time limit and my lack of understanding about backend details, so I've decided to use [Firebase](https://firebase.com/) as my authentication and database (No SQL based) tools.
- To deploy it, I used [Vercel](https://vercel.com). It's my current tools to integrate my github repo to the hosting platform, so I just need to push an update and it will automatically update the web.

### How to use it?

- You can open the live demo at [https://invoice-generator.yehezgun.com/](https://invoice-generator.yehezgun.com/)
- The sample account credentials can be seen [here](https://drive.google.com/drive/folders/1lk3fs0uM7tdfYivVQKSuS2AuPtygSr-i?usp=sharing) (Sheet 2)
- There are three types of accounts here. Those are **admin**, **seller**, and **buyer**.
- You only can make and delete a user account with the **admin** account. You also can see the user List if you logged in as **admin**.
- The **seller** account only can see the buyer list and generate the invoice by clicking the button in the table and fill open the modal form.
- The **buyer** only see the invoice that has been made before.

### How to run it locally?

- Clone this repo with this command `git clone https://github.com/yehezkielgunawan/yehez-invoice-generator.git`
- Don't forget to go into the directory (yehez-invoice-generator) by command `cd yehez-invoice-generator`
- Install the dependencies using `npm install` or `yarn`.
- Run the app using `yarn start` or `npm start`.

### Notes

- For the testing process, I used manual test using the test case list that I have made [here](https://drive.google.com/drive/folders/1lk3fs0uM7tdfYivVQKSuS2AuPtygSr-i?usp=sharing) (Sheet 1) because of the time limit and I'm not understand about unit testing fully yet.
- I didn't use Redux because I think Firebase and [React Fire](https://github.com/FirebaseExtended/reactfire) has the built-in context provider, so I can use it and call it at many components that I need.
- The firebase config can be seen at `src\constants\firebaseConfig.ts`
- For the user role validation, because Firebase don't have the built-in role authentication, so I decided to make a manual validation. If the email contains the word of `seller`, the role is a seller and when logged in, it will redirect to the seller page, and so the buyer account.
- Let me know if there's some feedback for this project.
