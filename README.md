# LanGarage
Fully-functional web application that introduces gamified learning of new languages. Supports more than 30 languages. Made using HTML, CSS, JavaSript and the Google Cloud API. Made during Hack@Brown 2020 by Adam Wang, Albert Zhu and Joshua Tan (me).

# Instructions
1. Download the files and ensure they are all in the same directory
2. Insert your own authorization token in line 32 of script.js
```
xhr.setRequestHeader("Authorization", 'Bearer <INSERT AUTHORIZATION TOKEN HERE>');
```
3. Open index.html to view a fully-functional LanGarage

# Check it out
Check out the home page of LanGarage at https://tanjoshua.github.io/LanGarage/. However, the quiz does not work due to the lack of an authorization token. The authorization tokens we generated expired after awhile :( However, you can still try it out if you generate your own token for the XML API! Learn how to do that here: https://cloud.google.com/storage/docs/authentication.
