require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const uri = 'mongodb+srv://admin:1234@maincluster.cpvxjru.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster';
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.log(error);
  }
}

run();

const aviRoutes = require('./routes/avi-routes');
const itiRoutes = require('./routes/iti-routes');
const userRoutes = require('./routes/users-routes'); 
const commentRoutes = require('./routes/comm-routes'); 

app.use('/avi', aviRoutes);
app.use('/itineraries', itiRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);

app.listen(4000, () => {
    console.log(`Server running at http://localhost:${4000}`);
  });

app.get('/itineraries/active', async (req, res) => {
    try {
        const itinerario = await Iti.findOne({
            end_date: { $gt: new Date() } 
        });
        res.json(itinerario);
    } catch (error) {
        res.status(500).send("Error al obtener el itinerario activo");
    }
});


