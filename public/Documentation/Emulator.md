To use firebase emulator:

Go to gruppe32\IceBreaker\src\Firebase\firebase.tsx and change the isLocal variable to true.

Then run the following commands in the terminal:

1. npm install firebase
2. npm install -g firebase-tools
3. firebase init
    * select `Firestore` and `authentication`
    * select `Use an existing project`
    * select `Emulators` and `Firestore` and `Authentication`
    * select default for all port numbers etc.

4. firebase emulators:start
5. Go to the ip-address link that will show up, to see the emulators.
