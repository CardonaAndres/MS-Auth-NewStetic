import 'dotenv/config';
import app from "./app/configs/app.js";

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

