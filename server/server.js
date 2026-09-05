import "dotenv/config"; //put this before importing app.js file, because we are using env variables in app.js file
import app from "./app.js"


const PORT = process.env.PORT;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});