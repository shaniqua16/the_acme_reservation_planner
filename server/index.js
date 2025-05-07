require("dotenv").config(); 
const express = require('express');
const cors = require('cors'); 
const db = require('./db'); 

const app = express();
const pg = require('pg');
const port = process.env.PORT || 3000; 


app.use(cors());
app.use(express.json());
const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/acme_hr");

app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
   });


app.get('/api/customers', async (req, res, next) => {
    try {
        res.send(await db.fetchCustomers());
    } catch (ex) {
        next(ex);
    }
});

app.use((error, req,res, next)=> {
       res.status(res.status || 500).send({
           error: error
       })
       }
       );

app.get('/api/restaurants', async (req, res, next) => {
    try {
        res.send(await db.fetchRestaurants());
    } catch (ex) {
        next(ex);
    }
});

    

app.get('/api/reservations', async (req, res, next) => {
    try {
        res.send(await db.fetchReservations());
    } catch (ex) {
        next(ex);
    }
});


app.post('/api/customers/:id/reservations', async (req, res, next) => {
    try {
        const { restaurant_id, date, party_count } = req.body;
        if (!restaurant_id || !date || !party_count) {
            return res.status(400).send({ error: 'restaurant_id, date, and party_count are required' });
        }
        const reservationData = {
            customer_id: req.params.id,
            restaurant_id,
            date,
            party_count
        };
        const reservation = await db.createReservation(reservationData);
        res.status(201).send(reservation);
    } catch (ex) {
        next(ex);
    }
});


app.delete('/api/customers/:customer_id/reservations/:id', async (req, res, next) => {
    try {
        
        await db.destroyReservation(req.params.id);
        res.sendStatus(204);
    } catch (ex) {
        next(ex);
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(err.status || 500).send({ error: err.message || 'Something went wrong!' });
});


const init = async () => {
    try {
        await db.client.connect();
        console.log('Connected to the database');

        await db.createTables();
        console.log('Tables created successfully');

        
        const [customer1, customer2, restaurant1, restaurant2] = await Promise.all([
            db.createCustomer('Alice Wonderland'),
            db.createCustomer('Bob The Builder'),
            db.createRestaurant('The Mad Hatter Tea Party'),
            db.createRestaurant('Bob\'s Burger Joint')
        ]);
        console.log('Seeded customers:', await db.fetchCustomers());
        console.log('Seeded restaurants:', await db.fetchRestaurants());

        await db.createReservation({
            customer_id: customer1.id,
            restaurant_id: restaurant1.id,
            date: '2024-10-26',
            party_count: 4
        });
        console.log('Seeded reservations:', await db.fetchReservations());

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error('Error during initialization:', error);
    }
}


init();



// const express = require('express');
// const app = express();
// const port = 3000;
// const pg = require('pg');
// app.use(cors());
// app.use(express.json());
// const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/acme_hr");

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// app.use((error, req,res, next)=> {
//     res.status(res.status || 500).send({
//         error: error
//     })
//     }
//     );

    